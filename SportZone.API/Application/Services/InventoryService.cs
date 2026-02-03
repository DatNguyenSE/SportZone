using System;
using SportZone.Application.Dtos;
using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IRepositories;
using SportZone.Application.Interfaces.IService;
using SportZone.Domain.Exceptions;
using AutoMapper;

namespace SportZone.Application.Services;

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
        var productExists = await uow.ProductRepository.AnyAsync(p => p.Id == productId);
        if (!productExists) throw new NotFoundException("Product not found.");
        
        var quantity = await uow.InventoryRepository.GetQuantityAsync(productId);
        return quantity;
    }
}