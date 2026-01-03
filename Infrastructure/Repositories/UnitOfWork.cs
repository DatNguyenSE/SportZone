using System;
using Adidas.Application.Interfaces;
using Adidas.Application.Interfaces.IRepositories;
using API.Data;
using Microsoft.EntityFrameworkCore;

namespace Adidas.Infrastructure.Repositories;

public class UnitOfWork(AppDbContext _context): IUnitOfWork
{
    private IProductRepository? _productRepository;
    private IInventoryRepository? _inventoryRepository;

//when other function call (uow.ProductRepository) -> check and avoid create multiple instance
    public IProductRepository ProductRepository => _productRepository 
        ??= new ProductRepository(_context);

    public IInventoryRepository InventoryRepository => _inventoryRepository 
        ??= new InventoryRepository(_context);
        
    public async Task<bool> Complete()
    {
        try
        {
            return await _context.SaveChangesAsync() > 0;
        }
        catch(DbUpdateException ex)
        {
            throw new Exception("An error occured while saving changes", ex);
        }
    }

    public bool HasChange()
    {
        return _context.ChangeTracker.HasChanges();
    }
}
