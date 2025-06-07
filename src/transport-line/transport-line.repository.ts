/** @format */

import { count } from 'drizzle-orm';
import { APIError, ErrCode } from 'encore.dev/api';
import log from 'encore.dev/log';
import { orm } from '../../database';
import { transportLinesTable } from '../../drizzle/schema';
import { paginate } from '../common/pagination/helpers';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { TransportLine, TransportLineRow } from './transport-line.model';

export interface ITransportLineRepository {
  getAllTransportLines(
    options: PaginationOptions,
  ): Promise<PaginationResponse<TransportLine>>;
}

export class PGTransportLineRepository implements ITransportLineRepository {
  async getAllTransportLines(
    options: PaginationOptions,
  ): Promise<PaginationResponse<TransportLine>> {
    try {
      return await paginate<TransportLine>(
        async ({ limit, offset }) => {
          const rows: TransportLineRow[] = await orm
            .select()
            .from(transportLinesTable)
            .orderBy(transportLinesTable.slug)
            .limit(limit)
            .offset(offset);

          return rows.map(TransportLine.fromDb);
        },
        async () => {
          const [{ count: total }] = await orm
            .select({ count: count() })
            .from(transportLinesTable);
          return total;
        },
        options,
      );
    } catch (error) {
      log.error('Error paginating transport lines:', {
        options,
        error,
      });
      throw new APIError(
        ErrCode.Internal,
        'Failed to fetch paginated transport lines',
      );
    }
  }
}
