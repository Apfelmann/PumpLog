using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PumpLogApi.Models
{
    public interface ICurrentUserService
    {
        string Id { get; set; }
        string Username { get; set; }
        string Role { get; set; }
    }
    public class CurrentUserService : ICurrentUserService
    {
        public required string Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "User";

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            if (httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true)
            {
                Id = httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value ?? string.Empty;
                Username = httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "preferred_username")?.Value ?? string.Empty;
                Role = httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "groups")?.Value ?? "User";
            }
        }

    }
}