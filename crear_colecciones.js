// coleccion: usuarios
db.createCollection("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",

      required: [
        "nombre",
        "email",
        "passwordHash",
        "rol"
      ],

      properties: {

        nombre: {
          bsonType: "string",
          minLength: 2
        },

        email: {
          bsonType: "string"
        },

        passwordHash: {
          bsonType: "string"
        },

        rol: {
          enum: ["Cliente", "Admin"]
        }

      }
    }
  }
})


// coleccion: productos
db.createCollection("productos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",

      required: [
        "nombre",
        "descripcion",
        "categoria",
        "precio",
        "disponible"
      ],

      properties: {

        nombre: {
          bsonType: "string",
          minLength: 2
        },

        descripcion: {
          bsonType: "string"
        },

        categoria: {
          bsonType: "string"
        },

        precio: {
          bsonType: ["double", "int"],
          minimum: 0
        },

        disponible: {
          bsonType: "bool"
        },

        imagenUrl: {
          bsonType: "string"
        }

      }
    }
  }
})


// coleccion: agromercados
db.createCollection("agromercados", {
  validator: {
    $jsonSchema: {
      bsonType: "object",

      required: [
        "nombre",
        "ubicacion",
        "horariosRetiro",
        "activo"
      ],

      properties: {

        nombre: {
          bsonType: "string"
        },

        ubicacion: {
          bsonType: "string"
        },

        horariosRetiro: {
          bsonType: "array",
          minItems: 1,

          items: {
            bsonType: "string"
          }
        },

        activo: {
          bsonType: "bool"
        }

      }
    }
  }
})


// coleccion: pedidos
db.createCollection("pedidos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",

      required: [
        "usuarioId",
        "agromercadoId",
        "items",
        "fechaPedido",
        "fechaHoraRetiro",
        "estado",
        "total"
      ],

      properties: {

        usuarioId: {
          bsonType: "objectId"
        },

        agromercadoId: {
          bsonType: "objectId"
        },

        items: {
          bsonType: "array",
          minItems: 1,

          items: {
            bsonType: "object",

            required: [
              "productoId",
              "nombre",
              "precioUnitario",
              "cantidad"
            ],

            properties: {

              productoId: {
                bsonType: "objectId"
              },

              nombre: {
                bsonType: "string"
              },

              precioUnitario: {
                bsonType: ["double", "int"],
                minimum: 0
              },

              cantidad: {
                bsonType: "int",
                minimum: 1
              }

            }
          }
        },

        fechaPedido: {
          bsonType: "date"
        },

        fechaHoraRetiro: {
          bsonType: "date"
        },

        estado: {
          enum: [
            "Pendiente",
            "Confirmado",
            "Listo para retirar",
            "Entregado"
          ]
        },

        total: {
          bsonType: ["double", "int"],
          minimum: 0
        }

      }
    }
  }
})