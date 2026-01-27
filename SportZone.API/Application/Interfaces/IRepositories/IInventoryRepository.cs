using System;
using API.Entities;

namespace SportZone.Application.Interfaces.IRepositories;

public interface IInventoryRepository : IGenericRepository<Inventory>
{
    Task<int> GetQuantityAsync(int productID);
    Task<IEnumerable<Inventory>> GetListByProductIdsAsync(IEnumerable<int> productIDs);
}
