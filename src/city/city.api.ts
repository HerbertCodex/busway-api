/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { CityRow } from './city.model';
import CityService from './city.service';

export const getCities = api(
  {
    method: 'GET',
    path: '/cities',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<CityRow>> => {
    const cities = await CityService.getAllCities(params);
    return cities;
  },
);

export const getCityBySlug = api(
  {
    method: 'GET',
    path: '/cities/:slug',
  },
  async (params: { slug: string }): Promise<CityRow> => {
    const city = await CityService.getCityBySlug(params.slug);
    return city;
  },
);
