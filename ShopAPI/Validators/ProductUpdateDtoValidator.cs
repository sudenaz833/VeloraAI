using FluentValidation;
using ShopAPI.DTOs;

namespace ShopAPI.Validators
{
    public class ProductUpdateDtoValidator : AbstractValidator<ProductUpdateDto>
    {
        public ProductUpdateDtoValidator()
        {
            RuleFor(x => x.ProductName)
            .NotEmpty().WithMessage("Ürün adı alanı boş bırakılmaz.")
            .MinimumLength(2).WithMessage("Ürün adı en az 2 karakter olmalıdır.");

            RuleFor(x => x.Price)
            .NotEmpty().WithMessage("Fiyat boş bırakılamaz.")
            .GreaterThan(0).WithMessage("Fiyat 0'dan büyük olmalıdır.");

            RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("Stok adedi negatif olamaz.")
            .InclusiveBetween(0,10000).WithMessage("Stok adeddi 0 ile 10000 arasında olmalıdır.");
        }
    }
}
