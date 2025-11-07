using Microsoft.EntityFrameworkCore;
using SnpWebApp.Data;
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

        public async Task<List<string>> GetAllStockSymbolsAsync()
        {
            var symbols = await _context.Snps.Select(snp => snp.Symbol).ToListAsync();

            return symbols;
        }

        public async Task<List<Stock>> GetStockBySymbolAsync(string symbol)
        {
            var stocks = await _context.Stocks.Where(stock => stock.Symbol == symbol.ToUpper()).ToListAsync();

            return stocks;
        }
    }
}
