/** @format */

import { count, eq } from 'drizzle-orm';
import { APIError, ErrCode } from 'encore.dev/api';
import log from 'encore.dev/log';
import { orm } from '../../database';
import { transportCompaniesTable } from '../../drizzle/schema';
import { paginate } from '../common/pagination/helpers';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { TransportCompany } from './transport-company.model';

export interface ITransportCompanyRepository {
  getAllTransportCompanies(
    options: PaginationOptions,
  ): Promise<PaginationResponse<TransportCompany>>;

  getTransportCompanyBySlug(slug: string): Promise<TransportCompany>;
}

export class PGTransportCompanyRepository
  implements ITransportCompanyRepository
{
  async getAllTransportCompanies(
    options: PaginationOptions,
  ): Promise<PaginationResponse<TransportCompany>> {
    try {
      return await paginate<TransportCompany>(
        async ({ limit, offset }) => {
          const rows = await orm
            .select()
            .from(transportCompaniesTable)
            .orderBy(transportCompaniesTable.slug)
            .limit(limit)
            .offset(offset);
          return rows.map(TransportCompany.fromDb);
        },
        async () => {
          const [row] = await orm
            .select({ count: count() })
            .from(transportCompaniesTable);
          return row.count;
        },
        options,
      );
    } catch (error) {
      log.error('Error paginating transport companies:', { options, error });
      throw new APIError(
        ErrCode.Internal,
        'Failed to fetch paginated transport companies',
      );
    }
  }

  async getTransportCompanyBySlug(slug: string): Promise<TransportCompany> {
    try {
      const [transportCompany] = await orm
        .select()
        .from(transportCompaniesTable)
        .where(eq(transportCompaniesTable.slug, slug))
        .limit(1);

      if (!transportCompany) {
        throw new APIError(
          ErrCode.NotFound,
          `Transport company with slug '${slug}' not found`,
        );
      }

      return TransportCompany.fromDb(transportCompany);
    } catch (error) {
      if (error instanceof APIError && error.code === ErrCode.NotFound) {
        throw error;
      }
      log.error('Error fetching transport company by slug:', { slug, error });
      throw new APIError(
        ErrCode.Internal,
        `Failed to fetch transport company with slug '${slug}'`,
      );
    }
  }
}
