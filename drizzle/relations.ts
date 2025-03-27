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
  transportLines: many(transportLinesTable),
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
    mode: one(modes, {
      fields: [transportTypesTable.mode_id],
      references: [modes.id],
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
      fields: [transportLinesTable.type_id],
      references: [transportTypesTable.id],
    }),
    city: one(citiesTable, {
      fields: [transportLinesTable.city_id],
      references: [citiesTable.id],
    }),
    mode: one(modes, {
      fields: [transportLinesTable.mode_id],
      references: [modes.id],
    }),
    commune: one(communesTable, {
      fields: [transportLinesTable.commune_id],
      references: [communesTable.id],
    }),
    metadata: one(dataMetadataTable, {
      fields: [transportLinesTable.metadata_id],
      references: [dataMetadataTable.id],
    }),
  }),
);
