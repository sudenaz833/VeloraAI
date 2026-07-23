using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using ShopAPI.Entities;

namespace ShopAPI.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;

        public TokenService() // IConfiguration artık lazım değil çünkü anahtarı sabit yazdık
        {
            string key = "bu-benim-coook-uzun-ve-guvenli-anahtarim-32-karakterden-fazla-olmali-mutlaka";
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        } // Constructor burada kapanmalı!

        public string CreateToken(string id, string Email, string Role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, id),
                new Claim(ClaimTypes.Email, Email),
                new Claim(ClaimTypes.Role, Role)
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddHours(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}