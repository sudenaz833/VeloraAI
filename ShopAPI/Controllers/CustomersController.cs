using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopAPI.Data;
using ShopAPI.Entities;
using System.Collections.Generic;
using ShopAPI.DTOs;
using System.Linq;
using ShopAPI.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ShopAPI.Controllers
{
    [ApiController] // bu sınıf bi apı controller
    [Route("api/[controller]")] // Bu, tarayıcıda "api/customers" adresine git demek

    public class CustomersController : ControllerBase // miras alınan sınıf sayesine ok not found vb döner
    {
        private readonly ICustomerService _customerService;
      

        public CustomersController(ICustomerService customerService) //Dependency Injection
        {
            _customerService = customerService;
          
            
        }
    //AuthControllerda login var 
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task <IActionResult> Register(CustomerCreateDto customerDto)
        {
            var newCustomer = await _customerService.RegisterCustomerAsync(customerDto);


            if (newCustomer == null)
                return BadRequest("Kayıt oluşturulamadı, bilgileriniz hatalı olabilir.");

            return Ok(newCustomer);
        }
        [HttpGet("my-profile")]
        [Authorize]
        public async Task<ActionResult<CustomerReadDto>>GetMyProfileAsync()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null)
                return Unauthorized();
            var customer = await _customerService.GetCustomerByIdAsync(int.Parse(userIdString));
            if (customer == null) return NotFound("profil bulunamadı.");
            return Ok(customer);
        }

        [HttpGet]// tüm müşterileri getirir
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<CustomerReadDto>>> GetAllCustomersAsync()
        {
            var customers = await _customerService.GetAllCustomersAsync();
            return Ok(customers);

        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CustomerReadDto>> GetCustomerByIdAsync(int id)
        {
            var customer = await  _customerService.GetCustomerByIdAsync(id);
            if (customer == null) return NotFound("Bu ID'ye sahip birisi yok");
            return Ok(customer);
        }

        // POST: api/customers (Yeni bir müşteri ekler)
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<CustomerReadDto>> CreateCustomerAsync(CustomerCreateDto customerDto)
        {
            var createdCustomer = await  _customerService.CreateCustomerAsync(customerDto);
            return Ok(createdCustomer);

        }
        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateCustomerAsync(CustomerUpdateDto updateDto)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return Unauthorized("Token içinde kimlik bilgisi bulunamadı");
            }
            var userId = int.Parse(claim.Value);

            var updatedCustomer = await _customerService.UpdateCustomerAsync(userId, updateDto);
            if (updatedCustomer == null) return NotFound("Müşteri bulunamadı");
            return Ok(updatedCustomer);

        }
        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteCustomerAsync()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null) return Unauthorized();
            int userId = int.Parse(userIdString);
            var deleted = await  _customerService.DeleteCustomerAsync(userId);
            if (!deleted) return NotFound("Hesap bulunamadı ve silinemedi.");
            return Ok("Hesabınız başarıyla silindi.");
        }

        // Admin için bir müşteriyi ID'si ile silme
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCustomerByIdAsync(int id)
        {
            var deleted = await _customerService.DeleteCustomerAsync(id);
            if (!deleted) return NotFound("Müşteri bulunamadı.");
            return Ok("Müşteri hesabı silindi.");
        }
    }

}