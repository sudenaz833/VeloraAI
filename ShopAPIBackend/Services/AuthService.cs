using ShopAPI.Data;
using ShopAPI.Entities;
using ShopAPI.DTOs;
namespace ShopAPI.Services
{
    public class AuthService : IAuthService
    {
        private ShopDbContext _context;
        private readonly ITokenService _tokenService;
        public AuthService(ShopDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }
       public string? Login(LoginDto loginDto)
{
    var user = _context.Customers.FirstOrDefault(c => c.Email == loginDto.Email);
  
    if (user == null) {
        Console.WriteLine("Kullanıcı bulunamadı!");
        return null;
    }

    bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
    
    if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash)) {
      
        return null;
    }

    return _tokenService.CreateToken(user.CustomerId.ToString(), user.Email, user.Role);
}
        
    }
}