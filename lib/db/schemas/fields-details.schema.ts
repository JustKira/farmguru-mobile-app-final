import { numeric, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const fieldsDetailsSchema = sqliteTable('fieldsDetails', {
  id: text('id').primaryKey(),

  cropType: text('cropType'),
  cropAge: text('cropAge'),

  lastInfoUpdate: text('lastInfoUpdate'),
  lastCropUpdate: text('lastCropUpdate'),
  lastIrrigationUpdate: text('lastIrrigationUpdate'),
  lastScoutUpdate: text('lastScoutUpdate'),

  growthPercentage: text('growthPercentage', { mode: 'json' }),
  nutrientsPercentage: text('nutrientsPercentage', { mode: 'json' }),
  stressPercentage: text('stressPercentage', { mode: 'json' }),

  growthTrend: numeric('growthTrend'),
  nutrientsTrend: numeric('nutrientsTrend'),
  stressTrend: numeric('stressTrend'),
});

const insertFieldDetailsSchema = createInsertSchema(fieldsDetailsSchema, {
  growthPercentage: z.array(z.number()),
  nutrientsPercentage: z.array(z.number()),
  stressPercentage: z.array(z.number()),
});
interface NewFieldDetails extends z.infer<typeof insertFieldDetailsSchema> {}

const selectFieldDetailsSchema = createSelectSchema(fieldsDetailsSchema, {
  growthPercentage: z.array(z.number()),
  nutrientsPercentage: z.array(z.number()),
  stressPercentage: z.array(z.number()),
});
interface FieldDetails extends z.infer<typeof selectFieldDetailsSchema> {}

export {
  fieldsDetailsSchema,
  FieldDetails,
  NewFieldDetails,
  selectFieldDetailsSchema,
  insertFieldDetailsSchema,
};
