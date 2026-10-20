using Agromercados.Api.DTOs;
using Agromercados.Api.Models;
using Agromercados.Api.Services;
using Microsoft.AspNetCore.Mvc;

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
            ImagenUrl = dto.ImagenUrl
        };

        await _productoService.CrearAsync(producto);

        return StatusCode(201, producto);
    }
}
