using Microsoft.AspNetCore.Mvc;
using SnpWebApp.Data.DTO;
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

        // GET requests
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
        public async Task<IActionResult> JoinTables()
        {
            var join = await _dbService.SectorStatsAsync();

            return Ok(join);
        }

        [HttpGet("sectorPerformance")]
        public async Task<IActionResult> SectorPerformance()
        {
            var sect = await _dbService.SectorBySectorPerformanceAsync();

            return Ok(sect);
        }

        [HttpGet("daily")]
        public async Task<IActionResult> GetDaily()
        {
            var daily = await _dbService.GetDailyAsync();

            return Ok(daily);
        }

        // POST requests
        [HttpPost("/insertstocks")]
        public IActionResult InsertStocks(List<StockDTO> stockDtos)
        {
            var insertStocks = _dbService.InsertStocks(stockDtos);
            Console.WriteLine(insertStocks);

            return Ok("stocks inserted");
        }


        [HttpPost("/insertdaily")]
        public IActionResult InsertDaily(DailyDTO dailyDto)
        {
            var insertDaily = _dbService.InsertDaily(dailyDto);
            Console.WriteLine(insertDaily);
            return Ok(insertDaily);
        }

        [HttpPost("/replacesnp")]
        public IActionResult UpdateSnpList(List<SnpDTO> snpDtos)
        {
            var res = _dbService.ReplaceSnp(snpDtos);

            if (res != 204)
            {
                return BadRequest(res);
            }

            return Ok(res);
        }

        // PUT requests
        [HttpPut("/updatedaily")]
        public IActionResult UpdateDaily(DailyDTO dailyDto)
        {
            var updateDaily = _dbService.UpdateDaily(dailyDto);
            Console.WriteLine(updateDaily);
            return Ok(updateDaily);
        }

        // DELETE requests
        [HttpDelete("/deletestocks")]
        public IActionResult DeleteStocks(List<string> stocks)
        {
            var deleteStocks = _dbService.DeleteStocks(stocks);
            Console.WriteLine("stocks deleted");

            return Ok("stocks deleted");
        }
    }
}
