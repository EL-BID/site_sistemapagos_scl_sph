-- PROCEDURE: public.generate_payments(integer, text, uuid)

-- DROP PROCEDURE public.generate_payments(integer, text, uuid);

CREATE OR REPLACE PROCEDURE public.generate_payments(
	amount integer,
	period text,
	batch_id uuid)
LANGUAGE 'sql'
AS $BODY$
INSERT INTO public.payment (id, created, batch_id, bank_code,account_number, amount, beneficiary,period)
SELECT uuid_generate_v4(), CURRENT_DATE created, batch_id, b.bank_code, b.account_number,  amount, b.id, period 
FROM public.beneficiary b where status = 1 ;
$BODY$;
