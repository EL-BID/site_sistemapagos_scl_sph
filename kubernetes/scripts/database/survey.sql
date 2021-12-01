-- Table: public.survey

-- DROP TABLE public.survey;

CREATE TABLE IF NOT EXISTS public.survey
(
    id uuid,
    created timestamp with time zone,
    updated timestamp with time zone,
    data json,
    schema json
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.survey
    OWNER to siteadmin;