namespace ShopAPI.DTOs
{
    public class CandidateProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ActiveIngredients { get; set; } = string.Empty; // Salisilik Asit, Niacinamide vs.
        public string UsageTime { get; set; } = string.Empty;        // Gündüz / Gece
        public string Concerns { get; set; } = string.Empty;
    }
}