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


// Los pedidos se crean mediante la API,
// utilizando el usuario autenticado con Identity/JWT.