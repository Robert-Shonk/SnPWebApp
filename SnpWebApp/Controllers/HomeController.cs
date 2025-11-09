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
    }
}
