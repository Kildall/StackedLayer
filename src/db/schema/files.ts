// db/schema/files.ts
import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { accessLogs } from './logs';

export const files = pgTable('File', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  filename: text('filename').notNull(),
  mimeType: text('mimeType').notNull(),
  size: integer('size').notNull(),
  storageKey: text('storageKey').unique().notNull(),
  isViewed: boolean('isViewed').default(false),
  accessToken: text('accessToken').unique().notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  userId: text('userId').references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
});

export const filesRelations = relations(files, ({ one, many }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
  logs: many(accessLogs),
}));