using System;
using API.Entities;

namespace Adidas.Application.Interfaces.IRepositories;

public interface IInventoryRepository : IGenericRepository<Inventory>
{
    Task<bool> UpdateInventoryAsync(int productId, int quantity);
    Task<Inventory?> GetInventoryAsync(int productId);
}
