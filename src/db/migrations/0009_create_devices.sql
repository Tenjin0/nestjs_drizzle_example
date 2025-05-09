CREATE TABLE "devices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "devices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"serial" varchar(255) NOT NULL,
	"alias" varchar(255),
	"info" jsonb,
	"socket_id" varchar(255),
	"connected" boolean DEFAULT false NOT NULL,
	"id_location" integer,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "devices_serial_unique" UNIQUE("serial")
);
--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_id_location_locations_id_fk" FOREIGN KEY ("id_location") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;