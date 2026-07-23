using Microsoft.AspNetCore.Mvc;
using ShopAPI.Services;
using ShopAPI.Entities;
using Microsoft.AspNetCore.Authorization;
namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private ICustomerService _customerService;
        public AuthController(ITokenService tokenService, ICustomerService customerService)
        {
            _tokenService = tokenService;
            _customerService = customerService;
        }
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task <IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var customer = await _customerService.Authenticate(loginDto);
            if(customer == null) return Unauthorized("Email veya şifre hatalı.");

            var token =  _tokenService.CreateToken(customer.CustomerId.ToString(), customer.Email, customer.Role);
return Ok(new
{
    Token = token,
});
        }
    }
}