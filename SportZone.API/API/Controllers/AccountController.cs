using SportZone.Application.Dtos;
using SportZone.Application.Interfaces.IService;
using SportZone.Application.Extensions;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using SportZone.API.Extensions;

namespace SportZone.API.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService) : ControllerBase
    {
        // [HttpPost("register")]
        // public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        // {
        //     var user = new AppUser
        //     {
        //         Email = registerDto.Email,
        //         UserName = registerDto.UserName
        //     };

        //     var result = await userManager.CreateAsync(user, registerDto.Password);
        //     if (!result.Succeeded)
        //     {
        //         foreach (var error in result.Errors)
        //         {
        //             ModelState.AddModelError("identity", error.Description);
        //         }
        //         return ValidationProblem();
        //     }
        //     await userManager.AddToRoleAsync(user, "Member"); //have to seed roles-data before
        //     await SetRefreshTokenCookie(user);
        //     return await user.ToDto(tokenService);
        // }


        //   !login  ->  register 
        [HttpPost("authenticate")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);
            bool isNewUser = false;
            if (user == null)
            {
                user = new AppUser
                {
                    Email = loginDto.Email,
                    UserName = loginDto.Email, // 
                    FullName = loginDto.Email.Split("@")[0]
                };

                var result = await userManager.CreateAsync(user, loginDto.Password);
                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("identity", error.Description);
                    }
                    return ValidationProblem();
                }
                await userManager.AddToRoleAsync(user, "Member"); //have to seed roles-data before
                isNewUser = true;
            }
            else
            {
                var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

                if (!result) return Unauthorized("Invalid password!");

            }
            await SetRefreshTokenCookie(user);
            var userDto = await user.ToDto(tokenService);

            return Ok(new
            {
                user = userDto,
                Message = isNewUser ? "New account successfully created.!" : "Log in successfully!",
                IsNewUser = isNewUser
            });
        }


        [HttpPost("refresh-token")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (refreshToken == null) return NoContent();

            var user = await userManager.Users
                .FirstOrDefaultAsync(x => x.RefreshToken == refreshToken
                    && x.RefreshTokenExpiry > DateTime.UtcNow);

            if (user == null) return Unauthorized();

            await SetRefreshTokenCookie(user);

            return await user.ToDto(tokenService);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await userManager.Users
                .Where(x => x.Id == User.GetUserId())
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.RefreshToken, _ => null)
                    .SetProperty(x => x.RefreshTokenExpiry, _ => null)
                    );

            Response.Cookies.Delete("refreshToken");

            return Ok();
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.GetUserId();
            var profile = await userManager.FindByIdAsync(userId);
            
            // var profileUser = UserService.GetProfile();

            if (profile == null) return Unauthorized();
        
            return Ok(new UserProfileDto
            {
                Id = profile.Id,
                UserName = profile.UserName,
                Email = profile.Email!,
                ImageUrl = profile.ImageUrl,
                FullName = profile.FullName,
                Address = "55/11 lo lu , truong thanh, tp.hcm",
                Gender = "Male",
                DateOfBirth = "6/11/2005",
                Phone = "091992492"
                
            });
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
