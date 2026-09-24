// use agromercados_db

// VER TODOS LOS USUARIOS
db.usuarios.find()


// VER TODOS LOS PRODUCTOS
db.productos.find()


// VER PRODUCTOS DISPONIBLES
db.productos.find({
  disponible: true
})


// VER PRODUCTOS DE CATEGORIA VERDURAS
db.productos.find({
  categoria: "Verduras"
})


// VER VERDURAS DISPONIBLES
db.productos.find({
  categoria: "Verduras",
  disponible: true
})


// VER AGROMERCADOS
db.agromercados.find()


// VER TODOS LOS PEDIDOS
db.pedidos.find()


// VER PEDIDOS PENDIENTES
db.pedidos.find({
  estado: "Pendiente"
})


// VER PEDIDOS CONFIRMADOS
db.pedidos.find({
  estado: "Confirmado"
})


// CAMBIAR ESTADO DE UN PEDIDO
db.pedidos.updateOne(
  {
    _id: ObjectId("6ab4b52b39cc9f6f9d077c69")
  },
  {
    $set: {
      estado: "Confirmado"
    }
  }
)