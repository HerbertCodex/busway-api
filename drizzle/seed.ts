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

export const slugify = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

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
        name: "Côte d'Ivoire",
        code_iso: 'CIV',
        slug: slugify("côte d'Ivoire"),
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
        name: 'Abidjan',
        slug: slugify('abidjan'),
        country_id: civ.id,
      },
    ])
    .onConflictDoNothing()
    .returning();

  // Insertion des communes de la ville d'Abidjan
  await drizzleDb
    .insert(communesTable)
    .values([
      {
        name: 'Abobo',
        slug: slugify('abobo'),
        code: 'ABB', // Updated code for 'Abobo' from 'ABO' to 'ABB'
        city_id: abidjan.id,
      },
      {
        name: 'Adjamé',
        slug: slugify('adjamé'),
        code: 'ADJ',
        city_id: abidjan.id,
      },
      {
        name: 'Attécoubé',
        slug: slugify('attécoubé'),
        code: 'ATC',
        city_id: abidjan.id,
      },
      {
        name: 'Cocody',
        slug: slugify('cocody'),
        code: 'CCD',
        city_id: abidjan.id,
      },
      {
        name: 'Koumassi',
        slug: slugify('koumassi'),
        code: 'KMS',
        city_id: abidjan.id,
      },
      {
        name: 'Marcory',
        slug: slugify('marcory'),
        code: 'MRC',
        city_id: abidjan.id,
      },
      {
        name: 'Plateau',
        slug: slugify('plateau'),
        code: 'PLT',
        city_id: abidjan.id,
      },
      {
        name: 'Port-Bouët',
        slug: slugify('port-bouët'),
        code: 'PBT',
        city_id: abidjan.id,
      },
      {
        name: 'Treichville',
        slug: slugify('treichville'),
        code: 'TRC',
        city_id: abidjan.id,
      },
      {
        name: 'Yopougon',
        slug: slugify('yopougon'),
        code: 'YOP',
        city_id: abidjan.id,
      },
    ])
    .onConflictDoNothing()
    .returning();

  // Insertion des compagnies de transport
  const [sotra, stl, citrans, privateCompany] = await drizzleDb
    .insert(transportCompaniesTable)
    .values([
      {
        name: 'SOTRA',
        slug: slugify('SOTRA'),
        code: 'SOT',
        country_id: civ.id,
      },
      {
        name: 'STL',
        slug: slugify('STL'),
        code: 'STL',
        country_id: civ.id,
      },
      {
        name: 'CITRANS',
        slug: slugify('CITRANS'),
        code: 'CTR',
        country_id: civ.id,
      },
      {
        name: 'Compagnie Privée',
        slug: slugify('Compagnie Privée'),
        code: 'CPV',
        country_id: civ.id,
      },
    ])
    .onConflictDoNothing()
    .returning();

  // Insertion des modes de transport
  const [busMode, miniCarMode, taxiMode, ferryMode] = await drizzleDb
    .insert(modes)
    .values([
      {
        name: 'Bus',
        slug: slugify('Bus'),
        code: 'BUS',
        description:
          'Bus de grande capacité assurant le transport urbain collectif (ex. : SOTRA)',
      },
      {
        name: 'Mini-car',
        slug: slugify('Mini-car'),
        code: 'MNC',
        description:
          'Mini-car de transport en commun, souvent utilisé pour les liaisons intercommunales (ex. : Gbaka)',
      },
      {
        name: 'Taxi',
        slug: slugify('Taxi'),
        code: 'TAX',
        description:
          'Taxi individuel ou collectif (ex. : Wôrô-wôrô, taxi-compteurs)',
      },
      {
        name: 'Ferry',
        slug: slugify('Ferry'),
        code: 'FRY',
        description:
          'Transport fluvial par bateau, traversée de la lagune (ex. : bateaux-bus SOTRA)',
      },
    ])
    .onConflictDoNothing()
    .returning();

  // Insertion des types de transport
  await drizzleDb
    .insert(transportTypesTable)
    .values([
      {
        name: 'MonBus',
        slug: slugify('MonBus'),
        code: 'MBS',
        company_id: sotra.id,
        mode_id: busMode.id,
      },
      {
        name: 'Navette',
        slug: slugify('Navette'),
        code: 'NVT',
        company_id: sotra.id,
        mode_id: busMode.id,
      },
      {
        name: 'Express',
        slug: slugify('Express'),
        code: 'EXP',
        company_id: sotra.id,
        mode_id: busMode.id,
      },
      {
        name: 'MonBato',
        slug: slugify('MonBato'),
        code: 'MBT',
        company_id: sotra.id,
        mode_id: ferryMode.id,
      },
      {
        name: 'Aqualines',
        slug: slugify('Aqualines'),
        code: 'AQL',
        company_id: citrans.id,
        mode_id: ferryMode.id,
      },
      {
        name: 'STL',
        slug: slugify('STL'),
        code: 'STL',
        company_id: stl.id,
        mode_id: ferryMode.id,
      },
      {
        name: 'Gbaka',
        slug: slugify('Gbaka'),
        code: 'GBK',
        company_id: privateCompany.id,
        mode_id: miniCarMode.id,
      },
      {
        name: 'Wôrô-wôrô',
        slug: slugify('Wôrô-wôrô'),
        code: 'WRW',
        company_id: privateCompany.id,
        mode_id: taxiMode.id,
      },
    ])
    .onConflictDoNothing()
    .returning();
}
