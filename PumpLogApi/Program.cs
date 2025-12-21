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

var issuer = builder.Configuration["Authentication:Issuer"] ?? string.Empty;
var issuerBase = issuer.TrimEnd('/');

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.Authority = issuerBase;
        o.MetadataAddress = $"{issuerBase}/.well-known/openid-configuration";
        o.Audience = builder.Configuration["Authentication:Audience"];
        o.MapInboundClaims = false;
        o.IncludeErrorDetails = true;

        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateAudience = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(60),
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowEverything",
        builder =>
        {
            builder
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
app.UseCors("AllowEverything");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Create the migration on application startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PumpLogDbContext>();
    db.Database.Migrate();
}

app.Run();
