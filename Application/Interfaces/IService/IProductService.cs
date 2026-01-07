using System;
using Adidas.Application.Dtos;

namespace Adidas.Application.Interfaces.IService;

public interface IProductService
{
    Task<ProductDto?> GetByIdAsync(int id);
    Task<IEnumerable<ProductDto>> GetAllAsync();
    Task<ProductDto> AddAsync(CreateProductDto createDto);
    Task<ProductDto?> UpdateAsync(int id, ProductDto productDto);
    Task<IEnumerable<ProductDto>> GetListByCategoryIdAsync(int categoryId);
    Task DeleteAsync(int id);
}
