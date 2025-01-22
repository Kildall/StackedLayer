import { pgTable, text, timestamp, boolean, primaryKey } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { accounts, authenticators, sessions } from './auth';
import { files } from './files';
import { secrets } from './secrets';

export const users = pgTable('User', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified'),
  image: text('image'),
  password: text('password'),
  salt: text('salt'),
  isAdmin: boolean('isAdmin').default(false),
  invitedBy: text('invitedBy'),
  invitedAt: timestamp('invitedAt'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  authenticators: many(authenticators),
  files: many(files),
  secrets: many(secrets),
}));