/** @format */

import * as p from 'drizzle-orm/pg-core';

export const countriesTable = p.pgTable('countries', {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().unique().notNull(),
  created_at: p.timestamp().defaultNow(),
  updated_at: p.timestamp(),
});

export const citiesTable = p.pgTable('cities', {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().unique().notNull(),
  country_id: p
    .uuid()
    .notNull()
    .references(() => countriesTable.id),
  created_at: p.timestamp().defaultNow(),
  updated_at: p.timestamp(),
});

export const transportCompaniesTable = p.pgTable('transport_companies', {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().unique().notNull(),
  country_id: p
    .uuid()
    .notNull()
    .references(() => countriesTable.id),
  created_at: p.timestamp().defaultNow(),
  updated_at: p.timestamp(),
});

export const transportTypesTable = p.pgTable('transport_types', {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().unique().notNull(),
  created_at: p.timestamp().defaultNow(),
  updated_at: p.timestamp(),
});

export const modes = p.pgTable('modes', {
  id: p.uuid().primaryKey().defaultRandom(),
  name: p.text().unique().notNull(),
  descritiption: p.text(),
  created_at: p.timestamp().defaultNow(),
  updated_at: p.timestamp(),
});

export const transportLinesTable = p.pgTable('transport_lines', {
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

  geometry_type: p.text().notNull(),
  geometry_coordinates: p.json().notNull(),

  created_at: p.timestamp().defaultNow(),
  updated_at: p.timestamp(),
});
