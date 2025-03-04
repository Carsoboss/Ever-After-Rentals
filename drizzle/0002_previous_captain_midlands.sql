CREATE TABLE IF NOT EXISTS "checkout_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quantity_rented" integer NOT NULL,
	"quantity_returned" integer DEFAULT 0 NOT NULL,
	"total_checkout_id" uuid NOT NULL,
	"rental_item_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rental_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"category" "category" NOT NULL,
	"description" varchar(1000) NOT NULL,
	"price" integer,
	"image" varchar(512),
	"is_specialty" boolean DEFAULT false NOT NULL,
	"quantity" integer NOT NULL,
	"value" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "total_checkout" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"checked_out_by" varchar(256) NOT NULL,
	"checkout_start" timestamp with time zone NOT NULL,
	"checkout_end" timestamp with time zone NOT NULL,
	"deposit_amount" integer DEFAULT 50 NOT NULL,
	"deposit_returned" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tour_rental_items" (
	"tour_id" uuid NOT NULL,
	"rental_item_id" uuid NOT NULL,
	CONSTRAINT "tour_rental_items_tour_id_rental_item_id_pk" PRIMARY KEY("tour_id","rental_item_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tour" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"tour_date_time" timestamp with time zone NOT NULL,
	"wedding_date_time" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DROP TABLE "{name}";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checkout_item" ADD CONSTRAINT "checkout_item_total_checkout_id_total_checkout_id_fk" FOREIGN KEY ("total_checkout_id") REFERENCES "public"."total_checkout"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "checkout_item" ADD CONSTRAINT "checkout_item_rental_item_id_rental_item_id_fk" FOREIGN KEY ("rental_item_id") REFERENCES "public"."rental_item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tour_rental_items" ADD CONSTRAINT "tour_rental_items_tour_id_tour_id_fk" FOREIGN KEY ("tour_id") REFERENCES "public"."tour"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tour_rental_items" ADD CONSTRAINT "tour_rental_items_rental_item_id_rental_item_id_fk" FOREIGN KEY ("rental_item_id") REFERENCES "public"."rental_item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
