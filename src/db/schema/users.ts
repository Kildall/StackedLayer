import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { accounts, authenticators, sessions } from './auth';
import { secrets } from './secrets';
import { invitations } from './logs';

export type User = typeof users.$inferSelect;

export const users = pgTable('user', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text('image'),
  password: text('password'),
  salt: text('salt'),
  isAdmin: boolean('isAdmin').default(false),
  invitation: text('invitation').references(() => invitations.token),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  authenticators: many(authenticators),
  secrets: many(secrets),
}));