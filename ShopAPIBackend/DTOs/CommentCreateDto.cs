namespace ShopAPI.DTOs{
    public class CommentCreateDto{
        public int ProductId { get; set; }
        public int CustomerId { get; set; }
        public string Text { get; set; } = string.Empty;
        public string Rating { get; set; } = string.Empty;
    }
}