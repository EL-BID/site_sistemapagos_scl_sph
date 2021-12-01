-- Table: public.familygroupmember

-- DROP TABLE public.familygroupmember;

CREATE TABLE IF NOT EXISTS public.familygroupmember
(
    id uuid,
    first_name character varying(40) COLLATE pg_catalog."default",
    middle_name character varying(40) COLLATE pg_catalog."default",
    last_name_1 character varying(40) COLLATE pg_catalog."default",
    last_name_2 character varying(40) COLLATE pg_catalog."default",
    national_id_number character varying(20) COLLATE pg_catalog."default",
    marital_status smallint,
    relationship smallint,
    add_income boolean,
    education_level smallint,
    health_insurance boolean,
    special_needs smallint,
    handicap boolean,
    beneficiary uuid,
    gender smallint,
    national_id_type character(1) COLLATE pg_catalog."default",
    created timestamp with time zone,
    updated timestamp with time zone,
    CONSTRAINT fk_family_group_member_beneficiaries FOREIGN KEY (beneficiary)
        REFERENCES public.beneficiary (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.familygroupmember
    OWNER to siteadmin;
-- Index: family_member_id_unique_id

-- DROP INDEX public.family_member_id_unique_id;

CREATE UNIQUE INDEX family_member_id_unique_id
    ON public.familygroupmember USING btree
    (id ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: family_member_national_id_number_unique_id

-- DROP INDEX public.family_member_national_id_number_unique_id;

CREATE UNIQUE INDEX family_member_national_id_number_unique_id
    ON public.familygroupmember USING btree
    (national_id_number COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;