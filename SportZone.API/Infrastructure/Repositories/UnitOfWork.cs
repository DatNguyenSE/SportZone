using System;
using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IRepositories;
using Microsoft.EntityFrameworkCore;
using SportZone.Infrastructure.Data;

namespace SportZone.Infrastructure.Repositories;

public class UnitOfWork(AppDbContext _context): IUnitOfWork
{
    private IProductRepository? _productRepository;
    private IInventoryRepository? _inventoryRepository;
    private ICartRepository? _cartRepository;
    private IOrderRepository? _orderRepository;
    private ICategoryRepository? _categoryRepository;

//when other function call (uow.ProductRepository) -> check and avoid create multiple instance
    public IProductRepository ProductRepository => _productRepository 
        ??= new ProductRepository(_context);

    public IInventoryRepository InventoryRepository => _inventoryRepository 
        ??= new InventoryRepository(_context);
    public ICartRepository CartRepository => _cartRepository 
        ??= new CartRepository(_context);

    public IOrderRepository OrderRepository => _orderRepository
        ??= new OrderRepository(_context);
    public ICategoryRepository CategoryRepository => _categoryRepository
        ??= new CategoryRepository(_context);
        
    public async Task<bool> Complete()
    {
        try
        {
            return await _context.SaveChangesAsync() > 0; //Sửa dữ liệu trên RAM -> Chờ lệnh Save -> EF sinh SQL -> Gửi DB
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
