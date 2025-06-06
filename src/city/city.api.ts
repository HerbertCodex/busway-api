/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { mapCityToDTO, paginateCitiesToDTO } from './city.mapper';
import { City, CityDTO } from './city.model';
import CityService from './city.service';

export const getCities = api(
  {
    method: 'GET',
    path: '/cities',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<CityDTO>> => {
    const paginatedCities: PaginationResponse<City> =
      await CityService.getAllCities(params);
    return paginateCitiesToDTO(paginatedCities);
  },
);

export const getCityBySlug = api(
  {
    method: 'GET',
    path: '/cities/:slug',
  },
  async (params: { slug: string }): Promise<CityDTO> => {
    const city: City = await CityService.getCityBySlug(params.slug);
    return mapCityToDTO(city);
  },
);
