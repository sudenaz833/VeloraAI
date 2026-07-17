using System.Data;
using FluentValidation;
using ShopAPI.Data;
using ShopAPI.DTOs;

namespace ShopAPI.Validators
{
    public class BasketCreateDtoValidator : AbstractValidator<BasketCreateDto>
    {
        private readonly ShopDbContext _context;
        public BasketCreateDtoValidator(ShopDbContext contex)
        {
            _context =contex;
            RuleFor(x => x.Quantity)
            .NotEmpty().WithMessage("Miktar alanı boş bırakılamaz.")
            .GreaterThan(0).WithMessage("Miktar 0'dan büyük olmalıdır");

            RuleFor(x =>x.ProductId)
            .NotEmpty().WithMessage("Bu alan boş bırakılamaz")
            .GreaterThan(0).WithMessage("Lütfen 0'dan büyük geçerli bir id giriniz.")
            .Must(id => _context.Products.Any(c => c.ProductId == id))
            .WithMessage("Sistemde böyle bir ürün yok");

          
        }
    }
}