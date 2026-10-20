using Agromercados.Api.DTOs;
using Agromercados.Api.Models;
using Agromercados.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Agromercados.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PedidosController : ControllerBase
{
    private readonly PedidoService _pedidoService;

    public PedidosController(PedidoService pedidoService)
    {
        _pedidoService = pedidoService;
    }

    [Authorize(Roles = "Cliente")]
    [HttpPost]
    public async Task<ActionResult<Pedido>> Crear(
        CrearPedidoDto dto)
    {
        var usuarioId =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (usuarioId is null)
        {
            return Unauthorized();
        }

        var pedido =
            await _pedidoService.CrearAsync(
                usuarioId,
                dto
            );

        if (pedido is null)
        {
            return BadRequest(new
            {
                mensaje =
                    "No fue posible crear el pedido."
            });
        }

        return StatusCode(201, pedido);
    }

    [Authorize(Roles = "Cliente")]
    [HttpGet("mis-pedidos")]
    public async Task<ActionResult<List<Pedido>>>
        ObtenerMisPedidos()
    {
        var usuarioId =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (usuarioId is null)
        {
            return Unauthorized();
        }

        var pedidos =
            await _pedidoService
                .ObtenerPorUsuarioAsync(usuarioId);

        return Ok(pedidos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Pedido>> ObtenerPorId(string id)
    {
        var pedido =
            await _pedidoService.ObtenerPorIdAsync(id);

        if (pedido is null)
        {
            return NotFound();
        }

        var usuarioId =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        var esAdmin =
            User.IsInRole("Admin");

        if (!esAdmin &&
            pedido.UsuarioId != usuarioId)
        {
            return Forbid();
        }

        return Ok(pedido);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<List<Pedido>>>
        ObtenerTodos()
    {
        var pedidos =
            await _pedidoService.ObtenerTodosAsync();

        return Ok(pedidos);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/estado")]
    public async Task<IActionResult> CambiarEstado(
        string id,
        CambiarEstadoPedidoDto dto)
    {
        var actualizado =
            await _pedidoService
                .CambiarEstadoAsync(
                    id,
                    dto.Estado
                );

        if (!actualizado)
        {
            return BadRequest(new
            {
                mensaje =
                    "Pedido o estado no válido."
            });
        }

        return Ok(new
        {
            mensaje =
                "Estado actualizado correctamente."
        });
    }
}
