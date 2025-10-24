using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PumpLogApi.Data;
using PumpLogApi.DipendencyInjection;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddServices();
    builder.Services.AddManager();
    builder.Services.AddControllers();
    builder.Services.AddOpenApi();
}



builder.Services.AddDbContextPool<PumpLogDbContext>(opt =>
opt.UseNpgsql(builder.Configuration.GetConnectionString("SqlConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.Authority = builder.Configuration["Authentication:Authority"];
        o.Audience = builder.Configuration["Authentication:Audience"];
        o.MapInboundClaims = false;
        o.IncludeErrorDetails = true;

        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(60),
        };
    });

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Create the migration on application startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PumpLogDbContext>();
    db.Database.Migrate();
}

app.MapGet("/orders", () => Results.Ok(new { ok = true }))
   .RequireAuthorization("orders.read");


app.Run();

