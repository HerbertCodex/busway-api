/** @format */

import { sql } from 'drizzle-orm';
import { drizzleDb } from '../drizzle/orm';

await drizzleDb.execute(sql`DROP TABLE IF EXISTS transportLinesTable CASCADE`);
await drizzleDb.execute(sql`DROP TABLE IF EXISTS transportTypesTable CASCADE`);
await drizzleDb.execute(
  sql`DROP TABLE IF EXISTS transportCompaniesTable CASCADE`,
);
await drizzleDb.execute(sql`DROP TABLE IF EXISTS communesTable CASCADE`);
await drizzleDb.execute(sql`DROP TABLE IF EXISTS citiesTable CASCADE`);
await drizzleDb.execute(sql`DROP TABLE IF EXISTS modes CASCADE`);
await drizzleDb.execute(sql`DROP TABLE IF EXISTS countriesTable CASCADE`);
await drizzleDb.execute(sql`DROP TABLE IF EXISTS dataMetadataTable CASCADE`);
