using AutoMapper;
using SportZone.Application.Dtos;
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

            // Map CartItem -> CartItemDto
            CreateMap<CartItem, CartItemDto>()
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product))
                .ForMember(dest => dest.ProductSize, opt => opt.MapFrom(src => src.ProductSize))

    // 3. Xử lý lại logic gán Quantity (Số lượng mua)
                .AfterMap((src, dest) =>
                {
                    if (dest.ProductSize != null)
                    {
                        dest.ProductSize.Quantity = src.Quantity;
                    }
                });
            //  Map Cart -> CartDto
            CreateMap<Cart, CartDto>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items)).ReverseMap();

            // Map AddCartItemDto -> CartItem ( for adding items to cart)
            CreateMap<AddCartItemDto, CartItem>();


            //map product size
            CreateMap<ProductSize, ProductSizeDto>().ReverseMap();


            //map order
            CreateMap<Order, OrderDto>().ReverseMap();
            CreateMap<Order, OrderDetailsDto>()
                .ForMember(dest => dest.Payment, opt => opt.MapFrom(src => src.Payment));

            CreateMap<OrderItem, OrderItemDto>().ReverseMap();
            CreateMap<Payment, PaymentDto>().ReverseMap();
            CreateMap<Product, ProductItemDto>().ReverseMap();

            //map category
            CreateMap<Category, CategoryDto>().ReverseMap();

            //map promotion
            CreateMap<Promotion, PromotionDto>().ReverseMap();
        }
    }
}