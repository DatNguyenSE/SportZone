using SportZone.Application.Dtos;
using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IService;
using SportZone.Domain.Exceptions;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using SportZone.Domain.Entities;

namespace SportZone.Application.Services
{
    public class ProductService(IUnitOfWork uow, IMapper mapper, IPhotoService photoService) : IProductService
    {
        public async Task<ProductDto> AddAsync(CreateProductDto createDto)
        {
            var errors = new List<string>();

            var isDuplicate = await uow.ProductRepository.AnyAsync(p => p.Name == createDto.Name);
            if (isDuplicate) errors.Add("Product name already exists.");

            if (createDto.Price < 0) errors.Add("Price must be greater than or equal to 0.");

            if (errors.Count > 0)
            {
                throw new BadRequestException("Validation failed.", errors.ToArray());
            }

            var entity = mapper.Map<Product>(createDto);

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
            var products = await uow.ProductRepository.GetAllProductsDetailAsync();
            return mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var entity = await uow.ProductRepository.GetProductByIdAsync(id);
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

        public async Task<IEnumerable<ProductDto>> GetListByFeatureIdAsync(int featureId)
        {
            var products = await uow.ProductRepository.GetListByFeatureIdAsync(featureId);
            if (products == null)
            {
                throw new BadRequestException($"No products found with the specified feature.");
            }
            return mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<IEnumerable<ProductDto>> GetListByLabelAsync(string label)
        {
            var products = await uow.ProductRepository.GetListByLabelAsync(label);
            if(products == null)
            {
                throw new BadRequestException($"Product with label: {label} not found");
            }
                return mapper.Map<IEnumerable<ProductDto>>(products);

        }

       

        public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto productDto, IFormFile? file)
        {
            
            var product = await uow.ProductRepository.GetProductByIdAsync(id);
            

            if (product == null)
            {
                throw new NotFoundException($"Product with id {id} not found.");
            }

      
            mapper.Map(productDto, product);

          
            if (file != null)
            {
                if (!string.IsNullOrEmpty(product.PublicId))
                {
                    await photoService.DeletePhotoAsync(product.PublicId);
                }

                var uploadResult = await photoService.AddPhotoAsync(file);
                if (uploadResult.Error != null) throw new Exception(uploadResult.Error);

                product.ImageUrl = uploadResult.Url;
                product.PublicId = uploadResult.PublicId;
            }

         
            if (productDto.ProductSizes != null)
            {
         
                product.ProductSizes.Clear();

             
                var newSizes = mapper.Map<List<ProductSize>>(productDto.ProductSizes);
                foreach (var size in newSizes)
                {
                    product.ProductSizes.Add(size);
                }
            }

            uow.ProductRepository.Update(product);
            await uow.Complete();

         
            return mapper.Map<ProductDto>(product);
        }
    }
}