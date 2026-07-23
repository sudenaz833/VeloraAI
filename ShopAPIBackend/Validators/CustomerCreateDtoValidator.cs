using FluentValidation;
using ShopAPI.DTOs;

namespace ShopAPI.Validators
{
    public class CustomerCreateDtoValidator : AbstractValidator<CustomerCreateDto>
    {
        public CustomerCreateDtoValidator()
        {
            RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("İsim alanı boş bırakılamaz.")
            .MinimumLength(2).WithMessage("İsim en az 2 karakter olmalıdır.");

            RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Soyad alanı boş bırakılamaz.")
            .MinimumLength(2).WithMessage("Soyad en az 2 karakter olmalıdır.");

            RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email adresi gereklidir.")
            .EmailAddress().WithMessage("Geçerli bir email adresi giriniz.");

            RuleFor(x => x.Phone)
            .Matches(@"^\d{10}$").WithMessage("Telefon numarası 10 haneli rakamlardan oluşmaktadır");
        }
    }
}
