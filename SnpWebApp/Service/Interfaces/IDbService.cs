using SnpWebApp.Data;
using SnpWebApp.Data.DTO;

namespace SnpWebApp.Service.Interfaces
{
    public interface IDbService
    {
        Task<List<string>> GetAllStockSymbolsAsync();
        Task<Dictionary<string, string>> GetAllStockNamesAsync();
        Task<List<Stock>> GetStockBySymbolAsync(string symbol);
        Task<IQueryable<IGrouping<int, Stock>>> GroupStockByMonthAsync(string symbol);
        Task<StockAggDTO> GetStockAggDTOAsync(string symbol);
        Task<Dictionary<string, SectorTopDTO>> SectorStatsAsync();
        Task<Dictionary<string, double>> SectorBySectorPerformanceAsync();
        Task<Daily> GetDailyAsync();
        int InsertDaily(DailyDTO dailyDto);
        int UpdateDaily(DailyDTO dailyDto);
        int ReplaceSnp(List<SnpDTO> snpDtos);
        int InsertStocks(List<StockDTO> stockDtos);
        int DeleteStocks(List<string> stocks);
    }
}
