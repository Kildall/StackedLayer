// db/schema/logs.ts
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { secrets } from './secrets';
import { relations } from 'drizzle-orm';

export const accessLogs = pgTable('accessLog', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  type: text('type', { enum: ['UPLOAD', 'VIEW'] }).notNull(),
  ip: text('ip').notNull(),
  userAgent: text('userAgent').notNull(),
  country: text('country'),
  city: text('city'),
  region: text('region'),
  timezone: text('timezone'),
  language: text('language'),
  userId: text('userId'),
  secretId: text('secretId').references(() => secrets.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export const accessLogsRelations = relations(accessLogs, ({ one }) => ({
  secret: one(secrets, {
    fields: [accessLogs.secretId],
    references: [secrets.id],
  }),
}));

export type Invitation = typeof invitations.$inferSelect;

export const invitations = pgTable('invitation', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull(),
  token: text('token').unique().notNull(),
  used: boolean('used').default(false),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt'),
});