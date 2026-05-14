CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"branch_slug" text NOT NULL,
	"slot_date" date NOT NULL,
	"slot_time" text NOT NULL,
	"gold_type" text,
	"weight_estimate" numeric,
	"status" text DEFAULT 'pending' NOT NULL,
	"confirmation_code" text NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text NOT NULL,
	"body_json" text NOT NULL,
	"category" text NOT NULL,
	"cover_image_url" text,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gold_rate_override" (
	"id" serial PRIMARY KEY NOT NULL,
	"rate_24k" numeric NOT NULL,
	"rate_22k" numeric NOT NULL,
	"rate_20k" numeric NOT NULL,
	"rate_18k" numeric NOT NULL,
	"is_manual" boolean DEFAULT true NOT NULL,
	"override_until" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_banners" (
	"id" serial PRIMARY KEY NOT NULL,
	"src" text NOT NULL,
	"alt" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"city" text,
	"area" text,
	"branch_slug" text,
	"gold_type" text,
	"weight_grams" numeric,
	"purity_karat" integer,
	"estimated_value" numeric,
	"source" text DEFAULT 'website' NOT NULL,
	"source_page" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"status" text DEFAULT 'new' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;