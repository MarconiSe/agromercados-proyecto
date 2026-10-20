using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Agromercados.Api.Models;

public class PedidoItem
{
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonElement("productoId")]
    public string ProductoId { get; set; } = string.Empty;

    [BsonElement("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [BsonElement("precioUnitario")]
    public double PrecioUnitario { get; set; }

    [BsonElement("cantidad")]
    public int Cantidad { get; set; }
}
