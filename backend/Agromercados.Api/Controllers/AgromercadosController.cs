using Agromercados.Api.Models;
using Agromercados.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Agromercados.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgromercadosController : ControllerBase
{
    private readonly AgromercadoService _agromercadoService;

    public AgromercadosController(
        AgromercadoService agromercadoService)
    {
        _agromercadoService = agromercadoService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Agromercado>>> ObtenerTodos()
    {
        var agromercados =
            await _agromercadoService.ObtenerActivosAsync();

        return Ok(agromercados);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Agromercado>> ObtenerPorId(string id)
    {
        var agromercado =
            await _agromercadoService.ObtenerPorIdAsync(id);

        if (agromercado is null)
        {
            return NotFound();
        }

        return Ok(agromercado);
    }
}
