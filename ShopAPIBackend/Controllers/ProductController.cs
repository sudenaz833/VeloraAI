
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopAPI.Data;
using ShopAPI.Entities;
using System.Collections.Generic;
using ShopAPI.DTOs; // DTO'ları kullanabilmek için mutlaka ekle!
using System.Linq;
using ShopAPI.Services;
using Microsoft.AspNetCore.Authorization;
namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ProductsController : ControllerBase
    { 
        private readonly IProductService _productService;
        private readonly PhotoService _photoService;
        
        public  ProductsController(IProductService productService, PhotoService photoService)
        {
            _productService = productService;
            _photoService = photoService;
        }
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ProductReadDto>>> GetAllProductsAsync()
        {
          var products = await _productService.GetAllProductsAsync();
          return Ok(products);
        }
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductReadDto>> GetProductsById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if( product == null) return NotFound("Bu bilgide bir ürün bulunamadı");
            return Ok(product);
        }
        [HttpPost]
     [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductReadDto>> CreateProduct([FromForm]ProductCreateDto productDto)
        {
            if (productDto.ImageFile == null || productDto.ImageFile.Length == 0)
            {
                return BadRequest("Lütfen bir resim dosyası seçin.");
            }

            string imageUrl = await _photoService.AddPhotoAsync(productDto.ImageFile);
            productDto.ImageUrl = imageUrl;
            
            var createdProduct = _productService.CreateProduct(productDto);
            return CreatedAtAction(nameof(GetProductsById), new {id = createdProduct.ProductId}, createdProduct);
        }
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateProductsAsync([FromForm] ProductUpdateDto updateDto, int id)
        {
            if (updateDto.ImageFile != null && updateDto.ImageFile.Length > 0)
            {
                string imageUrl = await _photoService.AddPhotoAsync(updateDto.ImageFile);
                updateDto.ImageUrl = imageUrl;
            }

            var updatedProduct = await _productService.UpdateProductAsync(id, updateDto);
            if (updatedProduct == null) return NotFound("Ürün bulunamadı");
            return Ok(updatedProduct);
        }
        [HttpDelete("{id}")]
         [Authorize(Roles = "Admin")]
        public async Task <ActionResult> DeleteProductsAsync(int id)
        {
            var deleted = await _productService.DeleteProductAsync(id);
            if(!deleted) return NotFound("Ürün bulunamadı.");
            return Ok("ürün başarıyla silindi.");
        }
    }

}