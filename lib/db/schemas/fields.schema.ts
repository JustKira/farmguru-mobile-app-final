import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const fieldsSchema = sqliteTable('fields', {
  id: text('id').primaryKey(),
  name: text('name'),
  farmId: text('farmId'),
  location: text('location', { mode: 'json' }),
  position: text('position', { mode: 'json' }),
  bounds: text('bounds', { mode: 'json' }),
});

const insertFieldSchema = createInsertSchema(fieldsSchema, {
  location: z.array(z.number()).min(2).max(2),
  bounds: z.array(z.array(z.number()).min(2).max(2)).min(2).max(2),
});
interface NewField extends z.infer<typeof insertFieldSchema> {}

const selectFieldSchema = createSelectSchema(fieldsSchema, {
  location: z.array(z.number()).min(2).max(2),
  bounds: z.array(z.array(z.number()).min(2).max(2)).min(2).max(2),
});
interface Field extends z.infer<typeof selectFieldSchema> {}

export { fieldsSchema, Field, NewField, selectFieldSchema, insertFieldSchema };
