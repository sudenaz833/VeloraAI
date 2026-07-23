using ShopAPI.DTOs;

namespace ShopAPI.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderReadDto>> GetOrderByCustomerAsync(int customerId);
        Task<IEnumerable<OrderReadDto>> GetAllOrdersAsync();
        Task<OrderReadDto?> GetOrderByIdAsync(int id);
        Task<OrderReadDto?> CreateOrderAsync(int customerId);
        Task<OrderReadDto?> UpdateOrderStatusAsync(int id,OrderUpdateDto updateDto);
        Task<bool> UpdateStatusAsync(int orderId, string newStatus);
        Task<bool> DeleteOrderAsync(int id);

    }
}