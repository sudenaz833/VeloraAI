namespace ShopAPI.DTOs
{
    public class CustomerReadDto
    {
        public int CustomerId{ get; set;} 
        public string FirstName{ get; set;} = string.Empty;
        public string LastName{get; set;} = string.Empty;
        public string Email{get; set;} = string.Empty;
        public string? Phone{get; set;} 
        public string? Address{get; set;} = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}