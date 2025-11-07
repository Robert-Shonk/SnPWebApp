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
    }
}
