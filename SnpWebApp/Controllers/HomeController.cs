using Microsoft.AspNetCore.Mvc;

namespace SnpWebApp.Controllers
{
    [Route("/")]
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return File("index.html", "text/html");
        }

        [HttpGet("sectors")]
        public IActionResult Sectors()
        {
            return File("sectors.html", "text/html");
        }
    }
}
