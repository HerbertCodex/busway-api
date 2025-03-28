/** @format */

import * as p from 'drizzle-orm/pg-core';

export const countriesTable = p.pgTable('countries', {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().unique().notNull(),
  code: p.varchar({ length: 3 }).unique().notNull(),
  created_at: p.timestamp().notNull().defaultNow(),
  updated_at: p.timestamp().notNull().defaultNow(),
});

export const citiesTable = p.pgTable('cities', {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().unique().notNull(),
  code: p.varchar({ length: 3 }).unique().notNull(),
  country_id: p
    .uuid()
    .notNull()
    .references(() => countriesTable.id),
  created_at: p.timestamp().notNull().defaultNow(),
  updated_at: p.timestamp().notNull().defaultNow(),
});

export const communesTable = p.pgTable('communes', {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().unique().notNull(),
  code: p.varchar({ length: 3 }).unique().notNull(),
  city_id: p
    .uuid()
    .notNull()
    .references(() => citiesTable.id),
  created_at: p.timestamp().notNull().defaultNow(),
  updated_at: p.timestamp().notNull().defaultNow(),
});

export const transportCompaniesTable = p.pgTable('transport_companies', {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().unique().notNull(),
  country_id: p
    .uuid()
    .notNull()
    .references(() => countriesTable.id),
  created_at: p.timestamp().notNull().defaultNow(),
  updated_at: p.timestamp().notNull().defaultNow(),
});

export const transportTypesTable = p.pgTable('transport_types', {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().unique().notNull(),
  company_id: p
    .uuid()
    .notNull()
    .references(() => transportCompaniesTable.id),
  mode_id: p
    .uuid()
    .notNull()
    .references(() => modes.id),

  created_at: p.timestamp().notNull().defaultNow(),
  updated_at: p.timestamp().notNull().defaultNow(),
});

export const modes = p.pgTable('modes', {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().unique().notNull(),
  description: p.text(),
  created_at: p.timestamp().notNull().defaultNow(),
  updated_at: p.timestamp().notNull().defaultNow(),
});

export const dataMetadataTable = p.pgTable('data_metadata', {
  id: p.text().primaryKey(),
  last_version: p.integer().notNull().default(1),
  last_updated_at: p.timestamp().notNull().defaultNow(),
});

export const transportLinesTable = p.pgTable(
  'transport_lines',
  {
    id: p.uuid().primaryKey().defaultRandom(),
    name: p.text(),
    line: p.text().notNull(),
    line_number: p.text(),
    opening_hours: p.text(),
    mode_id: p
      .uuid()
      .notNull()
      .references(() => modes.id),
    company_id: p
      .uuid()
      .notNull()
      .references(() => transportCompaniesTable.id),
    type_id: p
      .uuid()
      .notNull()
      .references(() => transportTypesTable.id),
    city_id: p
      .uuid()
      .notNull()
      .references(() => citiesTable.id),
    start_commune_id: p
      .uuid()
      .notNull()
      .references(() => communesTable.id),
    end_commune_id: p
      .uuid()
      .notNull()
      .references(() => communesTable.id),

    geometry_type: p.text().notNull(),
    geometry_coordinates: p.json().notNull(),

    data_version: p.integer().notNull().default(1),
    synced_at: p.timestamp().notNull().defaultNow(),

    metadata_id: p
      .text()
      .notNull()
      .references(() => dataMetadataTable.id),

    created_at: p.timestamp().notNull().defaultNow(),
    updated_at: p.timestamp().notNull().defaultNow(),
  },
  t => [
    p.index('idx_transport_lines_data_version').on(t.data_version),
    p.index('idx_transport_lines_synced_at').on(t.synced_at),
  ],
);
