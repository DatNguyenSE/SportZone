using Adidas.Application.Dtos;
using Adidas.Application.Interfaces.IService;
using API.Entities;

namespace Adidas.Application.Extensions
{
    public static class AppUserExtensions
{
    public static async Task<UserDto> ToDto(this AppUser user, ITokenService tokenService)
    {
        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            UserName = user.UserName!,
            Email = user.Email!,
            ImageUrl = user.ImageUrl,
            Token = await tokenService.CreateToken(user)
        };
    }
}
}