using FluentValidation;
using ShopAPI.DTOs;

namespace ShopAPI.Validators
{
    public class BasketUpdateDtoValidator : AbstractValidator<BasketUpdateDto>
    {
        public BasketUpdateDtoValidator()
        {
        }
    }
}