using Agromercados.Api.Models;
using MongoDB.Driver;

namespace Agromercados.Api.Services;

public class ProductoService
{
    private readonly IMongoCollection<Producto> _productos;

    public ProductoService(IMongoDatabase database)
    {
        _productos = database.GetCollection<Producto>("productos");
    }

    public async Task<List<Producto>> ObtenerTodosAsync()
    {
        return await _productos
            .Find(_ => true)
            .ToListAsync();
    }

    public async Task<Producto?> ObtenerPorIdAsync(string id)
    {
        return await _productos
            .Find(producto => producto.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task CrearAsync(Producto producto)
    {
        await _productos.InsertOneAsync(producto);
    }
}