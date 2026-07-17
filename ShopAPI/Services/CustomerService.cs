using ShopAPI.Data;
using ShopAPI.Entities;
using ShopAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Http.HttpResults;
using AutoMapper;
using System.Threading.Tasks;
namespace ShopAPI.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ShopDbContext _context;
        private readonly IMapper _mapper;
        public CustomerService(ShopDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<CustomerReadDto> RegisterCustomerAsync(CustomerCreateDto customerDto)
        {
            var customer = _mapper.Map<Customer>(customerDto);
            customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(customerDto.Password);
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return _mapper.Map<CustomerReadDto>(customer);
        }
        public async Task<Customer?> Authenticate(LoginDto loginDto)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == loginDto.Email);
            if (customer == null) return null;
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, customer.PasswordHash);
            if (!isPasswordValid) return null;
            return customer;
        }
        public async Task<IEnumerable<CustomerReadDto>> GetAllCustomersAsync()
        {
            var customers = await _context.Customers.ToListAsync();
            return _mapper.Map<IEnumerable<CustomerReadDto>>(customers);

        }
        public async Task<CustomerReadDto?> GetCustomerByIdAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return null;
            return _mapper.Map<CustomerReadDto>(customer);
        }
        public async Task<CustomerReadDto> CreateCustomerAsync(CustomerCreateDto dto)
        {
            var customer = _mapper.Map<Customer>(dto);
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return _mapper.Map<CustomerReadDto>(customer);

        }
        public async Task<BasketReadDto?> AddToBasketAsync(int customerId, BasketCreateDto basketDto)
        {
            var product = await _context.Products.FindAsync(basketDto.ProductId);
            if (product == null) return null;

            // Zaten sepette bu üründen var mı kontrol et
            var existingItem = await _context.Baskets
                .FirstOrDefaultAsync(b => b.CustomerId == customerId && b.ProductId == basketDto.ProductId);

            if (existingItem != null)
            {
                // Miktarı artır
                existingItem.Quantity += basketDto.Quantity;
                
                await _context.SaveChangesAsync();
                await _context.Entry(existingItem).Reference(b => b.Product).LoadAsync();
                return _mapper.Map<BasketReadDto>(existingItem);
            }
            else
            {
                // Yeni sepet öğesi oluştur
                var basketItem = new Basket
                {
                    CustomerId = customerId,
                    ProductId = basketDto.ProductId,
                    Quantity = basketDto.Quantity,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Baskets.Add(basketItem);
                await _context.SaveChangesAsync();
                await _context.Entry(basketItem).Reference(b => b.Product).LoadAsync();
                return _mapper.Map<BasketReadDto>(basketItem);
            }
        }
        public async Task<CustomerReadDto?> UpdateCustomerAsync(int id, CustomerUpdateDto dto)
        {
            var existingCustomer = await _context.Customers.FindAsync(id);
            if (existingCustomer == null) return null;

            if (!string.IsNullOrWhiteSpace(dto.FirstName))
                existingCustomer.FirstName = dto.FirstName;

            if (!string.IsNullOrWhiteSpace(dto.LastName))
                existingCustomer.LastName = dto.LastName;

            if (!string.IsNullOrWhiteSpace(dto.Address))
                existingCustomer.Address = dto.Address;

            if (!string.IsNullOrWhiteSpace(dto.Phone))
                existingCustomer.Phone = dto.Phone;

            if (!string.IsNullOrWhiteSpace(dto.Email))
                existingCustomer.Email = dto.Email;

            if (!string.IsNullOrWhiteSpace(dto.Password))
                existingCustomer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            await _context.SaveChangesAsync();
            return _mapper.Map<CustomerReadDto>(existingCustomer);
        }
        public async Task<bool> DeleteCustomerAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return false;
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return true;
        }


    }

}
