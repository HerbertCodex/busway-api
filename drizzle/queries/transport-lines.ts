/** @format */

import { and, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { orm } from '../../database';
import { communesTable, transportLinesTable } from '../schema';

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

export async function getTransportLinesBetween(from: string, to: string) {
  const start = alias(communesTable, 'start');
  const end = alias(communesTable, 'end');

  return await orm
    .select({
      line: transportLinesTable,
      start,
      end,
    })
    .from(transportLinesTable)
    .innerJoin(start, eq(transportLinesTable.start_commune_id, start.id))
    .innerJoin(end, eq(transportLinesTable.end_commune_id, end.id))
    .where(and(eq(start.name, from), eq(end.name, to)));
}
