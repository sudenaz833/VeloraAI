using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ShopAPI.Data;
using ShopAPI.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ShopAPI.Mappings;
using FluentValidation;
using FluentValidation.AspNetCore;
using ShopAPI.Validators;
using ShopAPI.Entities;

var builder = WebApplication.CreateBuilder(args);

// Render / Container ortamlarında inotify FileSystemWatcher hatasını önleme
builder.Configuration.Sources.Clear();
builder.Configuration
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: false)
    .AddEnvironmentVariables();

// 1. Servisler
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<ProductCreateDtoValidator>();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddDbContext<ShopDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Servis Kayıtları
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IBasketService, BasketService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<ICommentService,CommentService>();
builder.Services.AddScoped<GroqService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVercel", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
}); 


var tokenKey = "bu-benim-coook-uzun-ve-guvenli-anahtarim-32-karakterden-fazla-olmali-mutlaka";
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateIssuer = false,
            ValidateAudience = false,
            RoleClaimType = ClaimTypes.Role
        };
    });

builder.Services.AddAuthorization();

// 3. Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Lütfen 'Bearer {token}' şeklinde girin",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey
      });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
    {
        new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } },
        Array.Empty<string>()
    }});
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();


app.UseCors("AllowVercel");
app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();
// Veritabanı migration işlemini senkron olarak çalıştır (Tabloların hazır olduğundan emin olmak için)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<ShopDbContext>();
        logger.LogInformation("Veritabanı bağlantısı kontrol ediliyor ve bekleyen migration'lar uygulanıyor...");
        context.Database.Migrate();
        logger.LogInformation("Veritabanı hazır ve tüm tablolar oluşturuldu.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Veritabanı ilklendirilirken bir hata oluştu: " + ex.Message);
    }
}

app.Run();