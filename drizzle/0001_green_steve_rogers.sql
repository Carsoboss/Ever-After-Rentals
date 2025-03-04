CREATE TABLE IF NOT EXISTS "{name}" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"tour_date_time" timestamp with time zone NOT NULL,
	"wedding_date_time" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
DROP TABLE "ever-after-rentals_checkout_item";--> statement-breakpoint
DROP TABLE "ever-after-rentals_rental_item";--> statement-breakpoint
DROP TABLE "ever-after-rentals_total_checkout";--> statement-breakpoint
DROP TABLE "ever-after-rentals_tour_rental_items";--> statement-breakpoint
DROP TABLE "ever-after-rentals_tour";