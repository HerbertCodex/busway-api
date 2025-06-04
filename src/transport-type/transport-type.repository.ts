/** @format */

import { count } from 'drizzle-orm';
import { APIError, ErrCode } from 'encore.dev/api';
import log from 'encore.dev/log';
import { orm } from '../../database';
import { transportTypesTable } from '../../drizzle/schema';
import { paginate } from '../common/pagination/helpers';
import {
  PaginationOptions,
  PaginationResponse,
} from '../common/pagination/types';
import { TransportType } from './transport-type.model';

export interface ITransportTypeRepository {
  getAllTransportTypes(
    options: PaginationOptions,
  ): Promise<PaginationResponse<TransportType>>;
}

export class PGTransportTypeRepository implements ITransportTypeRepository {
  async getAllTransportTypes(
    options: PaginationOptions,
  ): Promise<PaginationResponse<TransportType>> {
    try {
      return await paginate<TransportType>(
        async ({ limit, offset }) => {
          const rows = await orm
            .select()
            .from(transportTypesTable)
            .orderBy(transportTypesTable.slug)
            .limit(limit)
            .offset(offset);
          return rows.map(TransportType.fromDb);
        },
        async () => {
          const [row] = await orm
            .select({ count: count() })
            .from(transportTypesTable);
          return row.count;
        },
        options,
      );
    } catch (error) {
      log.error('Error paginating transport types:', { options, error });
      throw new APIError(
        ErrCode.Internal,
        'Failed to fetch paginated transport types',
      );
    }
  }
}
