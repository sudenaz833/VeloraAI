using ShopAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using ShopAPI.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class BasketController : ControllerBase
    {
        private readonly IBasketService _basketService;
        private readonly ICustomerService _customerService;
        
        public BasketController(IBasketService basketService,ICustomerService customerService)
        {
            _basketService = basketService;
            _customerService = customerService;
        }

        
        [HttpGet("{customerId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<BasketReadDto>>> GetAllBasketAsync(int customerId)
        {
            var basketItems = await _basketService.GetAllBasketAsync(customerId);
            return Ok(basketItems);
        }

       
        [HttpGet]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<BasketReadDto>>> GetMyBasketAsync()
        {
            var userId = GetUserId();
            var basket = await _basketService.GetMyBasketByCustomerIdAsync(userId);
            if (basket == null || !basket.Any()) return Ok(new List<BasketReadDto>());
            return Ok(basket);
        }

       
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AddToBasketAsync(BasketCreateDto basketDto)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst("sub");
            if (claim == null) return Unauthorized("Token içinde kimlik bilgisi bulunamadı");
            int userId = int.Parse(claim.Value);
            var result = await _customerService.AddToBasketAsync(userId, basketDto);
            if (result == null) return BadRequest("Ürün sepete eklenemedi.");
            return Ok(result);
        }

    
        [HttpPut("{id}")]
        [Authorize(Roles = "User")]
        public async Task <IActionResult> UpdateBasketAsync(int id, BasketUpdateDto updateDto)
        {
            var userId = GetUserId();
            // Servise userId'yi de gönderiyoruz ki başkasının sepetini güncellenmesin
            var updatedBasket = await _basketService.UpdateBasketAsync(userId, id, updateDto); 
            if (updatedBasket == null)
                return NotFound("Sepetinizde bu ürün bulunamadı veya yetkiniz yok.");

            return Ok(updatedBasket);
        }

       
        [HttpDelete("{id}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> DeleteBasketAsync(int id)
        {
            var userId = GetUserId();
            var isDeleted =await  _basketService.DeleteBasketAsync(userId, id);
            if (!isDeleted)
                return NotFound("Silinecek ürün bulunamadı veya yetkiniz yok.");

            return Ok("Ürün başarıyla sepetten silindi.");
        }

        [HttpDelete("clear")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> ClearMyBasketAsync()
        {
            var userId = GetUserId();
            var isCleared = await _basketService.ClearBasketAsync(userId);
            if (!isCleared)
                return BadRequest("Sepetiniz zaten boş veya temizlenemedi.");

            return Ok("Sepetiniz başarıyla boşaltıldı.");
        }

        // Token'dan ID çekme
        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if(claim == null)
            {
                throw new Exception("Token içinde kullanıcı ID'si bulunamadı");
            }
            return int.Parse(claim.Value);
              
        }
    }
}