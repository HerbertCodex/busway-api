/** @format */

import { drizzleDb } from './orm';
import {
  citiesTable,
  communesTable,
  countriesTable,
  modes,
  transportCompaniesTable,
  transportTypesTable,
} from './schema';

export async function seed() {
  console.log('🚀 Début du seed');

  //Insertion des pays
  const [civ] = await drizzleDb
    .insert(countriesTable)
    .values([
      {
        name: "Côte d'Ivoire",
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
        name: 'Abidjan',
        country_id: civ.id,
      },
    ])
    .onConflictDoNothing()
    .returning();

  // Insertion des communes de la ville d'Abidjan
  await drizzleDb.insert(communesTable).values([
    {
      name: 'Abobo',
      city_id: abidjan.id,
    },
    {
      name: 'Yopougon',
      city_id: abidjan.id,
    },
    {
      name: 'Treichville',
      city_id: abidjan.id,
    },
    {
      name: 'Cocody',
      city_id: abidjan.id,
    },
  ]);

  // Insertion des compagnies de transport
  const [sotra, privateCompagny] = await drizzleDb
    .insert(transportCompaniesTable)
    .values([
      {
        name: 'SOTRA',
        country_id: civ.id,
      },
      {
        name: 'Privé',
        country_id: civ.id,
      },
    ])
    .onConflictDoNothing()
    .returning();

  // Insertion des modes de transport
  const [busMode, minibusMode, taxiMode] = await drizzleDb
    .insert(modes)
    .values([
      { name: 'bus', description: 'Bus classique de transport urbain' },
      { name: 'minibus', description: 'Gbaka ou mini bus' },
      { name: 'taxi', description: 'Taxi individuel ou collectif' },
    ])
    .onConflictDoNothing()
    .returning();

  // Insertion des types de transport
  await drizzleDb
    .insert(transportTypesTable)
    .values([
      { name: 'monbus', company_id: sotra.id, mode_id: busMode.id },
      {
        name: 'gbaka',
        company_id: privateCompagny.id,
        mode_id: minibusMode.id,
      },
      {
        name: 'wôrô-wôrô',
        company_id: privateCompagny.id,
        mode_id: taxiMode.id,
      },
    ])
    .onConflictDoNothing();
}
