# Agromercados – online ordering API

REST API and web front end for ordering produce from government farmers'
markets ("Agromercados") in El Salvador and picking the order up in a chosen
time slot. Built as a university project (Web Programming and Database II) and
deployed to a real server.

**Live demo:** https://agroya.54.210.70.73.sslip.io/  
**API example:** `GET https://agroya.54.210.70.73.sslip.io/api/productos`

Spanish version: [README.es.md](README.es.md) · Endpoint reference (Spanish): [docs/API.md](docs/API.md)

## What it does

- Customers register, log in, browse products and markets, place an order with
  a pickup time and follow its status.
- Admins manage the product catalog and move orders through
  `Pendiente → Confirmado → Listo para retirar → Entregado`.
- Order lines store a **snapshot** of the product name and price at purchase
  time, so later price changes never rewrite history.

## Stack

| Layer | Technology |
|---|---|
| API | C#, ASP.NET Core Web API (.NET 10), controllers + services + DTOs |
| Auth | ASP.NET Core Identity, JWT bearer tokens, `Cliente` / `Admin` roles |
| Relational data | Entity Framework Core migrations (Identity). SQL Server LocalDB in development, SQLite in production |
| Document data | MongoDB (`productos`, `agromercados`, `pedidos`) with the official driver |
| Front end | Static HTML/CSS/vanilla JS served by the same host |
| CI/CD | GitHub Actions → build self-contained `linux-x64` → deploy over SSH → systemd |
| Hosting | AWS Lightsail (Bitnami/Apache reverse proxy, TLS with Let's Encrypt) |

## Design decisions

- **Two databases on purpose.** Users and roles live in a relational store
  (Identity); the catalog and orders are documents, which fits the order
  snapshot model. `database/` contains the Mongo scripts for collections, seed
  data and aggregation queries (orders per status, total value).
- **SQLite in production.** The production server has 1 GB of RAM, which is not
  enough for SQL Server, so the app switches provider with the
  `IdentityProvider` setting. Same migrations, different provider.
- **Authorization at the endpoint level.** Customers can only read their own
  orders; admin-only routes are marked in [docs/API.md](docs/API.md).
- **Environment-specific config stays on the server.** Production settings and
  the user database are not part of the deployment bundle.

## Main endpoints

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Products | `GET /api/productos`, `GET /api/productos/{id}`; `POST/PUT/DELETE` for admins |
| Markets | `GET /api/agromercados`, `GET /api/agromercados/{id}` |
| Orders | `POST /api/pedidos`, `GET /api/pedidos/mis-pedidos`, `GET /api/pedidos/{id}`; admins: `GET /api/pedidos`, `PUT /api/pedidos/{id}/estado` |

## Run it locally

Requirements: .NET 10 SDK, MongoDB on `localhost:27017`, SQL Server LocalDB
(or set `IdentityProvider` to `Sqlite`).

```bash
# 1. Mongo collections and sample data
mongosh agromercados_db database/crear_colecciones.js
mongosh agromercados_db database/datos_prueba.js

# 2. Identity database
cd backend/Agromercados.Api
dotnet ef database update

# 3. Run the API (serves on the port shown in the console)
dotnet run
```

Set your own signing key for development instead of relying on the sample one:

```bash
dotnet user-secrets set "Jwt:Key" "<at least 32 random characters>"
```

The front end is in `frontend/`. `frontend/src/config.js` points to
`http://localhost:5132` when opened from localhost and to the same origin when
deployed.

## Repository layout

```
backend/Agromercados.Api   Controllers, Services, DTOs, Models, EF migrations
database/                  MongoDB scripts (collections, seed data, queries, aggregations)
frontend/                  Static pages and JS modules (catalog, cart, admin screens)
docs/API.md                Endpoint reference
.github/workflows          Build and deploy pipeline
```

## Status

Working end to end and deployed. Not done yet: automated tests, rate limiting,
refresh tokens, and a product image upload (images are linked by name today).
