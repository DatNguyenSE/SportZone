using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SportZone.Application.Dtos;
using SportZone.Application.Dtos.SportZone.Application.Dtos;
using SportZone.Application.Interfaces.IService;

namespace SportZone.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController(IMembersService memberService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetAlMlembers()
        {
            var members = await memberService.GetAllAsync();
            return Ok(members);
        }


        [Authorize(Roles = "Admin")] // 1. Yêu cầu phải đăng nhập mới gọi được API này
        [HttpPost("/member-detail")]
        public async Task<ActionResult<MemberDto>> GetMemberById([FromBody] string memberId)
        {
            // Implement logic to retrieve a member by ID
            var member = await memberService.GetMemberDetailByIdAsync(memberId);
            return Ok(member);
        }

        [HttpPost("add")]
        public async Task<ActionResult> AddMember(UpdateProfileDto memberDto)
        {
            // Implement logic to add a new member
            await memberService.AddAsync(memberDto);
            return Ok();
        }

        [HttpPut("{memberId:int}/update")]
        public async Task<ActionResult> UpdateMember(string memberId, UpdateProfileDto memberDto)
        {
            // Implement logic to update an existing member
            await memberService.UpdateAsync(memberId, memberDto);
            return Ok();
        }

        [HttpDelete("{memberId:int}/delete")]
        public async Task<ActionResult> DeleteMember(string memberId)
        {
            // Implement logic to delete a member
            await memberService.DeleteAsync(memberId);
            return NoContent();
        }
    }
}
