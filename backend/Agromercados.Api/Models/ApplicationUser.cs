using Microsoft.AspNetCore.Identity;

namespace Agromercados.Api.Models;

public class ApplicationUser : IdentityUser<Guid>
{
    public string Nombre { get; set; } = string.Empty;
}
