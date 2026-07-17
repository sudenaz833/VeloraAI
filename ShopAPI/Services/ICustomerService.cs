using ShopAPI.DTOs;
using ShopAPI.Entities;

namespace ShopAPI.Services
{
    public interface ICustomerService
    {
       Task <CustomerReadDto> RegisterCustomerAsync(CustomerCreateDto customerDto);
        Task<IEnumerable<CustomerReadDto>> GetAllCustomersAsync();
        Task<CustomerReadDto?> GetCustomerByIdAsync(int id);
        Task <CustomerReadDto> CreateCustomerAsync(CustomerCreateDto dto);
        Task <CustomerReadDto?> UpdateCustomerAsync(int id, CustomerUpdateDto dto);
        Task <bool> DeleteCustomerAsync(int id);
        Task<Customer?> Authenticate(LoginDto loginDto);
        Task<BasketReadDto?> AddToBasketAsync(int customerId,BasketCreateDto basketDto);
        
    }
}