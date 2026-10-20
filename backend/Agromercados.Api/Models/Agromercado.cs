using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Agromercados.Api.Models;

public class Agromercado
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [BsonElement("ubicacion")]
    public string Ubicacion { get; set; } = string.Empty;

    [BsonElement("horariosRetiro")]
    public List<string> HorariosRetiro { get; set; } = new();

    [BsonElement("activo")]
    public bool Activo { get; set; }
}
