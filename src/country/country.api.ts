/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { mapCountryToDTO, paginateCountriesToDTO } from './country.mapper';
import { CountryDTO, CountryRow } from './country.model';
import CountryService from './country.service';

export const getCountries = api(
  {
    method: 'GET',
    path: '/countries',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<CountryDTO>> => {
    const paginatedEntities: PaginationResponse<CountryRow> =
      await CountryService.getAllCountries(params);
    return paginateCountriesToDTO(paginatedEntities);
  },
);

export const getCountryBySlug = api(
  {
    method: 'GET',
    path: '/countries/:slug',
  },
  async (params: { slug: string }): Promise<CountryDTO> => {
    const countryEntity: CountryRow = await CountryService.getCountryBySlug(
      params.slug,
    );
    return mapCountryToDTO(countryEntity);
  },
);
