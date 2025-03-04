// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  pgEnum,
  uuid,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ever-after-rentals_${name}`);

// Create the Category enum
export const categoryEnum = pgEnum("category", [
  "SPECIALTY_ITEMS",
  "TABLE_DECOR",
  "CENTERPIECES_VASES",
  "SERVING_DINNERWARE",
  "DECORATIVE_ELEMENTS",
  "CANDLES_LIGHTING",
]);

// RentalItem table
export const rentalItems = createTable("rental_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  category: categoryEnum("category").notNull(),
  description: varchar("description", { length: 1000 }).notNull(),
  price: integer("price"),
  image: varchar("image", { length: 512 }),
  isSpecialty: boolean("is_specialty").default(false).notNull(),
  quantity: integer("quantity").notNull(),
  value: integer("value").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
});

// TotalCheckout table
export const totalCheckouts = createTable("total_checkout", {
  id: uuid("id").primaryKey().defaultRandom(),
  checkedOutBy: varchar("checked_out_by", { length: 256 }).notNull(),
  checkoutStart: timestamp("checkout_start", { withTimezone: true }).notNull(),
  checkoutEnd: timestamp("checkout_end", { withTimezone: true }).notNull(),
  depositAmount: integer("deposit_amount").default(50).notNull(),
  depositReturned: integer("deposit_returned").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
});

// CheckoutItem table
export const checkoutItems = createTable("checkout_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  quantityRented: integer("quantity_rented").notNull(),
  quantityReturned: integer("quantity_returned").default(0).notNull(),
  totalCheckoutId: uuid("total_checkout_id")
    .notNull()
    .references(() => totalCheckouts.id),
  rentalItemId: uuid("rental_item_id")
    .notNull()
    .references(() => rentalItems.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
});

// Tour table
export const tours = createTable("tour", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  tourDateTime: timestamp("tour_date_time", { withTimezone: true }).notNull(),
  weddingDateTime: timestamp("wedding_date_time", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
});

// Many-to-many relation table for Tours and RentalItems
export const tourRentalItems = createTable("tour_rental_items", {
  tourId: uuid("tour_id")
    .notNull()
    .references(() => tours.id),
  rentalItemId: uuid("rental_item_id")
    .notNull()
    .references(() => rentalItems.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.tourId, table.rentalItemId] }),
}));

// After your table definitions, add these relations:

export const rentalItemsRelations = relations(rentalItems, ({ many }) => ({
  checkoutItems: many(checkoutItems),
  tours: many(tourRentalItems),
}));

export const checkoutItemsRelations = relations(checkoutItems, ({ one }) => ({
  rentalItem: one(rentalItems, {
    fields: [checkoutItems.rentalItemId],
    references: [rentalItems.id],
  }),
  totalCheckout: one(totalCheckouts, {
    fields: [checkoutItems.totalCheckoutId],
    references: [totalCheckouts.id],
  }),
}));

export const totalCheckoutsRelations = relations(totalCheckouts, ({ many }) => ({
  checkoutItems: many(checkoutItems),
}));

export const toursRelations = relations(tours, ({ many }) => ({
  rentalItems: many(tourRentalItems),
}));

export const tourRentalItemsRelations = relations(tourRentalItems, ({ one }) => ({
  tour: one(tours, {
    fields: [tourRentalItems.tourId],
    references: [tours.id],
  }),
  rentalItem: one(rentalItems, {
    fields: [tourRentalItems.rentalItemId],
    references: [rentalItems.id],
  }),
}));

// Prisma Schema for reference

// enum Category {
//   SPECIALTY_ITEMS
//   TABLE_DECOR
//   CENTERPIECES_VASES
//   SERVING_DINNERWARE
//   DECORATIVE_ELEMENTS
//   CANDLES_LIGHTING
// }

// model RentalItem {
//   id          String   @id @default(uuid())
//   name        String
//   category    Category
//   description String
//   price       Int?
//   image       String?  // URL for image
//   isSpecialty Boolean @default(false)
//   quantity    Int
//   value       Int
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt

//   CheckoutItems CheckoutItem[]
// }

// model CheckoutItem {
//   id              String   @id @default(uuid())
//   quantityRented  Int
//   quantityReturned Int    @default(0)
//   createdAt       DateTime @default(now())
//   updatedAt       DateTime @updatedAt

//   totalCheckoutId String
//   totalCheckout   TotalCheckout @relation(fields: [totalCheckoutId], references: [id])
// }

// model TotalCheckout {
//   id               String   @id @default(uuid())
//   checkoutItems    CheckoutItem[]
//   checkedOutBy     String   // ClerkUserId
//   checkoutStart    DateTime
//   checkoutEnd      DateTime
//   depositAmount    Int      @default(50)
//   depositReturned  Int      @default(0)
//   createdAt        DateTime @default(now())
//   updatedAt        DateTime @updatedAt
// }

// model Tour {
//   id              String   @id @default(uuid())
//   userId          String   // Clerk userId
//   tourDateTime    DateTime
//   rentalItems     RentalItem[]
//   weddingDateTime DateTime
//   createdAt       DateTime @default(now())
//   updatedAt       DateTime @updatedAt
// }

