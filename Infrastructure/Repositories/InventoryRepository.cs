using System;
using Adidas.Application.Interfaces;
using Adidas.Application.Interfaces.IRepositories;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Adidas.Infrastructure.Repositories;

public class InventoryRepository( AppDbContext _context) : GenericRepository<Inventory>(_context), IInventoryRepository
{
    public async Task<bool> UpdateInventoryAsync(int productId, int quantity)
    {
        var inventory = await _context.Inventories.FirstOrDefaultAsync(i => i.ProductId == productId);
        if (inventory == null)
        {
            return false;
        }

        inventory.Quantity = quantity;
        inventory.UpdatedAt = DateTime.UtcNow;
        return true;
    }
    public Task<Inventory?> GetInventoryAsync(int productId)
    {
        return _context.Inventories.FirstOrDefaultAsync(i => i.ProductId == productId);
    }

}
