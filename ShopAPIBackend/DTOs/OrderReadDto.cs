namespace ShopAPI.DTOs
{
    public class OrderReadDto
    {
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
        public string? ProductName { get; set; }
        public string? ProductsSummary { get; set; }
        public decimal TotalPrice { get; set; }
        public string? OrderStatus { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}