using FluentValidation;
using ShopAPI.DTOs;

namespace ShopAPI.Validators
{
    public class CustomerUpdateDtoValidator : AbstractValidator<CustomerUpdateDto>
    {
        public CustomerUpdateDtoValidator()
        {
            RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("İsim alanı boş bırakılamaz.")
            .MinimumLength(2).WithMessage("İsim en az 2 karakter olmalıdır.")
            .When(x => x.FirstName != null);

            RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Soyad alanı boş bırakılamaz.")
            .MinimumLength(2).WithMessage("Soyad en az 2 karakter olmalıdır.")
            .When(x => x.LastName != null);
            
            RuleFor(x => x.Phone)
            .Matches(@"^\d{10}$").WithMessage("Telefon numarası 10 haneli rakamlardan oluşmaktadır")
            .When(x => !string.IsNullOrEmpty(x.Phone));

            RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Geçerli bir email adresi giriniz.")
            .When(x => !string.IsNullOrEmpty(x.Email));

            RuleFor(x => x.Password)
            .MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır.")
            .When(x => !string.IsNullOrEmpty(x.Password));
        }
    }
}
