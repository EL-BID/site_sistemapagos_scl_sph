-- Table: public.file

-- DROP TABLE public.file;

CREATE TABLE IF NOT EXISTS public.file
(
    id uuid NOT NULL,
    file_name character varying(200) COLLATE pg_catalog."default",
    created timestamp with time zone,
    updated boolean,
    batch_id uuid,
    metadata text COLLATE pg_catalog."default",
    author uuid,
    data text COLLATE pg_catalog."default",
    status character varying(20) COLLATE pg_catalog."default",
    error text COLLATE pg_catalog."default",
    current_row bigint,
    total_rows bigint,
    type character varying(15) COLLATE pg_catalog."default",
    CONSTRAINT file_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.file
    OWNER to siteadmin;