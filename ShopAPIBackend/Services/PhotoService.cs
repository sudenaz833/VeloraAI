using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using ShopAPI.Settings;

namespace ShopAPI.Services
{
    public class PhotoService 
    {
        private readonly Cloudinary? _cloudinary;
        public PhotoService(IOptions<CloudinarySettings> config)
        {
            if (config.Value != null &&
                !string.IsNullOrEmpty(config.Value.CloudName) &&
                !string.IsNullOrEmpty(config.Value.ApiKey) &&
                !string.IsNullOrEmpty(config.Value.ApiSecret))
            {
                 var Acc = new Account(
                    config.Value.CloudName,
                    config.Value.ApiKey,
                    config.Value.ApiSecret
                 );
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