using ShopAPI.Data;
using ShopAPI.Entities;
using ShopAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Http.HttpResults;
using AutoMapper;
namespace ShopAPI.Services
{
    public class BasketService : IBasketService
    {
        private readonly ShopDbContext _context;
        private readonly IProductService _productService;
        private readonly IMapper _mapper;


        public BasketService(ShopDbContext context, IProductService productService, IMapper mapper)
        {
            _context = context;
            _productService = productService;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BasketReadDto>> GetMyBasketByCustomerIdAsync(int customerId)
        {
            var baskets = _context.Baskets
            .Include(b => b.Product)
            .Where(b => b.CustomerId == customerId)
            .ToList();

            return _mapper.Map<IEnumerable<BasketReadDto>>(baskets);
        }

        public async Task<IEnumerable<BasketReadDto>> GetAllBasketAsync(int customerId)
        {
            var baskets = await _context.Baskets
        .Include(b => b.Product)
        .Where(b => b.CustomerId == customerId)
        .ToListAsync();

            // AutoMapper ile DTO'ya çevir
            return _mapper.Map<IEnumerable<BasketReadDto>>(baskets);
        }
        public async Task<string?> AddToBasketAsync(int customerId, BasketCreateDto basketDto)
        {
            var product = await _context.Products.FindAsync(basketDto.ProductId);
            if (product == null) return "Ürün bulunamadı.";
            if (product.Stock < basketDto.Quantity)
            {
                return $"Yetersiz stok! Mevcut stok : {product.Stock}";
            }

            var existingItem = await _context.Baskets
                .FirstOrDefaultAsync(b => b.CustomerId == customerId && b.ProductId == basketDto.ProductId);

            if (existingItem != null)
            {
                if (product.Stock < (existingItem.Quantity + basketDto.Quantity))
                {
                    return "Seepetinize eklemek istediğiniz miktar stok miktarını aşıyor";
                }
                existingItem.Quantity += basketDto.Quantity;
            }
            else
            {
                var basket = _mapper.Map<Basket>(basketDto);
                basket.CustomerId = customerId;
                basket.CreatedAt = DateTime.UtcNow;
                _context.Baskets.Add(basket);
            }
            await _context.SaveChangesAsync();
            return null;
        }

        //  Sepetin bu kullanıcıya ait olup olmadığını kontrol ediyoruz
        public async Task<BasketReadDto?> UpdateBasketAsync(int customerId, int id, BasketUpdateDto updateDto)
        {
            var existingBasket = await _context.Baskets
            .FirstOrDefaultAsync(b => b.BasketId == id && b.CustomerId == customerId);

            if (existingBasket == null) return null;
            _mapper.Map(updateDto, existingBasket);

            await _context.SaveChangesAsync();

            return _mapper.Map<BasketReadDto>(existingBasket);
        }

        //Sepetin bu kullanıcıya ait olup olmadığını kontrol ediyoruz
        public async Task<bool> DeleteBasketAsync(int customerId, int id)
        {
            var basket = await _context.Baskets.FirstOrDefaultAsync(b => b.BasketId == id && b.CustomerId == customerId);
            if (basket == null) return false;

            _context.Baskets.Remove(basket);
            await _context.SaveChangesAsync();
            return true;
        }

        // Admin için (tümünü getir)
        public async Task<IEnumerable<BasketReadDto>> GetBasketAsync(int customerId) 
        => await GetMyBasketByCustomerIdAsync(customerId);

        // Sepeti tamamen boşaltır
        public async Task<bool> ClearBasketAsync(int customerId)
        {
            var basketItems = await _context.Baskets.Where(b => b.CustomerId == customerId).ToListAsync();
            if (!basketItems.Any()) return false;

            _context.Baskets.RemoveRange(basketItems);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}