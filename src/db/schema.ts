import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['user', 'system']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerk_id', { length: 191 }).notNull().unique(),
  email: varchar('email', { length: 191 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const chats = pgTable('chats', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  userId: varchar('user_id', { length: 191 })
    .notNull()
    .references(() => users.clerkId),
  s3Key: varchar('s3_key').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  chatId: integer('chat_id')
    .notNull()
    .references(() => chats.id),
  content: text('content').notNull(),
  role: roleEnum('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userSubscriptions = pgTable('user_subscriptions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 191 })
    .notNull()
    .unique()
    .references(() => users.clerkId),
  stripeCustomerId: varchar('stripe_customer_id').unique().notNull(),
  stripeSubscriptionId: varchar('stripe_subscription_id').unique(),
  stripePriceId: varchar('stripe_price_id'),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
