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

        public async Task<Dictionary<string, string>> GetAllStockNamesAsync()
        {
            var stockNames = await _context.Snps.Select(snp => new { snp.Symbol, snp.Security }).ToDictionaryAsync(k => k.Symbol, k => k.Security);

            return stockNames;
        }

        // Gets year-to-date data for specific stock by symbol.
        public async Task<List<Stock>> GetStockBySymbolAsync(string symbol)
        {
            var stocks = await _context.Stocks.Where(stock => stock.Symbol == symbol.ToUpper()).OrderByDescending(d => d.Date).ToListAsync();

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
        public async Task<Dictionary<string, SectorTopDTO>> SectorStatsAsync()
        {
            var result = await Task.Run(() => _context.Snps
                .Join(
                    _context.Stocks,
                    snp => snp.Symbol,
                    stock => stock.Symbol,
                    (snp, stock) => new
                    {
                        Symbol = snp.Symbol,
                        Security = snp.Security,
                        Sector = snp.Sector,
                        Date = stock.Date,
                        Close = stock.Close,
                        Move = stock.Move
                    }
                )
                .GroupBy(snp => snp.Symbol));

            List<StockJoinDTO> recentStocks = new List<StockJoinDTO>();
            foreach (var stockGroup in result)
            {
                var mostRecent = stockGroup.OrderByDescending(s => s.Date).First();
                recentStocks.Add(new StockJoinDTO
                {
                    Symbol = mostRecent.Symbol,
                    Security = mostRecent.Security,
                    Sector = mostRecent.Sector,
                    Date = mostRecent.Date,
                    Close = mostRecent.Close,
                    Move = mostRecent.Move
                });
            }

            Dictionary<string, SectorTopDTO> sectGroups = new Dictionary<string, SectorTopDTO>();
            var groupRecentBySector = recentStocks.GroupBy(s => s.Sector);
            foreach (var group in groupRecentBySector)
            {
                string sectorName = group.Key;
                var top20 = group.OrderByDescending(g => g.Move).Take(20).ToList();
                var bot20 = group.OrderBy(g => g.Move).Take(20).ToList();

                sectGroups.Add(sectorName, new SectorTopDTO { Top20 = top20, Bot20 = bot20 });
            }

            return sectGroups;
        }

        public async Task<Dictionary<string, double>> SectorBySectorPerformanceAsync()
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

            Dictionary<string, double> sectPerf = new Dictionary<string, double>();
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

                sectPerf.Add(sector.Key, sectorMean);
            }

            return sectPerf.OrderByDescending(s => s.Value).ToDictionary<string, double>();
        }

        public async Task<Daily> GetDailyAsync()
        {
            var daily = await _context.Dailies.FirstOrDefaultAsync();

            if (daily == null)
            {
                return null;
            }

            return daily;
        }

        // insert functions
        public int InsertStocks(List<StockDTO> stockDtos)
        {
            if (stockDtos.Count > 0)
            {
                List<Stock> stocks = new List<Stock>();
                foreach (var dto in stockDtos)
                {
                    stocks.Add(new Stock()
                    {
                        Symbol = dto.Symbol,
                        Date = dto.Date,
                        Open = dto.Open,
                        High = dto.High,
                        Low = dto.Low,
                        Close = dto.Close,
                        Volume = dto.Volume,
                        Move = dto.Move
                    });
                }

                _context.AddRange(stocks);
                _context.SaveChanges();

                return 201;
            }
            
            return 400;
        }


        // insert daily
        public int InsertDaily(DailyDTO dailyDto)
        {
            Daily daily = new Daily()
            {
                Points = dailyDto.Points,
                Change = dailyDto.Change,
                Move = dailyDto.Move,
                Date = dailyDto.Date
            };

            _context.Dailies.Add(daily);
            _context.SaveChanges();
            return 201;
        }

        // update daily
        public int UpdateDaily(DailyDTO dailyDto)
        {
            var updateDaily = _context.Dailies.First();

            if (updateDaily != null)
            {
                updateDaily.Points = dailyDto.Points;
                updateDaily.Change = dailyDto.Change;
                updateDaily.Move = dailyDto.Move;
                updateDaily.Date = dailyDto.Date;
            }

            _context.SaveChanges();

            return 201;
        }

        // replace snp table with new data
        public int ReplaceSnp(List<SnpDTO> snpDtos)
        {
            var snps = _context.Snps.ToList();
            _context.Snps.RemoveRange(snps);

            List<Snp> updateSnps = new List<Snp>();

            foreach (var dto in snpDtos)
            {
                updateSnps.Add(new Snp
                {
                    ExchangeUrl = dto.ExchangeUrl,
                    Symbol = dto.Symbol,
                    Security = dto.Security,
                    Sector = dto.Sector,
                    SubIndustry = dto.SubIndustry,
                    HqLocation = dto.HqLocation,
                    DateAdded = dto.DateAdded,
                    Cik = dto.Cik,
                    Founded = dto.Founded
                });
            }

            _context.AddRange(updateSnps);
            _context.SaveChanges();
            Console.WriteLine("Snp table replaced.");

            return 204;
        }


        // delete functions
        public int DeleteStocks(List<string> stocks)
        {
            foreach (var stock in stocks)
            {
                var deleteStocks = _context.Stocks.Where(s => s.Symbol == stock).ToList();
                _context.RemoveRange(deleteStocks);
            }

            _context.SaveChanges();

            return 204;
        }
    }
}
