using FluentValidation;
using ShopAPI.DTOs;
using ShopAPI.Data;
using System.Linq;

namespace ShopAPI.Validators
{
    public class OrderUpdateDtoValidator : AbstractValidator<OrderUpdateDto>
    {
        private readonly ShopDbContext _context;

        public OrderUpdateDtoValidator(ShopDbContext context)
        {
            _context = context;

            // Müşteri ID kontrolü
            RuleFor(x => x.OrderStatus)
                .NotEmpty().WithMessage("Sipariş durumu boş olamaz.")
                .Must(status => new []{"Pending","Shipped","Delivered","Cancelled"}.Contains(status))
                .WithMessage("Geçersiz sipariş durumu. Sadece:Pending,Shipped,Delivered veya Cancelled girilebilir.");
        }
    }
}