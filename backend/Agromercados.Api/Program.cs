using Agromercados.Api.Data;
using Agromercados.Api.Models;
using Agromercados.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// SQL Server + Identity
// En el servidor (1 GB de RAM) SQL Server no cabe, ahí se usa SQLite
var usarSqlite =
    builder.Configuration["IdentityProvider"] == "Sqlite";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString =
        builder.Configuration.GetConnectionString("IdentityConnection");

    if (usarSqlite)
    {
        options.UseSqlite(connectionString);
    }
    else
    {
        options.UseSqlServer(connectionString);
    }
});

builder.Services
    .AddIdentity<ApplicationUser, ApplicationRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            builder.Configuration["Jwt:Key"]!
                        )
                    )
            };
    });

// MongoDB

var mongoConnectionString =
    builder.Configuration["MongoDB:ConnectionString"];

var mongoDatabaseName =
    builder.Configuration["MongoDB:DatabaseName"];

var mongoClient = new MongoClient(mongoConnectionString);

var mongoDatabase =
    mongoClient.GetDatabase(mongoDatabaseName);

builder.Services.AddSingleton(mongoDatabase);
builder.Services.AddSingleton<ProductoService>();
builder.Services.AddSingleton<AgromercadoService>();
builder.Services.AddSingleton<JwtService>();
builder.Services.AddSingleton<PedidoService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

if (usarSqlite)
{
    // Las migraciones son de SQL Server; en SQLite se crea el esquema desde el modelo
    using var scope = app.Services.CreateScope();

    scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>()
        .Database.EnsureCreated();
}

await DataSeeder.SeedRolesAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
