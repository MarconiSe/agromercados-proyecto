using Agromercados.Api.DTOs;
using Agromercados.Api.Models;
using Agromercados.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace Agromercados.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly ProductoService _productoService;

    public ProductosController(ProductoService productoService)
    {
        _productoService = productoService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Producto>>> ObtenerTodos()
    {
        var productos = await _productoService.ObtenerTodosAsync();

        return Ok(productos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Producto>> ObtenerPorId(string id)
    {
        var producto = await _productoService.ObtenerPorIdAsync(id);

        if (producto is null)
        {
            return NotFound();
        }

        return Ok(producto);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Producto>> Crear(CrearProductoDto dto)
    {
        var producto = new Producto
        {
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            Categoria = dto.Categoria,
            Precio = dto.Precio,
            Disponible = dto.Disponible,
            ImagenUrl = NormalizarImagen(dto.ImagenUrl)
        };

        await _productoService.CrearAsync(producto);

        return StatusCode(201, producto);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<Producto>> Actualizar(
        string id,
        ActualizarProductoDto dto)
    {
        var producto = new Producto
        {
            Id = id,
            Nombre = dto.Nombre,
            Descripcion = dto.Descripcion,
            Categoria = dto.Categoria,
            Precio = dto.Precio,
            Disponible = dto.Disponible,
            ImagenUrl = NormalizarImagen(dto.ImagenUrl)
        };

        var actualizado =
            await _productoService.ActualizarAsync(id, producto);

        if (!actualizado)
        {
            return NotFound();
        }

        return Ok(producto);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Eliminar(string id)
    {
        var eliminado = await _productoService.EliminarAsync(id);

        if (!eliminado)
        {
            return NotFound();
        }

        return Ok(new
        {
            mensaje = "Producto eliminado correctamente"
        });
    }

    // Convierte un enlace de Pexels (pagina o imagen) en la version
    // de 400x300 comprimida, para no cargar la foto en alta resolucion.
    // Otros enlaces y nombres de archivo se guardan tal cual.
    private static string NormalizarImagen(string? imagenUrl)
    {
        var url = imagenUrl?.Trim() ?? string.Empty;

        var match = Regex.Match(
            url,
            @"^https?://(www\.|images\.)?pexels\.com/.*?(\d+)(/|\.jpe?g|\?|$)");

        if (!match.Success)
        {
            return url;
        }

        var id = match.Groups[2].Value;

        return $"https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg"
            + "?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";
    }
}
