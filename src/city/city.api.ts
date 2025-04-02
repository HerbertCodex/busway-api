/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { CityRow } from './city.model';
import { PGCityRepository } from './city.repository';

export const getApi = api(
  {
    method: 'GET',
    path: '/cities',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<CityRow>> => {
    const repo = new PGCityRepository();
    return repo.getAllCities({
      page: params.page,
      pageSize: params.pageSize,
    });
  },
);
