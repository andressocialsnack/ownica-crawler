DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS brand CASCADE;
DROP TABLE IF EXISTS lab CASCADE;

CREATE TABLE "public"."product" (  
	pk SERIAL PRIMARY KEY NOT NULL,	
  id varchar(128) PRIMARY KEY NOT NULL,
  name varchar(128) NOT NULL,
  url jsonb NOT NULL,
  src varchar(10) NOT NULL,
  texts jsonb NOT NULL,
	imgs jsonb NOT NULL
);

