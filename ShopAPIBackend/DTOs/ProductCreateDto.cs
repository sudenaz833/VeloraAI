namespace ShopAPI.DTOs
{
    public class ProductCreateDto
    {
        public string? ProductName { get; set;}
        public decimal Price {get; set;}
        public int Stock { get; set;}
        public string? ImageUrl { get; set; }
        public string? Category { get; set;}
        public decimal? DiscountPrice { get; set; }
        public DateTime? DiscountExpiresAt { get; set; }
    }
}