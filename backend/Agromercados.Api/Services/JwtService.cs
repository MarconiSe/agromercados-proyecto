using Agromercados.Api.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Agromercados.Api.Services;

public class JwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerarToken(
        ApplicationUser usuario,
        IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                usuario.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Email,
                usuario.Email ?? string.Empty
            )
        };

        foreach (var rol in roles)
        {
            claims.Add(
                new Claim(ClaimTypes.Role, rol)
            );
        }

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"]!
            )
        );

        var credentials =
            new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

        var expireMinutes =
            int.Parse(
                _configuration["Jwt:ExpireMinutes"]!
            );

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expireMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}
