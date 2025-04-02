/** @format */

import { eq } from 'drizzle-orm';
import { orm } from '../database';
import { transportLinesTable } from '../drizzle/schema';
import { TransportGeometry, TransportLine } from './transport-lines.model';

export interface ITransportLineRepository {
  createTransportLine(
    line: Omit<
      TransportLine,
      'id' | 'created_at' | 'updated_at' | 'synced_at' | 'data_version'
    >,
  ): Promise<TransportLine>;

  findTransportLineById(id: string): Promise<TransportLine>;
}

export class PGTransportLineRepository implements ITransportLineRepository {
  async createTransportLine(
    transportLine: Omit<
      TransportLine,
      'id' | 'created_at' | 'updated_at' | 'synced_at' | 'data_version'
    >,
  ): Promise<TransportLine> {
    const [insertedLine] = await orm
      .insert(transportLinesTable)
      .values({
        slug: transportLine.slug,
        line: transportLine.line,
        line_number: transportLine.line_number,
        opening_hours: transportLine.opening_hours,
        company_id: transportLine.company_id,
        transport_type_id: transportLine.transport_type_id,
        city_id: transportLine.city_id,
        start_commune_id: transportLine.start_commune_id,
        end_commune_id: transportLine.end_commune_id,
        geometry: transportLine.geometry,
        metadata_id: transportLine.metadata_id,
      })
      .returning();

    if (!insertedLine) {
      throw new Error("Échec de l'insertion de la ligne de transport");
    }

    return new TransportLine(
      insertedLine.id,
      insertedLine.line,
      insertedLine.slug,
      insertedLine.line_number,
      insertedLine.opening_hours,
      insertedLine.company_id,
      insertedLine.transport_type_id,
      insertedLine.city_id,
      insertedLine.start_commune_id,
      insertedLine.end_commune_id,
      insertedLine.geometry as TransportGeometry,
      insertedLine.data_version,
      insertedLine.synced_at,
      insertedLine.metadata_id,
      insertedLine.created_at,
      insertedLine.updated_at,
    );
  }

  async findTransportLineById(id: string): Promise<TransportLine> {
    const findTransportLineById = await orm.query.transportLinesTable.findFirst(
      {
        where: eq(transportLinesTable.id, id),
      },
    );
    if (!findTransportLineById) {
      throw new Error('Transport line not found or ID is missing');
    }

    return new TransportLine(
      findTransportLineById.id,
      findTransportLineById.line,
      findTransportLineById.slug,
      findTransportLineById.line_number,
      findTransportLineById.opening_hours,
      findTransportLineById.company_id,
      findTransportLineById.transport_type_id,
      findTransportLineById.city_id,
      findTransportLineById.start_commune_id,
      findTransportLineById.end_commune_id,
      findTransportLineById.geometry as TransportGeometry,
      findTransportLineById.data_version,
      findTransportLineById.synced_at,
      findTransportLineById.metadata_id,
      findTransportLineById.created_at,
      findTransportLineById.updated_at,
    );
  }
}
