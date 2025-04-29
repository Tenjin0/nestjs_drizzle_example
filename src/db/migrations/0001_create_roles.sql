CREATE TABLE "roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "id_role" integer;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_role_roles_id_fk" FOREIGN KEY ("id_role") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
