using System.Collections.Generic;

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

        public List<string>? ActiveIngredients { get; set; } = new List<string>();
        public List<string>? SkinTypes { get; set; } = new List<string>();
        public List<string>? Concerns { get; set; } = new List<string>();
        public string? UsageTime { get; set; }
    }
}