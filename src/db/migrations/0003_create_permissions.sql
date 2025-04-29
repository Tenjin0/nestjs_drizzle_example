CREATE TABLE "permissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ressource" varchar(255),
	"action" varchar(255),
	CONSTRAINT "roles_ressource_action_unique" UNIQUE("ressource","action")
);
