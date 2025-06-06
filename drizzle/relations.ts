/** @format */

import { relations } from 'drizzle-orm';
import {
  citiesTable,
  communesTable,
  countriesTable,
  metadataTable,
  modesTable,
  transportCompaniesTable,
  transportLinesTable,
  transportLineVersionsTable,
  transportTypesTable,
} from './schema';

export const countriesRelations = relations(countriesTable, ({ many }) => ({
  cities: many(citiesTable),
  transportCompanies: many(transportCompaniesTable),
}));

export const modesRelations = relations(modesTable, ({ many }) => ({
  transportTypes: many(transportTypesTable),
}));

export const communesRelations = relations(communesTable, ({ one, many }) => ({
  city: one(citiesTable, {
    fields: [communesTable.city_id],
    references: [citiesTable.id],
  }),
  startLines: many(transportLinesTable, { relationName: 'start_commune' }),
  endLines: many(transportLinesTable, { relationName: 'end_commune' }),
}));

export const citiesRelations = relations(citiesTable, ({ one, many }) => ({
  country: one(countriesTable, {
    fields: [citiesTable.country_id],
    references: [countriesTable.id],
  }),
  transportLines: many(transportLinesTable),
  communes: many(communesTable),
}));

export const transportCompaniesRelations = relations(
  transportCompaniesTable,
  ({ one, many }) => ({
    country: one(countriesTable, {
      fields: [transportCompaniesTable.country_id],
      references: [countriesTable.id],
    }),
    transportLines: many(transportLinesTable),
  }),
);

export const transportTypesRelations = relations(
  transportTypesTable,
  ({ one, many }) => ({
    company: one(transportCompaniesTable, {
      fields: [transportTypesTable.company_id],
      references: [transportCompaniesTable.id],
    }),
    mode: one(modesTable, {
      fields: [transportTypesTable.mode_id],
      references: [modesTable.id],
    }),
    transportLines: many(transportLinesTable),
  }),
);

/**
 * Defines the relations for the `transportLinesTable` entity.
 *
 * - `company`: References the transport company associated with the line.
 * - `type`: References the type of transport (e.g., bus, tram).
 * - `city`: References the city where the transport line operates.
 * - `start_commune`: References the starting commune of the transport line.
 * - `end_commune`: References the ending commune of the transport line.
 * - `metadata`: References additional metadata associated with the transport line.
 * - `versions`: References all versions of the transport line.
 *
 * This configuration is used by Drizzle ORM to establish foreign key relationships
 * and enable eager loading of related entities.
 */
export const transportLinesRelations = relations(
  transportLinesTable,
  ({ one, many }) => ({
    company: one(transportCompaniesTable, {
      fields: [transportLinesTable.company_id],
      references: [transportCompaniesTable.id],
    }),
    type: one(transportTypesTable, {
      fields: [transportLinesTable.transport_type_id],
      references: [transportTypesTable.id],
    }),
    city: one(citiesTable, {
      fields: [transportLinesTable.city_id],
      references: [citiesTable.id],
    }),
    start_commune: one(communesTable, {
      fields: [transportLinesTable.start_commune_id],
      references: [communesTable.id],
      relationName: 'start_commune',
    }),
    end_commune: one(communesTable, {
      fields: [transportLinesTable.end_commune_id],
      references: [communesTable.id],
      relationName: 'end_commune',
    }),
    metadata: one(metadataTable, {
      fields: [transportLinesTable.metadata_id],
      references: [metadataTable.id],
    }),
    versions: many(transportLineVersionsTable),
  }),
);

export const transportLineVersionsRelations = relations(
  transportLineVersionsTable,
  ({ one }) => ({
    transport_line: one(transportLinesTable, {
      fields: [transportLineVersionsTable.transport_line_id],
      references: [transportLinesTable.id],
    }),
  }),
);
