-- Custom SQL migration file, put your code below! --
CREATE TABLE "groups" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "groups_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255)
);
ALTER TABLE "users" ADD COLUMN "id_group" integer;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_group_groups_id_fk" FOREIGN KEY ("id_group") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;
