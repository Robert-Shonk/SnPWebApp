using SnpWebApp.Data;
using SnpWebApp.Data.DTO;

namespace SnpWebApp.Service.Interfaces
{
    public interface IDbService
    {
        Task<List<string>> GetAllStockSymbolsAsync();
        Task<List<Stock>> GetStockBySymbolAsync(string symbol);
        Task<IQueryable<IGrouping<int, Stock>>> GroupStockByMonthAsync(string symbol);
        Task<StockAggDTO> GetStockAggDTOAsync(string symbol);
        IQueryable JoinSnpStock();
        List<SectorDTO> SectorBySectorPerformance();
    }
}
