using System;
using Adidas.Application.Interfaces.IRepositories;

namespace Adidas.Application.Interfaces;

public interface IUnitOfWork
{
    IProductRepository ProductRepository { get; }
    IInventoryRepository InventoryRepository { get; }
    Task<bool> Complete();
    bool HasChange();
}
