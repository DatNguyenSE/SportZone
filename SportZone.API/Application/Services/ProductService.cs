using SportZone.Application.Dtos;
using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IService;
using SportZone.Domain.Exceptions;
using API.Entities;
using AutoMapper;

namespace SportZone.Application.Services
{
    public class ProductService(IUnitOfWork uow, IMapper mapper) : IProductService
    {
        public async Task<ProductDto> AddAsync(CreateProductDto createDto)
        {
            var errors = new List<string>();
            
            var isDuplicate = await uow.ProductRepository.AnyAsync(p => p.Name == createDto.Name);
            if (isDuplicate) errors.Add("Product name already exists.");

            if( createDto.Price < 0) errors.Add("Price must be greater than or equal to 0.");

            if (errors.Count > 0)
            {
                throw new BadRequestException("Validation failed.", errors.ToArray());
            }

            var entity = mapper.Map<Product>(createDto);

            // 1:1 relationship 
                entity.Inventory = new Inventory
                {
                    Quantity = createDto.Quantity,
                };
            
            
            await uow.ProductRepository.AddAsync(entity);
            await uow.Complete();
            return mapper.Map<ProductDto>(entity);
        }

        public async Task DeleteAsync(int id)
        {
            var result = await uow.ProductRepository.ChangeStatusProduct(id); // soft delete
            if (!result)
            {
                throw new NotFoundException($"Product with id {id} not found.");
            }
            await uow.Complete();
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            var products = await uow.ProductRepository.GetAllProductWithInventoryAndCategoryAsync();
            return mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var entity = await uow.ProductRepository.GetProductWithInventoryByIdAsync(id);
            if (entity == null)
            {
               throw new NotFoundException($"Product with id {id} not found.");
            }
            return mapper.Map<ProductDto>(entity);
        }

        public async Task<IEnumerable<ProductDto>> GetListByCategoryIdAsync(int categoryId)
        {
        // Kiểm tra Category có tồn tại không trước (Optional - Good UX)
        // var categoryExists = await uow.CategoryRepository.ExistsAsync(categoryId);
        // if (!categoryExists) throw new NotFoundException($"Category {categoryId} not found.");
            var entities = await uow.ProductRepository.GetListByCategoryIdAsync(categoryId);
            return mapper.Map<IEnumerable<ProductDto>>(entities);
        }

        public async Task<ProductDto?> UpdateAsync(int id, ProductDto productDto)
        {
            var existingProduct = await uow.ProductRepository.GetByIdAsync(id);
            if (existingProduct == null)
            {
                throw new NotFoundException($"Product with id {id} not found.");
            }
            mapper.Map(productDto, existingProduct); // bo qua thuoc tinh thieu dto có mà entity k
            uow.ProductRepository.Update(existingProduct);
            await uow.Complete();
            return mapper.Map<ProductDto>(existingProduct);
        }
    }
}