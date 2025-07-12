using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PumpLogApi.Models
{
    public interface ICurrentUserService
    {
        Guid Id { get; set; }
        string Username { get; set; }
        string Role { get; set; }
    }
    public class CurrentUserService : ICurrentUserService
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "User";

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            if (httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated == true)
            {
                Id = Guid.Parse(httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "Id")?.Value ?? Guid.Empty.ToString());
                Username = httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "Username")?.Value ?? string.Empty;
                Role = httpContextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "Role")?.Value ?? "User";
             }
        }

    }
}