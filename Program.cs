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
  .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Authentication:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Authentication:Audience"],

            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero, // optional: verhindert 5-Min-Puffer

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Authentication:Token"]!))
        };
    });
builder.Services.AddAuthorization();

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
using(var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PumpLogDbContext>();
    db.Database.Migrate(); 
}


app.Run();
