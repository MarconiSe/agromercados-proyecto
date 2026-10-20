using Agromercados.Api.DTOs;
using Agromercados.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Agromercados.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
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
}
