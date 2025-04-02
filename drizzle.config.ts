/** @format */
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from './src/common/config';

export default defineConfig({
  out: 'migrations',
  schema: 'drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.databaseUrl,
  },
});
