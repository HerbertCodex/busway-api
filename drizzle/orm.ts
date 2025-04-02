/** @format */
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
const { Pool } = pg;

import { config } from '../src/common/config';
import * as schema from './schema';

const pool = new Pool({
  connectionString: config.databaseUrl,
});

export const drizzleDb = drizzle(pool, { schema });
