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

            // Fallback to root configuration or direct environment variables if section binding is empty
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