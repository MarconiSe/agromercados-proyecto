# Sistema de pedidos para Agromercados

Proyecto académico desarrollado para las materias de
Programación Web y Base de Datos II.

El sistema permite consultar productos disponibles,
realizar pedidos en línea y seleccionar un horario para
retirar la compra en un Agromercado.

## Tecnologías

- C#
- ASP.NET Core Web API
- ASP.NET Core Identity
- Entity Framework Core
- SQL Server LocalDB
- JWT
- MongoDB
- MongoDB.Driver
- Postman

## Bases de datos

### MongoDB

Base: `agromercados_db`

Colecciones:

- productos
- agromercados
- pedidos

MongoDB almacena la información principal del sistema.

Los pedidos utilizan snapshots históricos para conservar
el nombre y precio de los productos al momento de realizar
el pedido.

### SQL Server

Base: `AgromercadosIdentityDb`

ASP.NET Core Identity administra:

- usuarios
- contraseñas
- roles
- relaciones usuario-rol

## Roles

### Cliente

Puede:

- Registrarse
- Iniciar sesión
- Consultar productos
- Consultar Agromercados
- Crear pedidos
- Consultar sus propios pedidos

### Admin

Puede:

- Crear productos
- Actualizar productos
- Eliminar productos
- Consultar todos los pedidos
- Consultar el detalle de pedidos
- Cambiar el estado de los pedidos

## Estados de pedido

- Pendiente
- Confirmado
- Listo para retirar
- Entregado

## Endpoints principales

### Autenticación

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

### Productos

- GET `/api/productos`
- GET `/api/productos/{id}`
- POST `/api/productos` - Admin
- PUT `/api/productos/{id}` - Admin
- DELETE `/api/productos/{id}` - Admin

### Agromercados

- GET `/api/agromercados`
- GET `/api/agromercados/{id}`

### Pedidos

- POST `/api/pedidos` - Cliente
- GET `/api/pedidos/mis-pedidos` - Cliente
- GET `/api/pedidos/{id}` - Cliente propietario o Admin
- GET `/api/pedidos` - Admin
- PUT `/api/pedidos/{id}/estado` - Admin

## Flujo principal

1. El cliente se registra.
2. Inicia sesión y recibe un JWT.
3. Consulta productos y Agromercados.
4. Selecciona productos, cantidades y horario de retiro.
5. La API crea el pedido.
6. El precio y nombre de los productos se guardan como
   snapshot histórico.
7. El administrador consulta los pedidos.
8. El administrador actualiza su estado.
9. El cliente consulta el estado desde Mis pedidos.
