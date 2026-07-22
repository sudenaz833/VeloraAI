namespace ShopAPI.DTOs
{
    public class QuizrequestDto
    {

        public string SkinType { get; set; } = string.Empty;
        public List<string> Concerns { get; set; } = new();
        public string? AgeRange { get; set; }
        public string? Sensitivity { get; set; }
    }
}