using SportZone.Application.Interfaces.IRepositories;
using Microsoft.EntityFrameworkCore;
using SportZone.Infrastructure.Data;
using SportZone.Domain.Entities;

namespace SportZone.Infrastructure.Repositories;

public class MembersRepository(AppDbContext _context) : GenericRepository<AppUser>(_context), IMembersRepository
{
    public Task<AppUser?> GetByEmailAsync(string email)
    {
        throw new NotImplementedException();
    }

    public async Task<AppUser?> GetMemberByIdAsync(string id)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<AppUser?> GetMemberWithOrdersAsync(string id)
    {
        return await _context.Users
            .Include(u => u.Orders)
            .FirstOrDefaultAsync(u => u.Id == id);
       
    }
    
}