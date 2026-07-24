using ShopAPI.DTOs;

namespace ShopAPI.Services
{
    public  interface IProductService
    {
        Task <IEnumerable<ProductReadDto>> GetAllProductsAsync();
        Task<ProductReadDto?> GetProductByIdAsync(int id);
        Task<ProductReadDto> CreateProductAsync(ProductCreateDto productDto);
        Task<ProductReadDto?> UpdateProductAsync(int id, ProductUpdateDto updateDto);
        Task <bool>  DeleteProductAsync(int id);
        bool IsInStock(int productId);

    }
}