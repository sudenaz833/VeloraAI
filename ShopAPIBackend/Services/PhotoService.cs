using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using ShopAPI.Settings;

namespace ShopAPI.Services
{
    public class PhotoService 
    {
        private readonly Cloudinary _cloudinary;
        public PhotoService(IOptions<CloudinarySettings> config)
        {
             var Acc = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
             );
            _cloudinary = new Cloudinary(Acc);
        }

        public async Task<string?> AddPhotoAsync(IFormFile file)
        {
            // 1. KORUMA KALKANI: Dosya boşsa hiç zorlama, direkt geri dön!
            if (file == null || file.Length == 0)
            {
                return null;
            }

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream)
            };
            
            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            
            // 2. KORUMA KALKANI: Soru işaretleri (?) sayesinde SecureUrl null ise 
            // sistem çökmez, geriye sadece 'null' döndürür.
            return uploadResult?.SecureUrl?.ToString();
        }
    }
}