using System;
using Adidas.Application.Dtos;
using Adidas.Application.Interfaces;
using Adidas.Application.Interfaces.IRepositories;
using Adidas.Application.Interfaces.IService;
using AutoMapper;

namespace Adidas.Application.Services;

public class InventoryService(IUnitOfWork uow, IMapper mapper) : IInventoryService
{
    public async Task<bool> UpdateInventoryAsync(int productId, int quantity)
    {
        var result = await uow.InventoryRepository.UpdateInventoryAsync(productId, quantity);
        if (result)
        {
            await uow.Complete();
        }
        return result;
    }

    public async Task<InventoryDto?> GetInventoryAsync(int productId)
    {
        var inventory =  await uow.InventoryRepository.GetInventoryAsync(productId);
        if (inventory == null)
        {
            return null;
        }
        return mapper.Map<InventoryDto>(inventory);
    }
}