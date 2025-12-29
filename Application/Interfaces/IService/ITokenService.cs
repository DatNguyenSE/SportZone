using API.Entities;

namespace Adidas.Application.Interfaces.IService
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
        string GenerateRefreshToken();
    }
}