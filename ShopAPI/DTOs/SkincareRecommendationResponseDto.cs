namespace ShopAPI.DTOs
{
    public class SkincareRecommendationResponseDto
    {
        public string RecommendationTitle { get; set; } = string.Empty;
        public string GeneralAdvice { get; set; } = string.Empty;
        public List<RecommendedProductDto> RecommendedProducts { get; set; } = new();
    }

    public class RecommendedProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ReasonForRecommendation { get; set; } = string.Empty;
    }
}