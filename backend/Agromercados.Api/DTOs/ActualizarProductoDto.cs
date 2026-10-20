using System.ComponentModel.DataAnnotations;

namespace Agromercados.Api.DTOs;

public class ActualizarProductoDto
{
    [Required]
    [MinLength(2)]
    public string Nombre { get; set; } = string.Empty;

    [Required]
    public string Descripcion { get; set; } = string.Empty;

    [Required]
    public string Categoria { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public double Precio { get; set; }

    public bool Disponible { get; set; }

    public string ImagenUrl { get; set; } = string.Empty;
}
