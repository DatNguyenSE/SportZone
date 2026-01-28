using System;
using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IRepositories;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using SportZone.Infrastructure.Data;

namespace SportZone.Infrastructure.Repositories;

public class InventoryRepository(AppDbContext _context) : GenericRepository<Inventory>(_context), IInventoryRepository
{
    public async Task<IEnumerable<Inventory>> GetListByProductIdsAsync(IEnumerable<int> productIds)
    {
        return await _context.Inventories
                        .Where(i => productIds.Contains(i.ProductId))
                        .ToListAsync();
    }

    public async Task<int> GetQuantityAsync(int productID)
    {
        int quantity = await _context.Inventories
                        .Where(i => i.ProductId == productID)
                        .Select(i => i.Quantity)
                        .FirstOrDefaultAsync();

        return quantity;
    }
}
