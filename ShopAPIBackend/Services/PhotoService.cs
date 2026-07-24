using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using ShopAPI.Settings;

namespace ShopAPI.Services
{
    public class PhotoService 
    {
        private readonly Cloudinary? _cloudinary;
        public PhotoService(IOptions<CloudinarySettings> config, IConfiguration configuration)
        {
            string? cloudName = config.Value?.CloudName;
            string? apiKey = config.Value?.ApiKey;
            string? apiSecret = config.Value?.ApiSecret;

            // Try parsing if the entire block was added under the single key 'CloudinarySettings' as a JSON string
            string? rawSettings = configuration["CloudinarySettings"] ?? Environment.GetEnvironmentVariable("CloudinarySettings");
            if (!string.IsNullOrEmpty(rawSettings) && rawSettings.Trim().StartsWith("{"))
            {
                try
                {
                    using var doc = System.Text.Json.JsonDocument.Parse(rawSettings);
                    var root = doc.RootElement;
                    if (root.TryGetProperty("CloudName", out var cn)) cloudName = cn.GetString();
                    if (root.TryGetProperty("ApiKey", out var ak)) apiKey = ak.GetString();
                    if (root.TryGetProperty("ApiSecret", out var asec)) apiSecret = asec.GetString();
                }
                catch
                {
                    // Ignore JSON parsing issues and fallback
                }
            }

            // Fallback to root configuration or direct environment variables if still empty
            if (string.IsNullOrEmpty(cloudName)) cloudName = configuration["CloudName"] ?? Environment.GetEnvironmentVariable("CloudName");
            if (string.IsNullOrEmpty(apiKey)) apiKey = configuration["ApiKey"] ?? Environment.GetEnvironmentVariable("ApiKey");
            if (string.IsNullOrEmpty(apiSecret)) apiSecret = configuration["ApiSecret"] ?? Environment.GetEnvironmentVariable("ApiSecret");

            if (!string.IsNullOrEmpty(cloudName) &&
                !string.IsNullOrEmpty(apiKey) &&
                !string.IsNullOrEmpty(apiSecret))
            {
                 var Acc = new Account(cloudName, apiKey, apiSecret);
                 _cloudinary = new Cloudinary(Acc);
            }
        }

        public async Task<String> AddPhotoAsync(IFormFile file)
        {
            if (_cloudinary == null)
            {
                throw new InvalidOperationException("Cloudinary settings are not configured in the application environment variables or appsettings.json.");
            }
            var uploadResult = new ImageUploadResult();
            if(file.Length > 0){
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation()
                        .Height(500)
                        .Width(500)
                        .Crop("fill")
                };
             uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }    
            return uploadResult.SecureUrl.ToString();
        }
    }
}