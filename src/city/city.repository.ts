/** @format */

import { eq, sql } from 'drizzle-orm';
import { APIError, ErrCode } from 'encore.dev/api';
import log from 'encore.dev/log';
import { orm } from '../../database';
import { citiesTable } from '../../drizzle/schema';
import { paginate } from '../common/pagination/helpers';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { City } from './city.model';

export interface ICityRepository {
  getAllCities(options: PaginationOptions): Promise<PaginationResponse<City>>;
  getCityBySlug(slug: string): Promise<City>;
}

export class PGCityRepository implements ICityRepository {
  async getAllCities(
    options: PaginationOptions,
  ): Promise<PaginationResponse<City>> {
    try {
      return await paginate<City>(
        async ({ limit, offset }) => {
          const rows = await orm
            .select()
            .from(citiesTable)
            .orderBy(citiesTable.slug)
            .limit(limit)
            .offset(offset);
          return rows.map(City.fromDb);
        },
        async () => {
          const [row] = await orm
            .select({ count: sql<number>`cast(count(*) as integer)` })
            .from(citiesTable);
          return row.count;
        },
        options,
      );
    } catch (error) {
      log.error('Error paginating cities:', error);
      throw new APIError(ErrCode.Internal, 'Failed to fetch paginated cities');
    }
  }

  async getCityBySlug(slug: string): Promise<City> {
    try {
      const [city] = await orm
        .select()
        .from(citiesTable)
        .where(eq(citiesTable.slug, slug))
        .limit(1);
      if (!city) {
        throw new APIError(
          ErrCode.NotFound,
          `City with slug '${slug}' not found`,
        );
      }
      return City.fromDb(city);
    } catch (error) {
      log.error('Error fetching city by slug:', error);
      throw new APIError(ErrCode.Internal, 'Failed to fetch city by slug');
    }
  }
}
