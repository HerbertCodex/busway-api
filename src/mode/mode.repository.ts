/** @format */

import { count, eq } from 'drizzle-orm';
import { APIError, ErrCode } from 'encore.dev/api';
import log from 'encore.dev/log';
import { orm } from '../../database';
import { modesTable } from '../../drizzle/schema';
import { paginate } from '../common/pagination/helpers';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { Mode } from './mode.model';

export interface IModeRepository {
  getAllModes(options: PaginationOptions): Promise<PaginationResponse<Mode>>;
  getModeBySlug(slug: string): Promise<Mode>;
}
export class PGModeRepository implements IModeRepository {
  async getAllModes(
    options: PaginationOptions,
  ): Promise<PaginationResponse<Mode>> {
    try {
      return await paginate<Mode>(
        async ({ limit, offset }) => {
          const rows = await orm
            .select()
            .from(modesTable)
            .orderBy(modesTable.slug)
            .limit(limit)
            .offset(offset);
          const modes = rows.map(Mode.fromDb);
          return modes;
        },
        async () => {
          const [row] = await orm.select({ count: count() }).from(modesTable);
          return row.count;
        },
        options,
      );
    } catch (error) {
      log.error('Error paginating modes:', { options, error });
      throw new APIError(ErrCode.Internal, 'Failed to fetch paginated modes');
    }
  }

  async getModeBySlug(slug: string): Promise<Mode> {
    try {
      const [mode] = await orm
        .select()
        .from(modesTable)
        .where(eq(modesTable.slug, slug))
        .limit(1);

      if (!mode) {
        throw new APIError(
          ErrCode.NotFound,
          `Mode with slug '${slug}' not found`,
        );
      }

      return Mode.fromDb(mode);
    } catch (error) {
      log.error('Error fetching mode by slug:', { slug, error });
      throw new APIError(
        ErrCode.Internal,
        `Failed to fetch mode with slug '${slug}'`,
      );
    }
  }
}
