using ShopAPI.DTOs;
using ShopAPI.Entities;
namespace ShopAPI.Services
{
    public interface IBasketService
    {
        // Admin için tüm sepetleri getirir
        Task <IEnumerable<BasketReadDto>> GetAllBasketAsync(int customerId);
        
        // Kullanıcı için kendi sepetini getirir
        Task <IEnumerable<BasketReadDto>> GetMyBasketByCustomerIdAsync(int customerId);

        // Sepete ürün ekler 
        Task <string?> AddToBasketAsync(int customerId, BasketCreateDto basketDto);
        
        // Sepet ürününü günceller 
        Task <BasketReadDto?> UpdateBasketAsync(int customerId, int id, BasketUpdateDto updateDto);
        
        // Sepetten ürün siler
        Task <bool> DeleteBasketAsync(int customerId, int id);
        
        // Sepeti tamamen boşaltır
        Task <bool> ClearBasketAsync(int customerId);
    }
}