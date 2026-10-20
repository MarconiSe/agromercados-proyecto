using System.ComponentModel.DataAnnotations;

namespace Agromercados.Api.DTOs;

public class CrearPedidoDto
{
    [Required]
    public string AgromercadoId { get; set; } = string.Empty;

    [Required]
    public DateTime FechaHoraRetiro { get; set; }

    [Required]
    [MinLength(1)]
    public List<CrearPedidoItemDto> Items { get; set; } = new();
}

public class CrearPedidoItemDto
{
    [Required]
    public string ProductoId { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int Cantidad { get; set; }
}
