using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Agromercados.Api.Models;

public class Pedido
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("usuarioId")]
    public string UsuarioId { get; set; } = string.Empty;

    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("agromercadoId")]
    public string AgromercadoId { get; set; } = string.Empty;

    [BsonElement("items")]
    public List<PedidoItem> Items { get; set; } = new();

    [BsonElement("fechaPedido")]
    public DateTime FechaPedido { get; set; }

    [BsonElement("fechaHoraRetiro")]
    public DateTime FechaHoraRetiro { get; set; }

    [BsonElement("estado")]
    public string Estado { get; set; } = "Pendiente";

    [BsonElement("total")]
    public double Total { get; set; }
}
