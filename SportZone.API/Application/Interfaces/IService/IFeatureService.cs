using System;
using SportZone.Application.Dtos;

namespace SportZone.Application.Interfaces.IService;

public interface IFeatureService
{
    Task<IEnumerable<FeatureDto>> GetAllAsync();
    Task AddAsync(FeatureDto featureDto);
}