using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopAPI.Data;
using ShopAPI.DTOs;
using ShopAPI.Services;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace ShopAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SkinCareController : ControllerBase
    {
        private readonly GroqService _groqService;
        private readonly ShopDbContext _context;

        public SkinCareController(GroqService groqService, ShopDbContext context)
        {
            _groqService = groqService;
            _context = context;
        }

        [HttpPost("recommend")]
        public async Task<IActionResult> GetRecommendation([FromBody] QuizrequestDto quizResult)
        {
            // 1. LINQ Sorgusu Oluşturma
            var query = _context.Products.Where(p => p.Stock > 0).AsQueryable();

            if (!string.IsNullOrWhiteSpace(quizResult.SkinType))
            {
                query = query.Where(p => p.SkinTypes != null && 
                    (p.SkinTypes.Contains(quizResult.SkinType) || p.SkinTypes.Contains("Tüm Cilt Tipleri")));
            }

            var candidateProducts = await query
                .Select(p => new CandidateProductDto
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    ActiveIngredients = p.ActiveIngredients ?? string.Empty,
                    UsageTime = p.UsageTime ?? string.Empty,
                    Concerns = p.Concerns ?? string.Empty
                })
                .Take(10)
                .ToListAsync();

            if (!candidateProducts.Any())
            {
                candidateProducts = await _context.Products
                    .Where(p => p.Stock > 0)
                    .Select(p => new CandidateProductDto
                    {
                        ProductId = p.ProductId,
                        ProductName = p.ProductName,
                        ActiveIngredients = p.ActiveIngredients ?? string.Empty,
                        UsageTime = p.UsageTime ?? string.Empty,
                        Concerns = p.Concerns ?? string.Empty
                    })
                    .Take(10)
                    .ToListAsync();
            }

            // 3. Groq İçin Payload Hazırlığı
            var userPayload = new
            {
                UserProfile = quizResult,
                AvailableProducts = candidateProducts
            };
            string userJsonData = JsonSerializer.Serialize(userPayload);

            // 4. Sistem Talimatı (Şablon Kuralı Dahil)
            string systemPrompt = @"Sen Velora markasının profesyonel dermatoloğusun.
Görevin: Sana JSON formatında verilen ürün listesinden, kullanıcının cilt tipi ve cilt endişelerine (concerns) en uygun 2 veya 3 ürünü seçmek.

DİL VE ANLATIM KURALLARI (ÇOK ÖNEMLİ):
1. 'Concerns' kelimesini sakın 'Konular' diye çevirme! 'Cilt Endişeleri', 'Cilt Sorunları' veya 'Cilt İhtiyaçları' terimlerini kullan.
2. Gramer hatalı, uydurma veya anlamsız kelimeler (örn: 'Kanızlaşık', 'Bozulmuştur Cilt Bariyeri') KESİNLİKLE kullanma.
3. Cümlelerin kurallı, akıcı ve profesyonel bir Türkçe ile yazıldığından emin ol.
4. 'generalAdvice' kısmını kullanıcının genel cilt bakımına yönelik mantıklı ve akıcı 1-2 cümle olarak yaz.

ÇIKTI FORMATI:
Yalnızca aşağıdaki JSON yapısını döndür. Markdown (```json) veya ekstra metin ekleme:

{
  ""recommendationTitle"": ""Karma ve Akneye Eğilimli Ciltler İçin Onarıcı Rutin"",
  ""generalAdvice"": ""Cildinizdeki gözenek ve siyah nokta oluşumunu kontrol altına almak için salisilik asit içeren ürünleri rutinize ekleyebilirsiniz."",
  ""recommendedProducts"": [
    {
      ""productId"": 21,
      ""productName"": ""Paulas Choice %2 BHA Serumu"",
      ""reasonForRecommendation"": ""İçeriğindeki Salisilik Asit sayesinde siyah nokta ve akne oluşumunu engellemeye yardımcı olur.""
    }
  ]
}";

            // 5. Groq İsteği ve Deserialize İşlemi
            var aiResponseJson = await _groqService.GetSkincareRecommendationAsync(systemPrompt, userJsonData);

            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var result = JsonSerializer.Deserialize<SkincareRecommendationResponseDto>(aiResponseJson, options);
                return Ok(result);
            }
            catch
            {
                // Eğer yapay zeka aşırı nadir de olsa JSON dışı bir şey dönerse patlamamak için ham veriyi dönüyoruz
                return Ok(aiResponseJson);
            }
        }
    }
}