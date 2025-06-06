/** @format */

import { count } from 'drizzle-orm';
import { APIError, ErrCode } from 'encore.dev/api';
import log from 'encore.dev/log';
import { orm } from '../../database';
import { metadataTable } from '../../drizzle/schema';
import { paginate } from '../common/pagination/helpers';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { Metadata, MetadataRow } from './metadata.model';

export interface IMetadataRepository {
  getAllMetadata(
    options: PaginationOptions,
  ): Promise<PaginationResponse<Metadata>>;
}

export class PGMetadataRepository implements IMetadataRepository {
  async getAllMetadata(
    options: PaginationOptions,
  ): Promise<PaginationResponse<Metadata>> {
    try {
      return await paginate<Metadata>(
        async ({ limit, offset }) => {
          const rows: MetadataRow[] = await orm
            .select()
            .from(metadataTable)
            .orderBy(metadataTable.last_updated_at)
            .limit(limit)
            .offset(offset);
          return rows.map(Metadata.fromDb);
        },
        async () => {
          const [{ count: total }] = await orm
            .select({ count: count() })
            .from(metadataTable);
          return total;
        },
        options,
      );
    } catch (error) {
      log.error('Error fetching metadata:', { options, error });
      throw new APIError(ErrCode.Internal, 'Failed to fetch metadata');
    }
  }
}
