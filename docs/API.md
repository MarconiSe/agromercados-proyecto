# API - Agromercados

## Autenticación

### Registrar cliente

POST `/api/auth/register`

```json
{
  "nombre": "Cliente Prueba",
  "email": "cliente@test.com",
  "password": "Prueba123!"
}
```

### Login

POST `/api/auth/login`

```json
{
  "email": "cliente@test.com",
  "password": "Prueba123!"
}
```

Los endpoints protegidos utilizan:

```text
Authorization: Bearer TOKEN
```

## Crear pedido

POST `/api/pedidos`

Rol: Cliente

```json
{
  "agromercadoId": "ID_AGROMERCADO",
  "fechaHoraRetiro": "2026-10-25T10:00:00",
  "items": [
    {
      "productoId": "ID_PRODUCTO",
      "cantidad": 2
    }
  ]
}
```

El usuario no envía:

- usuarioId
- precio
- nombre del producto
- total
- estado

Estos valores son obtenidos o calculados por la API.

## Cambiar estado

PUT `/api/pedidos/ID/estado`

Rol: Admin

```json
{
  "estado": "Confirmado"
}
```

Estados permitidos:

- Pendiente
- Confirmado
- Listo para retirar
- Entregado
