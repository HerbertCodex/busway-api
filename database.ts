/** @format */

import { drizzle } from 'drizzle-orm/node-postgres';
import { SQLDatabase } from 'encore.dev/storage/sqldb';
import { schema } from './drizzle/schema';

// Create SQLDatabase instance with migrations configuration
const db = new SQLDatabase('busway-db', {
  migrations: {
    path: './migrations',
    source: 'drizzle',
  },
});

// Initialize Drizzle ORM with the connection string
export const orm = drizzle<typeof schema>(db.connectionString, { schema });
