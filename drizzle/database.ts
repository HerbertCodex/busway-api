/** @format */

// database.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { SQLDatabase } from 'encore.dev/storage/sqldb';
import { users } from './schema';

// Create SQLDatabase instance with migrations configuration
const db = new SQLDatabase('busway-db', {
  migrations: {
    path: 'drizzle/migrations',
    source: 'drizzle',
  },
});

// Initialize Drizzle ORM with the connection string
const orm = drizzle(db.connectionString);

// Query all users
await orm.select().from(users);
