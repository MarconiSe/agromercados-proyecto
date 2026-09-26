using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Agromercados.Api.Models;

public class Producto
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [BsonElement("descripcion")]
    public string Descripcion { get; set; } = string.Empty;

    [BsonElement("categoria")]
    public string Categoria { get; set; } = string.Empty;

    [BsonElement("precio")]
    public double Precio { get; set; }

    [BsonElement("disponible")]
    public bool Disponible { get; set; }

    [BsonElement("imagenUrl")]
    public string ImagenUrl { get; set; } = string.Empty;
}