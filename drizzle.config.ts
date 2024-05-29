import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './lib/db/schemas/index.ts',
  out: './drizzle',
  verbose: true,
  //@ts-ignore
  dialect: 'sqlite',
  driver: 'expo',
});
