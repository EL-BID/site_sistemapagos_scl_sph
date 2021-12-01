-- Table: public.log

-- DROP TABLE public.log;

CREATE TABLE IF NOT EXISTS public.log
(
    id uuid NOT NULL,
    created timestamp with time zone,
    type character varying(30) COLLATE pg_catalog."default",
    event character varying(100) COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    "user" character varying(400) COLLATE pg_catalog."default",
    tag character varying(200) COLLATE pg_catalog."default",
    CONSTRAINT log_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.log
    OWNER to siteadmin;