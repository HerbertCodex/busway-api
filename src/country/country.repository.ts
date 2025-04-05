/** @format */

import { count, eq } from 'drizzle-orm';
import { APIError, ErrCode } from 'encore.dev/api';
import log from 'encore.dev/log';
import { orm } from '../../database';
import { countriesTable } from '../../drizzle/schema';
import { paginate } from '../common/pagination/helpers';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { Country } from './country.model';

export interface ICountryRepository {
  getAllCountries(
    options: PaginationOptions,
  ): Promise<PaginationResponse<Country>>;
  getCountryBySlug(slug: string): Promise<Country>;
}

export class PGCountryRepository implements ICountryRepository {
  async getAllCountries(
    options: PaginationOptions,
  ): Promise<PaginationResponse<Country>> {
    try {
      return await paginate<Country>(
        async ({ limit, offset }) => {
          const rows = await orm
            .select()
            .from(countriesTable)
            .orderBy(countriesTable.slug)
            .limit(limit)
            .offset(offset);
          return rows.map(Country.fromDb);
        },
        async () => {
          const [row] = await orm
            .select({ count: count() })
            .from(countriesTable);
          return row.count;
        },
        options,
      );
    } catch (error) {
      log.error('Error paginating countries:', { options, error });
      throw new APIError(
        ErrCode.Internal,
        'Failed to fetch paginated countries',
      );
    }
  }
  async getCountryBySlug(slug: string): Promise<Country> {
    try {
      const [country] = await orm
        .select()
        .from(countriesTable)
        .where(eq(countriesTable.slug, slug))
        .limit(1);
      if (!country) {
        throw new APIError(
          ErrCode.NotFound,
          `Country with slug '${slug}' not found`,
        );
      }
      return Country.fromDb(country);
    } catch (error) {
      if (error instanceof APIError && error.code === ErrCode.NotFound) {
        throw error;
      }
      log.error('Error fetching country by slug:', { slug, error });
      throw new APIError(
        ErrCode.Internal,
        `Failed to fetch country with slug '${slug}'`,
      );
    }
  }
}
