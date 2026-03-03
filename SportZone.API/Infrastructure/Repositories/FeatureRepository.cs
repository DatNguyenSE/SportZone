using SportZone.Application.Interfaces.IRepositories;
using Microsoft.EntityFrameworkCore;
using SportZone.Infrastructure.Data;
using SportZone.Domain.Entities;

namespace SportZone.Infrastructure.Repositories;

public class FeatureRepository(AppDbContext _context) : GenericRepository<Feature>(_context), IFeatureRepository
{
  
}