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

        // Returns year-to-date data along with calculated daily return percentages as Move.
        // Initial Move will be 0.
        public async Task<List<StockDTO>> GetStockDTOBySymbolAsync(string symbol)
        {
            var stocks = await GetStockBySymbolAsync(symbol);

            stocks = stocks.OrderBy(d => d.Date).ToList();

            List<StockDTO> stockDTOs = new List<StockDTO>();

            stockDTOs.Add(new StockDTO()
            {
                Symbol = stocks[0].Symbol,
                Date = stocks[0].Date,
                Open = stocks[0].Open,
                High = stocks[0].High,
                Low = stocks[0].Low,
                Close = stocks[0].Close,
                Volume = stocks[0].Volume,
                Move = 0
            });

            for (int i = 1; i < stocks.Count; i++)
            {
                stockDTOs.Add(new StockDTO()
                {
                    Symbol = stocks[i].Symbol,
                    Date = stocks[i].Date,
                    Open = stocks[i].Open,
                    High = stocks[i].High,
                    Low = stocks[i].Low,
                    Close = stocks[i].Close,
                    Volume = stocks[i].Volume,
                    Move = ((stocks[i].Close / stocks[i-1].Close) - 1)*100
                });
            }

            return stockDTOs;
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
    }
}
