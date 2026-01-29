using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SportZone.Application.Dtos;
using SportZone.Application.Interfaces.IService;

namespace SportZone.API.Controllers
{
    [Route("api/Categories")]
    [ApiController]
    public class CategoryController(ICategoryService categoryService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetCategories()
        {
            var categories = await categoryService.GetAllAsync();
            return Ok(categories);
        }
    }
}
