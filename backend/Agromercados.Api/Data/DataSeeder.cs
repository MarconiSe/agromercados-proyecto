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
    }
}
