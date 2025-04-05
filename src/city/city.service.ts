/** @format */

import { APIError, ErrCode } from 'encore.dev/api';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { City } from './city.model';
import { PGCityRepository } from './city.repository';

const cityRepository = new PGCityRepository();

const CityService = {
  async getAllCities(
    options: PaginationOptions,
  ): Promise<PaginationResponse<City>> {
    try {
      return await cityRepository.getAllCities(options);
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

  async getCityBySlug(slug: string): Promise<City> {
    try {
      return await cityRepository.getCityBySlug(slug);
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

export default CityService;
