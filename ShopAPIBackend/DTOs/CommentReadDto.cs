namespace ShopAPI.DTOs{
    public class CommentReadDto{
        public int CommentId { get; set; }
        public int ProductId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerFirstName { get; set; } = string.Empty;
        public string CustomerLastName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public string Rating { get; set; } = string.Empty;
    }
}