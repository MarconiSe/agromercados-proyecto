using Agromercados.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace Agromercados.Api.Data;

public static class DataSeeder
{
    public static async Task SeedRolesAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();

        var roleManager =
            scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

        var userManager =
            scope.ServiceProvider
                .GetRequiredService<UserManager<ApplicationUser>>();

        string[] roles = { "Cliente", "Admin" };

        foreach (var rol in roles)
        {
            if (!await roleManager.RoleExistsAsync(rol))
            {
                await roleManager.CreateAsync(
                    new ApplicationRole
                    {
                        Name = rol
                    }
                );
            }
        }

        var adminEmail = "admin@agromercados.com";

        var admin =
            await userManager.FindByEmailAsync(adminEmail);

        if (admin is null)
        {
            admin = new ApplicationUser
            {
                Nombre = "Administrador",
                Email = adminEmail,
                UserName = adminEmail
            };

            var configuration =
                scope.ServiceProvider.GetRequiredService<IConfiguration>();

            var resultado =
                await userManager.CreateAsync(
                    admin,
                    configuration["Admin:Password"] ?? "Admin123!"
                );

            if (resultado.Succeeded)
            {
                await userManager.AddToRoleAsync(
                    admin,
                    "Admin"
                );
            }
        }
    }
}
