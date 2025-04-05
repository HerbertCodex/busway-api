/** @format */

import { count, eq } from 'drizzle-orm';
import { APIError, ErrCode } from 'encore.dev/api';
import log from 'encore.dev/log';
import { orm } from '../../database';
import { communesTable } from '../../drizzle/schema';
import { paginate } from '../common/pagination/helpers';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { Commune } from './commune.model';

export interface ICommuneRepository {
  getAllCommunes(
    options: PaginationOptions,
  ): Promise<PaginationResponse<Commune>>;
  getCommuneBySlug(slug: string): Promise<Commune>;
}

export class PGCommuneRepository implements ICommuneRepository {
  async getAllCommunes(
    options: PaginationOptions,
  ): Promise<PaginationResponse<Commune>> {
    try {
      return await paginate<Commune>(
        async ({ limit, offset }) => {
          const rows = await orm
            .select()
            .from(communesTable)
            .orderBy(communesTable.slug)
            .limit(limit)
            .offset(offset);
          return rows.map(Commune.fromDb);
        },
        async () => {
          const [row] = await orm
            .select({ count: count() })
            .from(communesTable);
          return row.count;
        },
        options,
      );
    } catch (error) {
      log.error('Error paginating communes:', { options, error });
      throw new APIError(
        ErrCode.Internal,
        'Failed to fetch paginated communes',
      );
    }
  }

  async getCommuneBySlug(slug: string): Promise<Commune> {
    try {
      const [commune] = await orm
        .select()
        .from(communesTable)
        .where(eq(communesTable.slug, slug))
        .limit(1);

      if (!commune) {
        throw new APIError(
          ErrCode.NotFound,
          `Commune with slug '${slug}' not found`,
        );
      }

      return Commune.fromDb(commune);
    } catch (error) {
      log.error('Error fetching commune by slug:', error);
      throw new APIError(ErrCode.Internal, 'Failed to fetch commune by slug');
    }
  }
}
