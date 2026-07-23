namespace ShopAPI.DTOs
{
    public class ProductReadDto
    {
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? ImageUrl { get; set; }
        public string? Category { get; set; }
        public int IsBasketCount { get; set; }  
        public decimal? DiscountPrice { get; set; }
        public DateTime? DiscountExpiresAt { get; set; }  
        public double AverageRating { get; set; }
        public int CommentCount { get; set; }

        public string? ActiveIngredients { get; set; }
        public string? SkinTypes { get; set; }
        public string? Concerns { get; set; }
        public string? UsageTime { get; set; }
    }
}