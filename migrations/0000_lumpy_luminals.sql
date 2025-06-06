CREATE TABLE "cities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"code" varchar(3) NOT NULL,
	"country_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cities_name_unique" UNIQUE("name"),
	CONSTRAINT "cities_slug_unique" UNIQUE("slug"),
	CONSTRAINT "cities_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "communes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"code" varchar(3) NOT NULL,
	"city_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "communes_name_unique" UNIQUE("name"),
	CONSTRAINT "communes_slug_unique" UNIQUE("slug"),
	CONSTRAINT "communes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"code_iso" varchar(3) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "countries_name_unique" UNIQUE("name"),
	CONSTRAINT "countries_slug_unique" UNIQUE("slug"),
	CONSTRAINT "countries_code_iso_unique" UNIQUE("code_iso")
);
--> statement-breakpoint
CREATE TABLE "metadata" (
	"id" text PRIMARY KEY NOT NULL,
	"last_version" integer DEFAULT 1 NOT NULL,
	"last_updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"code" varchar(3) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "modes_name_unique" UNIQUE("name"),
	CONSTRAINT "modes_slug_unique" UNIQUE("slug"),
	CONSTRAINT "modes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "transport_companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"code" varchar(3) NOT NULL,
	"country_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transport_companies_name_unique" UNIQUE("name"),
	CONSTRAINT "transport_companies_slug_unique" UNIQUE("slug"),
	CONSTRAINT "transport_companies_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "transport_line_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transport_line_id" uuid NOT NULL,
	"geometry" json NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transport_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"line" text NOT NULL,
	"line_number" text,
	"opening_hours" text,
	"company_id" uuid NOT NULL,
	"transport_type_id" uuid NOT NULL,
	"city_id" uuid NOT NULL,
	"start_commune_id" uuid NOT NULL,
	"end_commune_id" uuid NOT NULL,
	"geometry" json NOT NULL,
	"data_version" integer DEFAULT 1 NOT NULL,
	"synced_at" timestamp DEFAULT now() NOT NULL,
	"metadata_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transport_lines_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "transport_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"code" varchar(3) NOT NULL,
	"company_id" uuid NOT NULL,
	"mode_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transport_types_name_unique" UNIQUE("name"),
	CONSTRAINT "transport_types_slug_unique" UNIQUE("slug"),
	CONSTRAINT "transport_types_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communes" ADD CONSTRAINT "communes_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transport_companies" ADD CONSTRAINT "transport_companies_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transport_line_versions" ADD CONSTRAINT "transport_line_versions_transport_line_id_transport_lines_id_fk" FOREIGN KEY ("transport_line_id") REFERENCES "public"."transport_lines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transport_lines" ADD CONSTRAINT "transport_lines_company_id_transport_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."transport_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transport_lines" ADD CONSTRAINT "transport_lines_transport_type_id_transport_types_id_fk" FOREIGN KEY ("transport_type_id") REFERENCES "public"."transport_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transport_lines" ADD CONSTRAINT "transport_lines_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transport_lines" ADD CONSTRAINT "transport_lines_start_commune_id_communes_id_fk" FOREIGN KEY ("start_commune_id") REFERENCES "public"."communes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transport_lines" ADD CONSTRAINT "transport_lines_end_commune_id_communes_id_fk" FOREIGN KEY ("end_commune_id") REFERENCES "public"."communes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transport_lines" ADD CONSTRAINT "transport_lines_metadata_id_metadata_id_fk" FOREIGN KEY ("metadata_id") REFERENCES "public"."metadata"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transport_types" ADD CONSTRAINT "transport_types_company_id_transport_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."transport_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transport_types" ADD CONSTRAINT "transport_types_mode_id_modes_id_fk" FOREIGN KEY ("mode_id") REFERENCES "public"."modes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_transport_lines_data_version" ON "transport_lines" USING btree ("data_version");--> statement-breakpoint
CREATE INDEX "idx_transport_lines_synced_at" ON "transport_lines" USING btree ("synced_at");--> statement-breakpoint
CREATE INDEX "idx_transport_lines_slug" ON "transport_lines" USING btree ("slug");