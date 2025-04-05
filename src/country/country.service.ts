/** @format */

import { APIError, ErrCode } from 'encore.dev/api';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { Country } from './country.model';
import { PGCountryRepository } from './country.repository';

const countryRepository = new PGCountryRepository();

const CountryService = {
  async getAllCountries(
    options: PaginationOptions,
  ): Promise<PaginationResponse<Country>> {
    try {
      return await countryRepository.getAllCountries(options);
    } catch (error) {
      if (error instanceof APIError) {
        throw new APIError(
          ErrCode.Unavailable,
          'Le service de base de données est indisponible.',
        );
      }
      throw error;
    }
  },

  async getCountryBySlug(slug: string): Promise<Country> {
    try {
      return await countryRepository.getCountryBySlug(slug);
    } catch (error) {
      if (error instanceof APIError) {
        throw new APIError(
          ErrCode.Unavailable,
          'Le service de base de données est indisponible.',
        );
      }
      throw error;
    }
  },
};

export default CountryService;
