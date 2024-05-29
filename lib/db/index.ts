import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite/next';
import * as schema from './schemas';
const expo = openDatabaseSync('dev_database_004.db');

export const db = drizzle(expo, { schema });
