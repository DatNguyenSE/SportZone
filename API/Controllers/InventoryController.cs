using Adidas.Application.Dtos;
using Adidas.Application.Interfaces.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Adidas.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController(IInventoryService inventoryService) : ControllerBase
    {
        [HttpPut("{productId:int}/update")]
        public async Task<ActionResult> UpdateInventory(int productId, int quantity)
        {
            var result = await inventoryService.UpdateInventoryAsync(productId, quantity);
            if (!result)
            {
                return BadRequest(new { message = "Error updating inventory." });
            }
            return Ok("Inventory updated successfully.");
        }
        [HttpGet("{productId:int}")]
        public async Task<ActionResult<InventoryDto>> GetInventory(int productId)
        {
            var inventory = await inventoryService.GetInventoryAsync(productId);
            if (inventory == null)
            {
                return NotFound(new { message = "Inventory not found." });
            }
            return Ok(inventory);
        }
    }
}
