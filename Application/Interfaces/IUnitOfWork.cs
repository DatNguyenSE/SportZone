using System;

namespace Adidas.Application.Interfaces;

public interface IUnitOfWork
{
    IProductRepository ProductRepository { get; }
    Task<bool> Complete();
    bool HasChange();
}
