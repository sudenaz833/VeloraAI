using ShopAPI.Data;
using ShopAPI.Entities;
using ShopAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Http.HttpResults;
using AutoMapper;
namespace ShopAPI.Services
{
    public class ProductService : IProductService
    {
        private readonly ShopDbContext _context;
        private readonly IMapper _mapper;
        public ProductService(ShopDbContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context=context;
        }
        public async Task<IEnumerable<ProductReadDto>> GetAllProductsAsync()
        {
            var products = await _context.Products.ToListAsync();
            var dtos = _mapper.Map<IEnumerable<ProductReadDto>>(products).ToList();
            foreach (var dto in dtos)
            {
                dto.IsBasketCount = await _context.Baskets.CountAsync(b => b.ProductId == dto.ProductId);
                
                var comments = await _context.Comments.Where(c => c.ProductId == dto.ProductId).ToListAsync();
                dto.CommentCount = comments.Count;
                dto.AverageRating = comments.Count > 0 
                    ? Math.Round(comments.Average(c => double.TryParse(c.Rating, out double r) ? r : 0.0), 1) 
                    : 0.0;
            }
            return dtos;
        }
        public ProductReadDto? GetProductById(int id)
        {
            var product = _context.Products.Find(id);
            if(product == null) return null;
            var dto = _mapper.Map<ProductReadDto>(product);
            dto.IsBasketCount = _context.Baskets.Count(b => b.ProductId == id);
            
            var comments = _context.Comments.Where(c => c.ProductId == id).ToList();
            dto.CommentCount = comments.Count;
            dto.AverageRating = comments.Count > 0 
                ? Math.Round(comments.Average(c => double.TryParse(c.Rating, out double r) ? r : 0.0), 1) 
                : 0.0;
            return dto;
        }
        public ProductReadDto CreateProduct(ProductCreateDto dto)
        {
            if (dto.DiscountExpiresAt.HasValue)
            {
                dto.DiscountExpiresAt = DateTime.SpecifyKind(dto.DiscountExpiresAt.Value, DateTimeKind.Utc);
            }
            //DTO'yu Entity'ye cevirme
            var product = _mapper.Map<Product>(dto);
            _context.Products.Add(product);
            _context.SaveChanges();
            //Entity'yi DTO'ya cevirme
            var readDto = _mapper.Map<ProductReadDto>(product);
            readDto.IsBasketCount = 0; // Yeni ürün olduğu için sepette olamaz
            return readDto;
        }
        public async Task <ProductReadDto?> UpdateProductAsync(int id,ProductUpdateDto dto)
        {
            var existingProduct = await  _context.Products.FindAsync(id);
            if(existingProduct==null) return null;

            if (dto.DiscountExpiresAt.HasValue)
            {
                dto.DiscountExpiresAt = DateTime.SpecifyKind(dto.DiscountExpiresAt.Value, DateTimeKind.Utc);
            }

            _mapper.Map(dto, existingProduct);
            await _context.SaveChangesAsync();
            var readDto = _mapper.Map<ProductReadDto>(existingProduct);
            readDto.IsBasketCount = await _context.Baskets.CountAsync(b => b.ProductId == id);
            return readDto;
        }
        public  async Task <bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if(product== null) return false;
            _context.Products.Remove(product);
            await  _context.SaveChangesAsync();
            return true;
        }
        public bool IsInStock(int productId)
        {
            var product = _context.Products.Find(productId);
            return product != null && product.Stock>0;
        }
    }

}