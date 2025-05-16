CREATE TABLE "carts" (
	"user_id" varchar NOT NULL,
	"product_id" varchar NOT NULL,
	"quantity" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cart_id" PRIMARY KEY("product_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar,
	"email" varchar,
	"phone" varchar,
	"comment" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"status" varchar(10) DEFAULT '5',
	"transaction_id" varchar,
	"delivery_address" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_order" (
	"order_id" varchar NOT NULL,
	"product_id" varchar NOT NULL,
	"price" double precision NOT NULL,
	"discount" double precision DEFAULT 0 NOT NULL,
	"quantity" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_order_id" PRIMARY KEY("product_id","order_id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"details" text DEFAULT '' NOT NULL,
	"description" text NOT NULL,
	"price" double precision NOT NULL,
	"discount" double precision DEFAULT 0 NOT NULL,
	"images" json DEFAULT '[]'::json NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"tag" varchar DEFAULT '🎁 BUY 1, GET 1 FREE HOLIDAY SALE 🎁',
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_name_idx" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user" varchar NOT NULL,
	"image" varchar,
	"title" varchar NOT NULL,
	"comment" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"value" text,
	"comment" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "settings_name_idx" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_idx" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" varchar(20),
	"avatar" varchar,
	"type" text DEFAULT '5' NOT NULL,
	"password" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_idx" UNIQUE("email"),
	CONSTRAINT "users_phone_idx" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_order" ADD CONSTRAINT "product_order_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_order" ADD CONSTRAINT "product_order_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;