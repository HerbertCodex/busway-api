/** @format */

// drizzle.config.ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: 'drizzle/migrations',
  schema: 'drizzle/schema.ts',
  dialect: 'postgresql',
});
