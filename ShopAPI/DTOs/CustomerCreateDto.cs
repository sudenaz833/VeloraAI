namespace ShopAPI.DTOs
{
    public class CustomerCreateDto
    {
        public string FirstName { get; set;}=string.Empty;
         public string LastName{get; set;}=string.Empty;
          public string? Address { get; set;}
        public string Email{ get; set;}=string.Empty;
        public string? Phone{ get; set;}
        public string Password { get; set;}=string.Empty;
       
       
    }
}