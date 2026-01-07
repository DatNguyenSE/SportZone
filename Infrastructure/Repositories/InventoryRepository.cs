using System;
using Adidas.Application.Interfaces;
using Adidas.Application.Interfaces.IRepositories;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Adidas.Infrastructure.Repositories;

public class InventoryRepository( AppDbContext _context) : GenericRepository<Inventory>(_context), IInventoryRepository
{

}
