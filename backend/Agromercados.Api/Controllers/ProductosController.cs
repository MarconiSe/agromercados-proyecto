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
}
