using ShopAPI.Data;
using ShopAPI.Entities;
using ShopAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using ShopAPI.Services;
using AutoMapper;

namespace ShopAPI.Services
{
    public class OrderService : IOrderService
    {
        private readonly ShopDbContext _context;
        private readonly IMapper _mapper;

        public OrderService(ShopDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<OrderReadDto>> GetOrderByCustomerAsync(int customerId)
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
            return _mapper.Map<IEnumerable<OrderReadDto>>(orders);
        }

        public async Task<IEnumerable<OrderReadDto>> GetAllOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
            return _mapper.Map<IEnumerable<OrderReadDto>>(orders);
        }

        public async Task<OrderReadDto?> GetOrderByIdAsync(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.OrderId == id);
            return _mapper.Map<OrderReadDto>(order);
        }

        public async Task<OrderReadDto?> CreateOrderAsync(int customerId)
        {
            var basketItems = await _context.Baskets
                .Include(b => b.Product)
                .Where(b => b.CustomerId == customerId)
                .ToListAsync();

            if (!basketItems.Any()) return null;

            foreach (var item in basketItems)
            {
                if (item.Product != null)
                {
                    if (item.Product.Stock < item.Quantity)
                        throw new Exception($"{item.Product.ProductName} için yeterli stok yok");
                    item.Product.Stock -= item.Quantity;
                }
            }

            var order = new Order
            {
                CustomerId = customerId,
                TotalPrice = basketItems.Sum(b => b.Quantity * ((b.Product != null && b.Product.DiscountPrice.HasValue && b.Product.DiscountExpiresAt.HasValue && b.Product.DiscountExpiresAt.Value > DateTime.UtcNow) ? b.Product.DiscountPrice.Value : b.Product?.Price ?? 0)),
                OrderStatus = "Hazırlanıyor...",
                ProductsSummary = string.Join(", ", basketItems.Select(b => b.Product != null ? $"{b.Product.ProductName} ({b.Quantity} Adet)" : "isimsiz ürün")),
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            _context.Baskets.RemoveRange(basketItems);
            
            await _context.SaveChangesAsync();

            return _mapper.Map<OrderReadDto>(order);
        }

        public async Task<OrderReadDto?> UpdateOrderStatusAsync(int id, OrderUpdateDto updateDto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return null;

            // AutoMapper ile güncelleme
            _mapper.Map(updateDto, order);
            await _context.SaveChangesAsync();
            
            return _mapper.Map<OrderReadDto>(order);
        }
        public async Task<bool> UpdateStatusAsync(int orderId, string newStatus)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if(orderId == null) return false;
            order.OrderStatus = newStatus;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return false;

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}