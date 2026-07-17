using ShopAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using ShopAPI.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // Kendi siparişlerini listeleme (User) veya Admin'in tümünü görmesi
        [HttpGet("customer/{customerId}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetOrderbyCustomer(int customerId)
        {
            var userIdFromToken = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin && userIdFromToken != customerId.ToString())
            {
                return Forbid();
            }

            var order = await  _orderService.GetOrderByCustomerAsync(customerId);
            if (order == null || !order.Any()) return NotFound("Sipariş bulunadı.");
            return Ok(order);
        }

        // Tüm siparişleri listeleme 
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<OrderReadDto>>> GetAllOrdersAsync()
        {
            return Ok( await _orderService.GetAllOrdersAsync());
        }

        // Yeni sipariş oluşturma 
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<OrderReadDto>> CreateOrderAsync()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized("Giriş yapmanız gerekiyor!");
            if (!int.TryParse(userIdClaim, out int customerId))
                return BadRequest("Geçersiz kullanıcı kimliği");

            try
            {
                var createdOrder = await _orderService.CreateOrderAsync(customerId);

                if (createdOrder == null)
                {
                    return BadRequest("Sipariş oluşturulamadı! Sepetiniz boş olabilir.");
                }

                return CreatedAtAction(nameof(GetOrderbyCustomer), new { customerId = createdOrder.CustomerId }, createdOrder);
            }
            catch (Exception ex)
            {
                // Stok yetersizliği gibi servis hatalarını 400 Bad Request ve temiz bir mesajla dönüyoruz
                return BadRequest(ex.Message);
            }
        }

        // Admin için sipariş durumu güncelleme
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task <IActionResult> UpdateOrderStatusAsync(int id, [FromBody] string newStatus)
        {
            var validStatuses = new[] { "Hazırlanıyor.", "Kargoya Verildi.", "Teslim Edildi.", "İptal Edildi." };
            
            if (!validStatuses.Contains(newStatus))
            {
                return BadRequest("Geçersiz sipariş durumu.");
            }

            var success = await _orderService.UpdateStatusAsync(id, newStatus);
            if (!success) return NotFound("Sipariş bulunamadı.");
            
            return Ok(new { Message = $"Sipariş durumu '{newStatus}' olarak güncellendi." });
        }

        // Admin için siparişi silme
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteOrderAsync(int id)
        {
            var deleted = await _orderService.DeleteOrderAsync(id);
            if (!deleted) return NotFound("Sipariş bulunamadı.");
            return Ok("Sipariş veritabanından silindi.");
        }
    }
}