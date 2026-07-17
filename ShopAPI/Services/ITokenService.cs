using ShopAPI.Entities; 
namespace ShopAPI.Services
{
     public interface ITokenService
{
    string CreateToken(string id, string Email, string Role);
}
}