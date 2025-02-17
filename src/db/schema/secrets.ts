// db/schema/secrets.ts
import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { accessLogs } from './logs';

export const secrets = pgTable('secret', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  type: text('type').notNull(),
  encryptedData: text('encryptedData').notNull(),
  isViewed: boolean('isViewed').default(false),
  expiresAt: timestamp('expiresAt').notNull(),
  userId: text('userId').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
});

export const secretsRelations = relations(secrets, ({ one, many }) => ({
  user: one(users, {
    fields: [secrets.userId],
    references: [users.id],
  }),
  logs: many(accessLogs),
}));