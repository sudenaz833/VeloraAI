using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("admin-test")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAdminData()
        {
            return Ok("Hoşgeldin admin");
        }
    }
}
