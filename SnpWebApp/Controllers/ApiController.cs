using Microsoft.AspNetCore.Mvc;
using SnpWebApp.Service.Interfaces;

namespace SnpWebApp.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class ApiController : ControllerBase
    {
        private readonly IDbService _dbService;

        public ApiController(IDbService dbService)
        {
           _dbService = dbService;
        }

        // gets all stock ticker symbols
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var stockSymbols = await _dbService.GetAllStockSymbolsAsync();

            if (stockSymbols.Count() == 0)
            {
                return NotFound();
            }

            return Ok(stockSymbols);
        }

        // get all stock company names
        [HttpGet("names")]
        public async Task<IActionResult> GetStockNames()
        {
            var stockNames = await _dbService.GetAllStockNamesAsync();

            if (stockNames.Count() == 0)
            {
                return NotFound();
            }

            return Ok(stockNames);
        }

        [HttpGet("stock/{symbol}")]
        public async Task<IActionResult> GetStockBySymbol(string symbol)
        {
            var stocks = await _dbService.GetStockBySymbolAsync(symbol);

            return Ok(stocks);
        }

        [HttpGet("stock/aggregate/{symbol}")]
        public async Task<IActionResult> AggStock(string symbol)
        {
            var agg = await _dbService.GetStockAggDTOAsync(symbol);

            return Ok(agg);
        }

        [HttpGet("sectors")]
        public IActionResult JoinTables()
        {
            var join = _dbService.JoinSnpStock();

            return Ok(join);
        }

        [HttpGet("sectorPerformance")]
        public async Task<IActionResult> SectorPerformance()
        {
            var sect = await _dbService.SectorBySectorPerformanceAsync();

            return Ok(sect);
        }
    }
}
