using Adidas.Application.Dtos;
using Adidas.Application.Interfaces.IService;
using Adidas.Application.Extensions;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Adidas.API.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var user = new AppUser
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                DateOfBirth = registerDto.DateOfBirth,
                FullName = registerDto.FullName
            };

            var result = await userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("identity", error.Description);
                }
                return ValidationProblem();
            }
            await userManager.AddToRoleAsync(user, "Member"); //have to seed roles-data before
            await SetRefreshTokenCookie(user);
            return await user.ToDto(tokenService);
        }

        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email address!");
            }
            var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

            if(!result)
            {
                return Unauthorized("Invalid password!");
            }
            return await user.ToDto(tokenService);

        }
        private async Task SetRefreshTokenCookie(AppUser user)
        {
            var refreshToken = tokenService.GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,                 // JavaScript không đọc trộm được (Chống XSS)
                Secure = true,                   // Chỉ chạy trên HTTPS
                SameSite = SameSiteMode.Strict,  // Chỉ gửi cookie khi request từ chính trang web của bạn (Chống CSRF)
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}
