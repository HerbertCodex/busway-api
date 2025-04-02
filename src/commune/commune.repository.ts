/** @format */

import { eq } from 'drizzle-orm';
import { APIError, ErrCode } from 'encore.dev/api';
import log from 'encore.dev/log';
import { orm } from '../../database';
import { communesTable } from '../../drizzle/schema';
import { Commune } from './commune.model';

export interface ICommuneRepository {
  getAllCommunes(): Promise<Commune[]>;
  getCommuneBySlug(slug: string): Promise<Commune>;
}

export class PGCommuneRepository implements ICommuneRepository {
  async getAllCommunes(): Promise<Commune[]> {
    throw new Error('Method not implemented.');
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
