using System;
using Adidas.Application.Dtos;
using Adidas.Application.Interfaces;
using Adidas.Application.Interfaces.IRepositories;
using Adidas.Application.Interfaces.IService;
using Adidas.Domain.Exceptions;
using AutoMapper;

namespace Adidas.Application.Services;

public class InventoryService(IUnitOfWork uow, IMapper mapper) : IInventoryService
{
    public async Task UpdateInventoryAsync(int productId, int quantity)
    {
        if (quantity < 0)
        {
            throw new BadRequestException("Quantity cannot be negative.");
        }

        var inventory = await uow.InventoryRepository.GetByIdAsync(productId) //ef core tracked entity
            ?? throw new NotFoundException("Product not found."); 

        inventory.Quantity = quantity;
        inventory.UpdatedAt = DateTime.UtcNow;
        await uow.Complete();
    }

    public async Task<InventoryDto?> GetInventoryAsync(int productId)
    {
        var inventory =  await uow.InventoryRepository.GetByIdAsync(productId)
            ?? throw new NotFoundException("Product not found.");
         
        return mapper.Map<InventoryDto>(inventory);
    }

    public async Task<int> GetQuantityAsync(int productId)
    {
        var inventory = await uow.InventoryRepository.GetByIdAsync(productId) 
            ?? throw new NotFoundException("Product not found.");
        return inventory.Quantity;
    }
}