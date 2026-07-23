namespace ShopAPI.DTOs
{
    public class BasketReadDto
    {
      public int BasketId { get; set;}
      public string? ProductName { get; set;}
      public int CustomerId { get; set;}
      public int ProductId { get; set;}
      public int Quantity{get; set;}
      public decimal Price { get; set; }
      public string? ImageUrl { get; set;}
    }
}