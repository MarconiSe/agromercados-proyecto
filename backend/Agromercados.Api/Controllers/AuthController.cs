using Agromercados.Api.DTOs;
using Agromercados.Api.Models;
using Agromercados.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Agromercados.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtService _jwtService;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        JwtService jwtService)
    {
        _userManager = userManager;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegistroDto dto)
    {
        var usuarioExistente =
            await _userManager.FindByEmailAsync(dto.Email);

        if (usuarioExistente is not null)
        {
            return BadRequest(new
            {
                mensaje = "Ya existe un usuario con ese correo."
            });
        }

        var usuario = new ApplicationUser
        {
            Nombre = dto.Nombre,
            Email = dto.Email,
            UserName = dto.Email
        };

        var resultado =
            await _userManager.CreateAsync(usuario, dto.Password);

        if (!resultado.Succeeded)
        {
            return BadRequest(resultado.Errors);
        }

        await _userManager.AddToRoleAsync(usuario, "Cliente");

        return StatusCode(201, new
        {
            mensaje = "Usuario registrado correctamente.",
            usuario.Id,
            usuario.Nombre,
            usuario.Email,
            rol = "Cliente"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var usuario =
            await _userManager.FindByEmailAsync(dto.Email);

        if (usuario is null)
        {
            return Unauthorized(new
            {
                mensaje = "Credenciales incorrectas."
            });
        }

        var passwordValido =
            await _userManager.CheckPasswordAsync(
                usuario,
                dto.Password
            );

        if (!passwordValido)
        {
            return Unauthorized(new
            {
                mensaje = "Credenciales incorrectas."
            });
        }

        var roles =
            await _userManager.GetRolesAsync(usuario);

        var token =
            _jwtService.GenerarToken(usuario, roles);

        return Ok(new
        {
            token,
            usuario = new
            {
                usuario.Id,
                usuario.Nombre,
                usuario.Email,
                roles
            }
        });
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        var usuarioId =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        var email =
            User.FindFirstValue(ClaimTypes.Email);

        var rol =
            User.FindFirstValue(ClaimTypes.Role);

        return Ok(new
        {
            usuarioId,
            email,
            rol
        });
    }
}
