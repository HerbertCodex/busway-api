/** @format */

import dotenv from 'dotenv';
dotenv.config();

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  // if (!value && required) {
  //   throw new Error(
  //     `❌ La variable d'environnement "${key}" est requise mais manquante.`,
  //   );
  // }
  return value ?? '';
}

export const config = {
  transportMetadataUrl: getEnv('TRANSPORT_METADATA_URL'),
  databaseUrl: getEnv('DATABASE_URL'),
};
