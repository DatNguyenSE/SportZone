using System;
using SportZone.Application.Dtos;
using API.Entities;

namespace SportZone.Application.Interfaces.IService;

public interface IInventoryService
{
    Task UpdateInventoryAsync(int productId, int quantity);
    Task<InventoryDto?> GetInventoryAsync(int productId);
    Task<int> GetQuantityAsync(int productId);
    
}
