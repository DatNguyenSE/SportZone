using System;
using SportZone.Domain.Enums;
using SportZone.Domain.Entities;

namespace SportZone.Application.Interfaces.IRepositories;

public interface IMembersRepository : IGenericRepository<AppUser>
{
    Task<AppUser?> GetByEmailAsync(string email);
    Task<AppUser?> GetMemberWithOrdersAsync(string id);
    Task<AppUser?> GetMemberByIdAsync(string id);
}
