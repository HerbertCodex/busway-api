/** @format */

import { relations } from 'drizzle-orm';
import {
  citiesTable,
  communesTable,
  countriesTable,
  dataMetadataTable,
  modes,
  transportCompaniesTable,
  transportLinesTable,
  transportTypesTable,
} from './schema';

export const countriesRelations = relations(countriesTable, ({ many }) => ({
  cities: many(citiesTable),
  transportCompanies: many(transportCompaniesTable),
}));

export const modesRelations = relations(modes, ({ many }) => ({
  transportLines: many(transportLinesTable),
}));

export const communesRelations = relations(communesTable, ({ one, many }) => ({
  city: one(citiesTable, {
    fields: [communesTable.city_id],
    references: [citiesTable.id],
  }),
  startLines: many(transportLinesTable, {
    relationName: 'start_commune',
  }),
  endLines: many(transportLinesTable, {
    relationName: 'end_commune',
  }),
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
    transportLines: many(transportLinesTable),
  }),
);

export const transportLinesRelations = relations(
  transportLinesTable,
  ({ one }) => ({
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
    metadata: one(dataMetadataTable, {
      fields: [transportLinesTable.metadata_id],
      references: [dataMetadataTable.id],
    }),
  }),
);
