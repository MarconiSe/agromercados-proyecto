// usuarios
db.usuarios.insertOne({
  nombre: "Carlos Ruiz",
  email: "carlos@gmail.com",
  passwordHash: "hash_de_prueba",
  rol: "Cliente"
})

db.usuarios.insertOne({
  nombre: "Administrador",
  email: "admin@agromercados.com",
  passwordHash: "hash_admin_prueba",
  rol: "Admin"
})


// productos
db.productos.insertMany([
  {
    nombre: "Tomate",
    descripcion: "Tomate fresco",
    categoria: "Verduras",
    precio: 1.25,
    disponible: true,
    imagenUrl: "tomate.jpg"
  },

  {
    nombre: "Cebolla",
    descripcion: "Cebolla blanca",
    categoria: "Verduras",
    precio: 0.80,
    disponible: true,
    imagenUrl: "cebolla.jpg"
  },

  {
    nombre: "Aguacate",
    descripcion: "Aguacate fresco",
    categoria: "Frutas",
    precio: 2.00,
    disponible: true,
    imagenUrl: "aguacate.jpg"
  }
])


// agromercado
db.agromercados.insertOne({
  nombre: "Agromercado Santa Tecla",
  ubicacion: "Santa Tecla, La Libertad",

  horariosRetiro: [
    "08:00",
    "09:00",
    "10:00",
    "11:00"
  ],

  activo: true
})


// PEDIDO
db.pedidos.insertOne({

  usuarioId: ObjectId("6ab4b22039cc9f6f9d077c5a"),

  agromercadoId: ObjectId("6ab4b48439cc9f6f9d077c68"),

  items: [
    {
      productoId: ObjectId("6ab4b33d39cc9f6f9d077c64"),
      nombre: "Tomate",
      precioUnitario: 1.25,
      cantidad: 2
    },

    {
      productoId: ObjectId("6ab4b33d39cc9f6f9d077c65"),
      nombre: "Cebolla",
      precioUnitario: 0.80,
      cantidad: 1
    }
  ],

  fechaPedido: new Date(),

  fechaHoraRetiro: new Date("2026-09-25T10:00:00"),

  estado: "Pendiente",

  total: 3.30
})