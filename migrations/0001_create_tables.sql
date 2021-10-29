DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS brand CASCADE;
DROP TABLE IF EXISTS lab CASCADE;

CREATE TABLE "public"."lab" (  
  id varchar(128) PRIMARY KEY NOT NULL,
  name varchar(128) NOT NULL,
  urls jsonb NOT NULL,
  data jsonb NOT NULL,
	ratings jsonb NOT NULL,  
  texts jsonb NOT NULL
);

CREATE TABLE "public"."brand" (
	id varchar(128) PRIMARY KEY NOT NULL,
	name varchar(128) NOT NULL,
	lab_id varchar(128) NOT NULL,
	markets jsonb NOT NULL,
  urls jsonb NOT NULL,
	data jsonb NOT NULL,
	ratings jsonb NOT NULL,	
	texts jsonb NOT NULL,
	FOREIGN KEY ("lab_id") REFERENCES "public"."lab"(id)	
);

CREATE TABLE "public"."product" (
	id varchar(128) PRIMARY KEY NOT NULL,
	name varchar NOT NULL,
	brand_id varchar(128) NOT NULL,
	urls jsonb NOT NULL,
	data jsonb NOT NULL,
	markets jsonb NOT NULL,
	ratings jsonb NOT NULL,
	ingredients jsonb NOT NULL,
	conditions jsonb NOT NULL,
	targets jsonb NOT NULL,
	texts jsonb NOT NULL,
	images jsonb NOT NULL,
	social jsonb NOT NULL,
	sustainability jsonb NOT NULL,
	FOREIGN KEY ("brand_id") REFERENCES "public"."brand"(id)		
);
