using Agromercados.Api.Models;
using MongoDB.Driver;

namespace Agromercados.Api.Services;

public class AgromercadoService
{
    private readonly IMongoCollection<Agromercado> _agromercados;

    public AgromercadoService(IMongoDatabase database)
    {
        _agromercados =
            database.GetCollection<Agromercado>("agromercados");
    }

    public async Task<List<Agromercado>> ObtenerActivosAsync()
    {
        return await _agromercados
            .Find(agromercado => agromercado.Activo)
            .ToListAsync();
    }

    public async Task<Agromercado?> ObtenerPorIdAsync(string id)
    {
        return await _agromercados
            .Find(agromercado => agromercado.Id == id)
            .FirstOrDefaultAsync();
    }
}
