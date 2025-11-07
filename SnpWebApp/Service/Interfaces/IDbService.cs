using SnpWebApp.Data;

namespace SnpWebApp.Service.Interfaces
{
    public interface IDbService
    {
        Task<List<string>> GetAllStockSymbolsAsync();
        Task<List<Stock>> GetStockBySymbolAsync(string symbol);
    }
}
