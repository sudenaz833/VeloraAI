using ShopAPI.DTOs;
namespace ShopAPI.Services
{
    public interface IAuthService
    {
        string? Login(LoginDto loginDto);
    }
}