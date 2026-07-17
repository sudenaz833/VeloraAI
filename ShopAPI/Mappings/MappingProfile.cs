using AutoMapper;
using ShopAPI.Entities;
using ShopAPI.DTOs;
namespace ShopAPI.Mappings
{
   
    public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<CustomerCreateDto, Customer>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()); 
        
        CreateMap<Customer, CustomerReadDto>().ReverseMap();
        CreateMap<Customer, CustomerUpdateDto>().ReverseMap();

        CreateMap<Basket, BasketReadDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => (src.Product != null && 
            src.Product.DiscountPrice.HasValue && src.Product.DiscountExpiresAt.HasValue && 
            src.Product.DiscountExpiresAt.Value > DateTime.UtcNow) ? src.Product.DiscountPrice.Value :
            (src.Product != null ? src.Product.Price : 0)))
            .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Product.ImageUrl))
            .ReverseMap()
            .ForMember(dest => dest.Product, opt => opt.Ignore());

        CreateMap<BasketCreateDto, Basket>();
        CreateMap<BasketUpdateDto, Basket>();

        CreateMap<Product, ProductReadDto>().ReverseMap();
        CreateMap<Product, ProductCreateDto>().ReverseMap();
        CreateMap<Product, ProductUpdateDto>().ReverseMap();

        CreateMap<Order, OrderReadDto>().ReverseMap();
        CreateMap<OrderUpdateDto, Order>().ReverseMap();
        CreateMap<Comment, CommentReadDto>()
            .ForMember(dest => dest.CustomerFirstName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.FirstName : string.Empty))
            .ForMember(dest => dest.CustomerLastName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.LastName : string.Empty))
            .ForMember(dest => dest.CustomerEmail, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Email : string.Empty));
        CreateMap<CommentReadDto, Comment>();
        CreateMap<Comment,CommentCreateDto>().ReverseMap();
        CreateMap<CommentUpdateDto, Comment>();
        
        
    }
}
    }
