/** @format */

import { and, eq, ilike } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { orm } from '../../database';
import { TransportLineResult } from '../../transport-ingest/transport-ingest.type';
import { communesTable, transportLinesTable } from '../schema';

type GeometryCoordinates = [number, number][];

export function getAllTransportLines() {
  return orm
    .select()
    .from(transportLinesTable)
    .orderBy(transportLinesTable.name);
}

export async function getTransportLineById(id: string) {
  const result = await orm
    .select()
    .from(transportLinesTable)
    .where(eq(transportLinesTable.id, id))
    .limit(1);

  return result;
}

export async function getTransportLinesBetween(
  from: string,
  to: string,
): Promise<TransportLineResult[]> {
  const start = alias(communesTable, 'start');
  const end = alias(communesTable, 'end');

  const result = await orm
    .select({
      line: transportLinesTable,
      start: {
        id: start.id,
        name: start.name,
        code: start.code,
        city_id: start.city_id,
        created_at: start.created_at,
        updated_at: start.updated_at,
      },
      end: {
        id: end.id,
        name: end.name,
        code: end.code,
        city_id: end.city_id,
        created_at: end.created_at,
        updated_at: end.updated_at,
      },
    })
    .from(transportLinesTable)
    .innerJoin(start, eq(transportLinesTable.start_commune_id, start.id))
    .innerJoin(end, eq(transportLinesTable.end_commune_id, end.id))
    .where(
      and(
        ilike(start.name, `%${from.trim()}%`),
        ilike(end.name, `%${to.trim()}%`),
      ),
    );

  return result.map(item => ({
    ...item,
    line: {
      ...item.line,
      geometry_coordinates: item.line
        .geometry_coordinates as GeometryCoordinates,
    },
  }));
}
