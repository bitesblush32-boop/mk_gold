import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';

/* ─── leads ──────────────────────────────────────────────────────── */

export const leads = pgTable('leads', {
  id:              serial('id').primaryKey(),
  name:            text('name').notNull(),
  phone:           text('phone').notNull(),
  email:           text('email'),
  city:            text('city'),
  area:            text('area'),
  branch_slug:     text('branch_slug'),
  gold_type:       text('gold_type'),          // jewellery|coins|bars|broken|mixed|pledged
  weight_grams:    numeric('weight_grams'),
  purity_karat:    integer('purity_karat'),
  estimated_value: numeric('estimated_value'),
  source:          text('source').notNull().default('website'), // website|whatsapp|call|walkin|popup|callback
  source_page:     text('source_page'),
  utm_source:      text('utm_source'),
  utm_medium:      text('utm_medium'),
  utm_campaign:    text('utm_campaign'),
  utm_content:     text('utm_content'),
  status:          text('status').notNull().default('new'), // new|contacted|visited|converted|lost
  notes:           text('notes'),
  created_at:      timestamp('created_at').defaultNow().notNull(),
  updated_at:      timestamp('updated_at').defaultNow().notNull(),
});

/* ─── appointments ───────────────────────────────────────────────── */

export const appointments = pgTable('appointments', {
  id:               serial('id').primaryKey(),
  lead_id:          integer('lead_id').references(() => leads.id),
  name:             text('name').notNull(),
  phone:            text('phone').notNull(),
  branch_slug:      text('branch_slug').notNull(),
  slot_date:        date('slot_date').notNull(),
  slot_time:        text('slot_time').notNull(),
  gold_type:        text('gold_type'),
  weight_estimate:  numeric('weight_estimate'),
  status:           text('status').notNull().default('pending'), // pending|confirmed|visited|no_show|cancelled
  confirmation_code: text('confirmation_code').notNull(),
  notes:            text('notes'),
  created_at:       timestamp('created_at').defaultNow().notNull(),
  updated_at:       timestamp('updated_at').defaultNow().notNull(),
});

/* ─── gold_rate_override ─────────────────────────────────────────── */

export const goldRateOverride = pgTable('gold_rate_override', {
  id:              serial('id').primaryKey(),
  rate_24k:        numeric('rate_24k').notNull(),
  rate_22k:        numeric('rate_22k').notNull(),
  is_manual:       boolean('is_manual').notNull().default(true),
  override_until:  timestamp('override_until'),       // null = active until manually cleared
  updated_at:      timestamp('updated_at').defaultNow().notNull(),
});

/* ─── hero_banners ───────────────────────────────────────────────── */

export const heroBanners = pgTable('hero_banners', {
  id:         serial('id').primaryKey(),
  src:        text('src').notNull(),              // URL or /public path
  alt:        text('alt').notNull(),
  order:      integer('order').notNull().default(0),
  is_active:  boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

/* ─── blog_posts ─────────────────────────────────────────────────── */

export const blogPosts = pgTable('blog_posts', {
  id:              serial('id').primaryKey(),
  title:           text('title').notNull(),
  slug:            text('slug').notNull().unique(),
  excerpt:         text('excerpt').notNull(),
  body_json:       text('body_json').notNull(),   // Portable Text JSON or plain text
  category:        text('category').notNull(),     // Gold Rate|Sell Gold|Pledged Gold|Market Insights|News
  cover_image_url: text('cover_image_url'),
  published:       boolean('published').notNull().default(false),
  published_at:    timestamp('published_at').defaultNow().notNull(),
  created_at:      timestamp('created_at').defaultNow().notNull(),
  updated_at:      timestamp('updated_at').defaultNow().notNull(),
});

/* ─── faqs ──────────────────────────────────────────────────────── */

export const faqs = pgTable('faqs', {
  id:         serial('id').primaryKey(),
  page:       text('page').notNull(),          // 'general' | 'sell-gold' | 'pledged-gold' | 'gold-rate'
  question:   text('question').notNull(),
  answer:     text('answer').notNull(),
  order:      integer('order').notNull().default(0),
  is_active:  boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

/* ─── Type exports ───────────────────────────────────────────────── */

export type Lead         = typeof leads.$inferSelect;
export type NewLead      = typeof leads.$inferInsert;
export type Appointment  = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type GoldRateOverride = typeof goldRateOverride.$inferSelect;
export type HeroBanner   = typeof heroBanners.$inferSelect;
export type BlogPostRow  = typeof blogPosts.$inferSelect;
export type NewBlogPost  = typeof blogPosts.$inferInsert;
export type FaqRow       = typeof faqs.$inferSelect;
export type NewFaq       = typeof faqs.$inferInsert;
