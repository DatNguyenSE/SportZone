using AutoMapper;
using Adidas.Application.Dtos; 
using API.Entities; 

namespace Adidas.Application.Mappings
{

    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // CreateMap<ProductDto, Product>();

            // ReverseMap() giúp map 2 chiều: Product <-> ProductDto
            CreateMap<Product, ProductDto>().ReverseMap();

            //inventory
            CreateMap<InventoryDto, Inventory>().ReverseMap();
            CreateMap<Product, ProductDto>()
               
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Inventory != null ? src.Inventory.Quantity : 0))
                .ReverseMap();


        }
    }
}