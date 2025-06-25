using Microsoft.EntityFrameworkCore;
using PumpLogApi.Data;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

builder.Services.AddDbContextPool<PumpLogDbContext>(opt =>
opt.UseNpgsql(builder.Configuration.GetConnectionString("SqlConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Create the migration on application startup
using(var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PumpLogDbContext>();
    db.Database.Migrate(); 
}
app.MapOpenApi();
if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
}
app.Run();
