using System;
using SportZone.Application.Dtos;
using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IService;
using SportZone.Domain.Exceptions;
using API.Entities;
using AutoMapper;

namespace SportZone.Application.Services;

public class CategoryService(IUnitOfWork uow, IMapper mapper) : ICategoryService
{
    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await uow.CategoryRepository.GetAllAsync();
        return mapper.Map<IEnumerable<CategoryDto>>(categories);
    }

    public async Task<CategoryDto> GetByIdAsync(int categoryId)
    {
        var category = await uow.CategoryRepository.GetByIdAsync(categoryId);
        return mapper.Map<CategoryDto>(category);
    }

  
}