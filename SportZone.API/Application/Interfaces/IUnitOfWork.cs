using System;
using SportZone.Application.Interfaces.IRepositories;

namespace SportZone.Application.Interfaces;

public interface IUnitOfWork
{
    IProductRepository ProductRepository { get; }
    IInventoryRepository InventoryRepository { get; }
    ICartRepository CartRepository { get; }
    IOrderRepository OrderRepository { get; }
    Task<bool> Complete();
    bool HasChange();
}
