using Adidas.Application.Dtos;
using Adidas.Application.Interfaces;
using Adidas.Application.Interfaces.IService;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController(IProductService productService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductDto>>> GetProducts()
        {
            var products = await productService.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("{productId:int}")]
        public async Task<IActionResult> GetProductById(int productId)
        {
            var product = await productService.GetByIdAsync(productId);
            if (product == null)
            {
                return NotFound(new { message = "The product does not exist." });
            }
            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> AddProduct(CreateProductDto productDto)
        {
            try
            {
                var productAdded = await productService.AddAsync(productDto);
                
                return CreatedAtAction(nameof(GetProductById), new { productId = productAdded.Id }, productAdded);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{productId:int}")]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            var result = await productService.DeleteAsync(productId);
            if (!result)
            {
                return NotFound(new { message = "The product does not exist." });
            }
            return Ok(new { message = "Product deleted successfully." });
        }
    }
}