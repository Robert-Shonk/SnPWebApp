using Microsoft.EntityFrameworkCore;
using SnpWebApp.Data;
using SnpWebApp.Data.DTO;
using SnpWebApp.Service.Interfaces;

namespace SnpWebApp.Service
{
    public class DbService : IDbService
    {
        private readonly SnpDbContext _context;

        public DbService(SnpDbContext context)
        {
            _context = context;
        }
        
        // Get all 500 stock symbols from snp table.
        public async Task<List<string>> GetAllStockSymbolsAsync()
        {
            var symbols = await _context.Snps.Select(snp => snp.Symbol).ToListAsync();

            return symbols;
        }

        // Gets year-to-date data for specific stock by symbol.
        public async Task<List<Stock>> GetStockBySymbolAsync(string symbol)
        {
            var stocks = await _context.Stocks.Where(stock => stock.Symbol == symbol.ToUpper()).ToListAsync();

            return stocks;
        }

        public async Task<IQueryable<IGrouping<int, Stock>>> GroupStockByMonthAsync(string symbol)
        {
            var monthGroups = await Task.Run(() => _context.Stocks
                .Where(stock => stock.Symbol == symbol.ToUpper())
                .GroupBy(s => s.Date.Month));

            return monthGroups;
        }

        public async Task<StockAggDTO> GetStockAggDTOAsync(string symbol)
        {
            var monthGroups = await GroupStockByMonthAsync(symbol);

            int monthCount;
            double monthAvgClose;
            double monthDevSum;
            List<double> monthlyMeans = new List<double>();
            List<double> standardDeviationsByMonth = new List<double>();
            foreach (var month in monthGroups)
            {
                monthAvgClose = month.Average(a => a.Close);
                monthlyMeans.Add(monthAvgClose);

                monthCount = month.Count();
                monthDevSum = 0;
                foreach (var day in month)
                {
                    monthDevSum += Math.Pow((day.Close - monthAvgClose), 2);
                }

                standardDeviationsByMonth.Add(Math.Sqrt(monthDevSum / monthCount));
            }

            StockAggDTO stockAggData = new StockAggDTO
            {
                Symbol = symbol,
                MonthlyMeans = monthlyMeans,
                MonthlyStds = standardDeviationsByMonth,
            };

            return stockAggData;
        }

        // group by sectors and return every stock's ytd.
        public IQueryable JoinSnpStock()
        {
            var result = _context.Snps
                .Join(
                    _context.Stocks,
                    snp => snp.Symbol,
                    stock => stock.Symbol,
                    (snp, stock) => new
                    {
                        Symbol = snp.Symbol,
                        Security = snp.Security,
                        Sector = snp.Sector,
                        SubSector = snp.SubIndustry,
                        DateAddedToList = snp.DateAdded,
                        CIK = snp.Cik,
                        Date = stock.Date,
                        Close = stock.Close,
                        Volume = stock.Volume,
                        Move = stock.Move
                    }
                )
                .GroupBy(snp => snp.Sector);

            foreach (var group in result)
            {
                var grp = group.GroupBy(g => g.Symbol);
                Console.WriteLine(group.Key);
                foreach (var g in grp)
                {
                    var first = g.OrderByDescending(d => d.Date).First();
                    Console.WriteLine($"{first.Symbol}, Date: {first.Date}, Move: {first.Move}");
                }
            }

            return result;
        }

        public async Task<List<SectorDTO>> SectorBySectorPerformanceAsync()
        {
            var result = await Task.Run(() => _context.Snps
                .Join(
                    _context.Stocks,
                    snp => snp.Symbol,
                    stock => stock.Symbol,
                    (snp, stock) => new
                    {
                        Symbol = snp.Symbol,
                        Sector = snp.Sector,
                        Date = stock.Date,
                        Move = stock.Move
                    }
                )
                .GroupBy(snp => snp.Sector));

            List<SectorDTO> sectorPerformance = new List<SectorDTO>();
            List<double> moves; // for each sector, make a list of each stock's most recent move.
            double sectorMean; // the average of each sector move
            foreach (var sector in result)
            {
                moves = new List<double>();

                var stockGroups = sector.GroupBy(g => g.Symbol);
                foreach (var g in stockGroups)
                {
                    var first = g.OrderByDescending(d => d.Date).First();
                    moves.Add(first.Move);
                }

                sectorMean = moves.Average();

                sectorPerformance.Add(new SectorDTO()
                {
                    SectorName = sector.Key,
                    SectorMoveMean = sectorMean
                });
            }

            return sectorPerformance;
        }
    }
}
