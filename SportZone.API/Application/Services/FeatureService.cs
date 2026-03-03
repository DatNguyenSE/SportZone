using System;
using SportZone.Application.Dtos;
using SportZone.Application.Interfaces;
using SportZone.Application.Interfaces.IService;
using SportZone.Domain.Exceptions;

using AutoMapper;
using SportZone.Domain.Entities;

namespace SportZone.Application.Services;

public class FeatureService(IUnitOfWork uow, IMapper mapper) : IFeatureService
{
    public async Task<IEnumerable<FeatureDto>> GetAllAsync()
    {
        var features = await uow.FeatureRepository.GetAllAsync();
        return mapper.Map<IEnumerable<FeatureDto>>(features);
    }

    public async Task AddAsync(FeatureDto featureDto)
    {
        var entity = mapper.Map<Feature>(featureDto);
        await uow.FeatureRepository.AddAsync(entity);
        await uow.Complete();
    }
   

  
}