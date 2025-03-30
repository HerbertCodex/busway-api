/** @format */

import { drizzleDb } from './orm';
import {
  citiesTable,
  communesTable,
  countriesTable,
  dataMetadataTable,
  modes,
  transportCompaniesTable,
  transportTypesTable,
} from './schema';

export async function seed() {
  console.log('🚀 Début du seed');

  await drizzleDb
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
  await drizzleDb
    .insert(communesTable)
    .values([
      { code: 'ABO', name: 'abobo', city_id: abidjan.id },
      { code: 'ADJ', name: 'adjamé', city_id: abidjan.id },
      { code: 'ATC', name: 'attécoubé', city_id: abidjan.id },
      { code: 'COC', name: 'cocody', city_id: abidjan.id },
      { code: 'KOU', name: 'koumassi', city_id: abidjan.id },
      { code: 'MAR', name: 'marcory', city_id: abidjan.id },
      { code: 'PLT', name: 'plateau', city_id: abidjan.id },
      { code: 'PBO', name: 'port-bouët', city_id: abidjan.id },
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
  await drizzleDb
    .insert(transportTypesTable)
    .values([
      { name: 'monbus', company_id: sotra.id, mode_id: busMode.id },
      { name: 'navette', company_id: sotra.id, mode_id: busMode.id },
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
}
