// CANTIDAD DE PEDIDOS POR ESTADO
db.pedidos.aggregate([
  {
    $group: {
      _id: "$estado",
      cantidad: { $sum: 1 }
    }
  }
])


// VALOR TOTAL DE TODOS LOS PEDIDOS
db.pedidos.aggregate([
  {
    $group: {
      _id: null,
      totalPedidos: { $sum: "$total" }
    }
  }
])


// CANTIDAD Y TOTAL POR ESTADO
db.pedidos.aggregate([
  {
    $group: {
      _id: "$estado",
      cantidadPedidos: { $sum: 1 },
      total: { $sum: "$total" }
    }
  }
])


// MOSTRAR CADA ITEM DEL PEDIDO POR SEPARADO
db.pedidos.aggregate([
  {
    $unwind: "$items"
  }
])


// CANTIDAD PEDIDA DE CADA PRODUCTO
db.pedidos.aggregate([
  {
    $unwind: "$items"
  },
  {
    $group: {
      _id: "$items.nombre",
      cantidadVendida: {
        $sum: "$items.cantidad"
      }
    }
  }
])


// PRODUCTOS ORDENADOS POR CANTIDAD PEDIDA
db.pedidos.aggregate([
  {
    $unwind: "$items"
  },
  {
    $group: {
      _id: "$items.nombre",
      cantidadVendida: {
        $sum: "$items.cantidad"
      }
    }
  },
  {
    $sort: {
      cantidadVendida: -1
    }
  }
])