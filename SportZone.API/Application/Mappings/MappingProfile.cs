using AutoMapper;
using SportZone.Application.Dtos;
using API.Entities;
using SportZone.Domain.Entities;

namespace SportZone.Application.Mappings
{

    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // CreateMap<ProductDto, Product>();

            // ReverseMap() giúp map 2 chiều: Product <-> ProductDto
            CreateMap<Product, ProductDto>().ReverseMap();
            CreateMap<CreateProductDto, Product>();
            CreateMap<UpdateProductDto, Product>();


            //inventory
            CreateMap<InventoryDto, Inventory>().ReverseMap();
            CreateMap<Product, ProductDto>()

                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Inventory != null ? src.Inventory.Quantity : 0))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.CategoryName : null ))
                .ReverseMap();

            // Map CartItem -> CartItemDto (Destination , Options)
            CreateMap<CartItem, CartItemDto>()
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product))
                .AfterMap((src, dest) => 
                    {
                        if (dest.Product != null) dest.Product.Quantity = src.Quantity;
                    });
            //  Map Cart -> CartDto
            CreateMap<Cart, CartDto>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items)).ReverseMap();
            
            // Map AddCartItemDto -> CartItem ( for adding items to cart)
            CreateMap<AddCartItemDto, CartItem>();

            //map order
            CreateMap<Order, OrderDto>().ReverseMap();
            CreateMap<Order, OrderDetailsDto>()
                .ForMember(dest => dest.Payment, opt => opt.MapFrom(src => src.Payment));
                
            CreateMap<OrderItem, OrderItemDto>().ReverseMap();
            CreateMap<Payment, PaymentDto>().ReverseMap();
            CreateMap<Product, ProductItemDto>().ReverseMap();

            //map category
            CreateMap<Category,CategoryDto>().ReverseMap();

            //map promotion
            CreateMap<Promotion, PromotionDto>().ReverseMap();
        }
    }
}