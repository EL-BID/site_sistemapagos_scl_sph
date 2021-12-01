-- Table: public.beneficiary

-- DROP TABLE public.beneficiary;

CREATE TABLE IF NOT EXISTS public.beneficiary
(
    id uuid,
    type character varying(20) COLLATE pg_catalog."default",
    gender smallint,
    birthday date,
    instrument smallint,
    account_status character varying(2) COLLATE pg_catalog."default",
    account_owner boolean,
    account_number character varying(50) COLLATE pg_catalog."default",
    bank_code character varying(10) COLLATE pg_catalog."default",
    last_name_1 character varying(40) COLLATE pg_catalog."default",
    last_name_2 character varying(40) COLLATE pg_catalog."default",
    first_name character varying(40) COLLATE pg_catalog."default",
    middle_name character varying(40) COLLATE pg_catalog."default",
    marital_status smallint,
    created timestamp with time zone,
    updated timestamp with time zone,
    national_id_type character varying(1) COLLATE pg_catalog."default",
    national_id_number character varying(20) COLLATE pg_catalog."default",
    arc_status smallint,
    am_status smallint,
    update_note text COLLATE pg_catalog."default",
    status smallint,
    alert text COLLATE pg_catalog."default",
    CONSTRAINT uniquectm_beneficiary_id UNIQUE (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.beneficiary
    OWNER to siteadmin;
-- Index: beneficiary_account_status

-- DROP INDEX public.beneficiary_account_status;

CREATE INDEX beneficiary_account_status
    ON public.beneficiary USING btree
    (account_status COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: beneficiary_first_name

-- DROP INDEX public.beneficiary_first_name;

CREATE INDEX beneficiary_first_name
    ON public.beneficiary USING btree
    (first_name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: beneficiary_id_unique_id

-- DROP INDEX public.beneficiary_id_unique_id;

CREATE UNIQUE INDEX beneficiary_id_unique_id
    ON public.beneficiary USING btree
    (id ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: beneficiary_last_name_1

-- DROP INDEX public.beneficiary_last_name_1;

CREATE INDEX beneficiary_last_name_1
    ON public.beneficiary USING btree
    (last_name_1 COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: beneficiary_last_name_2

-- DROP INDEX public.beneficiary_last_name_2;

CREATE INDEX beneficiary_last_name_2
    ON public.beneficiary USING btree
    (last_name_2 COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: beneficiary_middle_name

-- DROP INDEX public.beneficiary_middle_name;

CREATE INDEX beneficiary_middle_name
    ON public.beneficiary USING btree
    (middle_name COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: beneficiary_national_id_number_unique_id

-- DROP INDEX public.beneficiary_national_id_number_unique_id;

CREATE UNIQUE INDEX beneficiary_national_id_number_unique_id
    ON public.beneficiary USING btree
    (national_id_number COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;