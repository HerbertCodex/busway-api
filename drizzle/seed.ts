/** @format */

import { drizzleDb } from './orm';
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

export async function seed() {
  console.log('🚀 Début du seed');

  const [metadata] = await drizzleDb
    .insert(dataMetadataTable)
    .values({ id: 'default' })
    .onConflictDoNothing()
    .returning();

  //Insertion des pays
  const [civ] = await drizzleDb
    .insert(countriesTable)
    .values([
      {
        name: "côte d'Ivoire",
        code: 'CIV',
      },
    ])
    .onConflictDoNothing()
    .returning();

  //Insertion des villes
  const [abidjan] = await drizzleDb
    .insert(citiesTable)
    .values([
      {
        code: 'ABJ',
        name: 'abidjan',
        country_id: civ.id,
      },
    ])
    .onConflictDoNothing()
    .returning();

  // Insertion des communes de la ville d'Abidjan
  const [
    abobo,
    adjame,
    attecoube,
    cocody,
    koumassi,
    marcory,
    plateau,
    portBouet,
    treichville,
    yopougon,
  ] = await drizzleDb
    .insert(communesTable)
    .values([
      { code: 'ABO', name: 'abobo', city_id: abidjan.id },
      { code: 'ADJ', name: 'adjamé', city_id: abidjan.id },
      { code: 'ATC', name: 'attécoubé', city_id: abidjan.id },
      { code: 'COC', name: 'cocody', city_id: abidjan.id },
      { code: 'KOU', name: 'koumassi', city_id: abidjan.id },
      { code: 'MAR', name: 'marcory', city_id: abidjan.id },
      { code: 'PLT', name: 'plateau', city_id: abidjan.id },
      { code: 'PBO', name: 'port-bouet', city_id: abidjan.id },
      { code: 'TRV', name: 'treichville', city_id: abidjan.id },
      { code: 'YOP', name: 'yopougon', city_id: abidjan.id },
    ])
    .onConflictDoNothing()
    .returning();

  // Insertion des compagnies de transport
  const [sotra, stl, citrans, privateCompagny] = await drizzleDb
    .insert(transportCompaniesTable)
    .values([
      { name: 'SOTRA', country_id: civ.id },
      { name: 'STL', country_id: civ.id },
      { name: 'CITRANS', country_id: civ.id },
      { name: 'Compagnie Privée', country_id: civ.id },
    ])
    .onConflictDoNothing()
    .returning();

  // Insertion des modes de transport
  const [busMode, miniCarMode, taxiMode, ferryMode] = await drizzleDb
    .insert(modes)
    .values([
      { name: 'bus', description: 'Bus classique de transport urbain' },
      { name: 'mini-car', description: 'Mini car de transport urbain' },
      { name: 'taxi', description: 'Taxi individuel ou collectif' },
      { name: 'ferry', description: 'Bateau de transport urbain' },
    ])
    .onConflictDoNothing()
    .returning();

  // Insertion des types de transport
  const [monbus] = await drizzleDb
    .insert(transportTypesTable)
    .values([
      { name: 'monbus', company_id: sotra.id, mode_id: busMode.id },
      { name: 'express', company_id: sotra.id, mode_id: busMode.id },
      { name: 'monbato', company_id: sotra.id, mode_id: ferryMode.id },
      { name: 'aqualines', company_id: citrans.id, mode_id: ferryMode.id },
      { name: 'stl', company_id: stl.id, mode_id: ferryMode.id },
      {
        name: 'gbaka',
        company_id: privateCompagny.id,
        mode_id: miniCarMode.id,
      },
      {
        name: 'wôrô-wôrô',
        company_id: privateCompagny.id,
        mode_id: taxiMode.id,
      },
    ])
    .onConflictDoNothing()
    .returning();

  // Insertion de quelques lignes de transport exemple
  await drizzleDb.insert(transportLinesTable).values([
    {
      name: 'Ligne Abobo → Cocody',
      line: 'ABO-COC-01',
      line_number: '01',
      opening_hours: '05:00-22:00',
      mode_id: busMode.id,
      company_id: sotra.id,
      type_id: monbus.id,
      city_id: abidjan.id,
      start_commune_id: abobo.id,
      end_commune_id: cocody.id,
      geometry_type: 'MultiLineString',
      geometry_coordinates: [],
      metadata_id: metadata.id,
    },
    {
      name: 'Ligne Yopougon → Plateau',
      line: 'YOP-PLT-02',
      line_number: '02',
      opening_hours: '05:00-21:00',
      mode_id: busMode.id,
      company_id: sotra.id,
      type_id: monbus.id,
      city_id: abidjan.id,
      start_commune_id: yopougon.id,
      end_commune_id: plateau.id,
      geometry_type: 'MultiLineString',
      geometry_coordinates: [],
      metadata_id: metadata.id,
    },
  ]);
}
