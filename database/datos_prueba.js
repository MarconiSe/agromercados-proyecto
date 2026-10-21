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
  },

  {
    nombre: "Chile verde",
    descripcion: "Chile verde dulce",
    categoria: "Verduras",
    precio: 0.50,
    disponible: true,
    imagenUrl: "chile-verde.jpg"
  },

  {
    nombre: "Zanahoria",
    descripcion: "Zanahoria fresca",
    categoria: "Verduras",
    precio: 0.60,
    disponible: true,
    imagenUrl: "zanahoria.jpg"
  },

  {
    nombre: "Plátano",
    descripcion: "Plátano maduro",
    categoria: "Frutas",
    precio: 0.30,
    disponible: true,
    imagenUrl: "platano.jpg"
  },

  {
    nombre: "Mango",
    descripcion: "Mango de temporada",
    categoria: "Frutas",
    precio: 1.00,
    disponible: true,
    imagenUrl: "mango.jpg"
  },

  {
    nombre: "Naranja",
    descripcion: "Naranja dulce",
    categoria: "Frutas",
    precio: 0.40,
    disponible: true,
    imagenUrl: "naranja.jpg"
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