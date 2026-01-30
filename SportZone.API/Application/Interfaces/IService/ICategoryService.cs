using System;
using SportZone.Application.Dtos;

namespace SportZone.Application.Interfaces.IService;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<CategoryDto> GetByIdAsync(int categoryId);
}