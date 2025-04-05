/** @format */

import { api } from 'encore.dev/api';
import { PaginationResponse } from '../common/pagination/types';
import { CountryRow } from './country.model';
import CountryService from './country.service';

export const getCountries = api(
  {
    method: 'GET',
    path: '/countries',
  },
  async (params: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<CountryRow>> => {
    const countries = await CountryService.getAllCountries(params);
    return countries;
  },
);

export const getCountryBySlug = api(
  {
    method: 'GET',
    path: '/countries/:slug',
  },
  async (params: { slug: string }): Promise<CountryRow> => {
    const country = await CountryService.getCountryBySlug(params.slug);
    return country;
  },
);
