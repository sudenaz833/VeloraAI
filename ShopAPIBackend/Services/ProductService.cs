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
            var productsWithDetails = await _context.Products
                .Select(p => new
                {
                    Product = p,
                    BasketCount = _context.Baskets.Count(b => b.ProductId == p.ProductId),
                    CommentRatings = p.Comments.Select(c => c.Rating).ToList()
                })
                .ToListAsync();

            var dtos = new List<ProductReadDto>();
            foreach (var item in productsWithDetails)
            {
                var dto = _mapper.Map<ProductReadDto>(item.Product);
                dto.IsBasketCount = item.BasketCount;
                dto.CommentCount = item.CommentRatings.Count;
                dto.AverageRating = item.CommentRatings.Count > 0 
                    ? Math.Round(item.CommentRatings.Average(r => double.TryParse(r, out double val) ? val : 0.0), 1) 
                    : 0.0;
                dtos.Add(dto);
            }
            return dtos;
        }
        public async Task<ProductReadDto?> GetProductByIdAsync(int id)
        {
            var productInfo = await _context.Products
                .Where(p => p.ProductId == id)
                .Select(p => new
                {
                    Product = p,
                    BasketCount = _context.Baskets.Count(b => b.ProductId == id),
                    CommentRatings = p.Comments.Select(c => c.Rating).ToList()
                })
                .FirstOrDefaultAsync();

            if (productInfo == null) return null;

            var dto = _mapper.Map<ProductReadDto>(productInfo.Product);
            dto.IsBasketCount = productInfo.BasketCount;
            dto.CommentCount = productInfo.CommentRatings.Count;
            dto.AverageRating = productInfo.CommentRatings.Count > 0 
                ? Math.Round(productInfo.CommentRatings.Average(r => double.TryParse(r, out double val) ? val : 0.0), 1) 
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