using SportZone.Application.Interfaces.IRepositories;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using SportZone.Infrastructure.Data;

namespace SportZone.Infrastructure.Repositories;

public class CategoryRepository(AppDbContext _context) : GenericRepository<Category>(_context), ICategoryRepository
{
    
}