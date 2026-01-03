using System;
using Adidas.Application.Dtos;
using API.Entities;

namespace Adidas.Application.Interfaces.IService;

public interface IInventoryService
{
    Task<bool> UpdateInventoryAsync(int productId, int quantity);
    Task<InventoryDto?> GetInventoryAsync(int productId);
    
}
