/** @format */

import { and, eq, ilike } from 'drizzle-orm';
import { normalizeText } from '../common/normalizeText';
import { orm } from '../database';
import {
  citiesTable,
  communesTable,
  transportTypesTable,
} from '../drizzle/schema';

/**
 * Recherche insensible à la casse dans une table contenant un champ "name"
 */
export async function getByNameInsensitive(
  query: any,
  nameColumn: any,
  name: string,
): Promise<string | undefined> {
  const result = await query.findFirst({
    where: ilike(nameColumn, name.toLowerCase()),
  });

  return result?.id;
}

/**
 * Recherche de l'ID d'une ville par nom (insensible à la casse)
 */
export async function getCityIdByName(
  name: string,
): Promise<string | undefined> {
  const city = await orm.query.citiesTable.findFirst({
    where: ilike(citiesTable.name, name.toLowerCase()),
  });
  return city?.id;
}

/**
 * Nouvelle version : détection d'une commune si son nom est contenu dans le label
 * Exemple : "Gare SOTRA Abobo Sogefiha" → trouve "abobo"
 */
export async function findCommuneByExactNormalizedName(label: string) {
  const normalizedLabel = normalizeText(label);
  const allCommunes = await orm.select().from(communesTable);

  return (
    allCommunes.find(
      commune => normalizeText(commune.name) === normalizedLabel,
    ) ?? null
  );
}

export async function findCommuneByContainedName(label: string) {
  const normalizedLabel = normalizeText(label);
  const allCommunes = await orm.select().from(communesTable);

  const match = allCommunes.find(commune =>
    normalizedLabel.includes(normalizeText(commune.name)),
  );

  return match ?? null;
}

/**
 * Recherche d'un transport type par nom + company_id + mode_id
 */
export async function getTransportTypeId(
  name: string,
  companyId: string,
  modeId: string,
): Promise<string | undefined> {
  const result = await orm.query.transportTypesTable.findFirst({
    where: and(
      ilike(transportTypesTable.name, name.toLowerCase()),
      eq(transportTypesTable.company_id, companyId),
      eq(transportTypesTable.mode_id, modeId),
    ),
  });
  return result?.id;
}

/**
 * Insert avec sécurité (ignore conflit)
 */
export async function safeInsert<T extends Record<string, any>>(
  table: any,
  values: T,
): Promise<T | undefined> {
  const result = await orm
    .insert(table)
    .values(values)
    .onConflictDoNothing()
    .returning();

  if (Array.isArray(result) && result.length > 0) {
    return result[0];
  }

  return undefined;
}

export async function safeInsertMany<T extends Record<string, any>>(
  table: any,
  values: T[],
): Promise<T[]> {
  const result = await orm
    .insert(table)
    .values(values)
    .onConflictDoNothing()
    .returning();

  return Array.isArray(result) ? result : [];
}
