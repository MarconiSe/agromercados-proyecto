using Agromercados.Api.DTOs;
using Agromercados.Api.Models;
using MongoDB.Driver;

namespace Agromercados.Api.Services;

public class PedidoService
{
    private readonly IMongoCollection<Pedido> _pedidos;
    private readonly ProductoService _productoService;
    private readonly AgromercadoService _agromercadoService;

    public PedidoService(
        IMongoDatabase database,
        ProductoService productoService,
        AgromercadoService agromercadoService)
    {
        _pedidos = database.GetCollection<Pedido>("pedidos");
        _productoService = productoService;
        _agromercadoService = agromercadoService;
    }

    public async Task<Pedido?> CrearAsync(
        string usuarioId,
        CrearPedidoDto dto)
    {
        var agromercado =
            await _agromercadoService.ObtenerPorIdAsync(
                dto.AgromercadoId
            );

        if (agromercado is null || !agromercado.Activo)
        {
            return null;
        }

        var horario =
            dto.FechaHoraRetiro.ToString("HH:mm");

        if (!agromercado.HorariosRetiro.Contains(horario))
        {
            return null;
        }

        var items = new List<PedidoItem>();
        double total = 0;

        foreach (var itemDto in dto.Items)
        {
            var producto =
                await _productoService.ObtenerPorIdAsync(
                    itemDto.ProductoId
                );

            if (producto is null || !producto.Disponible)
            {
                return null;
            }

            var item = new PedidoItem
            {
                ProductoId = producto.Id!,
                Nombre = producto.Nombre,
                PrecioUnitario = producto.Precio,
                Cantidad = itemDto.Cantidad
            };

            items.Add(item);

            total += producto.Precio * itemDto.Cantidad;
        }

        var pedido = new Pedido
        {
            UsuarioId = usuarioId,
            AgromercadoId = dto.AgromercadoId,
            Items = items,
            FechaPedido = DateTime.UtcNow,
            FechaHoraRetiro = dto.FechaHoraRetiro,
            Estado = "Pendiente",
            Total = total
        };

        await _pedidos.InsertOneAsync(pedido);

        return pedido;
    }

    public async Task<List<Pedido>> ObtenerPorUsuarioAsync(
        string usuarioId)
    {
        return await _pedidos
            .Find(pedido => pedido.UsuarioId == usuarioId)
            .SortByDescending(pedido => pedido.FechaPedido)
            .ToListAsync();
    }

    public async Task<Pedido?> ObtenerPorIdAsync(string id)
    {
        return await _pedidos
            .Find(pedido => pedido.Id == id)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Pedido>> ObtenerTodosAsync()
    {
        return await _pedidos
            .Find(_ => true)
            .SortByDescending(pedido => pedido.FechaPedido)
            .ToListAsync();
    }

    public async Task<bool> CambiarEstadoAsync(
        string id,
        string estado)
    {
        var estadosValidos = new[]
        {
            "Pendiente",
            "Confirmado",
            "Listo para retirar",
            "Entregado"
        };

        if (!estadosValidos.Contains(estado))
        {
            return false;
        }

        var resultado = await _pedidos.UpdateOneAsync(
            pedido => pedido.Id == id,
            Builders<Pedido>.Update.Set(
                pedido => pedido.Estado,
                estado
            )
        );

        return resultado.MatchedCount > 0;
    }
}
