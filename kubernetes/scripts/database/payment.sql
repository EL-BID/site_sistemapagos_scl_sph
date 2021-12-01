-- Table: public.payment

-- DROP TABLE public.payment;

CREATE TABLE IF NOT EXISTS public.payment
(
    created timestamp with time zone,
    batch_id uuid,
    bank_code character varying(10) COLLATE pg_catalog."default",
    account_number character varying(50) COLLATE pg_catalog."default",
    amount numeric,
    beneficiary uuid,
    period character varying(20) COLLATE pg_catalog."default",
    operation_result character varying(2) COLLATE pg_catalog."default",
    rejection_reason character varying(2) COLLATE pg_catalog."default",
    movements_days_after_payment character varying(2) COLLATE pg_catalog."default",
    movements_days_before_payment character varying(2) COLLATE pg_catalog."default",
    money_returned smallint,
    amount_returned numeric,
    updated timestamp with time zone,
    id uuid
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.payment
    OWNER to siteadmin;
-- Index: payment_bank_code

-- DROP INDEX public.payment_bank_code;

CREATE INDEX payment_bank_code
    ON public.payment USING btree
    (bank_code COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: payment_batch_id

-- DROP INDEX public.payment_batch_id;

CREATE INDEX payment_batch_id
    ON public.payment USING btree
    (batch_id ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: payment_id_unique_id

-- DROP INDEX public.payment_id_unique_id;

CREATE UNIQUE INDEX payment_id_unique_id
    ON public.payment USING btree
    (id ASC NULLS LAST)
    TABLESPACE pg_default;