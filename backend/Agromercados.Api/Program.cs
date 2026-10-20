using Agromercados.Api.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
