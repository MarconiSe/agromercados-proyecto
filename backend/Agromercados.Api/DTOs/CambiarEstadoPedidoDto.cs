using System.ComponentModel.DataAnnotations;

namespace Agromercados.Api.DTOs;

public class CambiarEstadoPedidoDto
{
    [Required]
    public string Estado { get; set; } = string.Empty;
}
