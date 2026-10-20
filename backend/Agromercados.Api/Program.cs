using Agromercados.Api.Data;
using Agromercados.Api.Models;
using Agromercados.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// SQL Server + Identity
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("IdentityConnection")
    )
);

builder.Services
    .AddIdentity<ApplicationUser, ApplicationRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

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

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

await DataSeeder.SeedRolesAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
