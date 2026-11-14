-- E-Z Rent To Own: private ID storage and application safeguards
-- Run in Supabase SQL Editor after your earlier application SQL.
BEGIN;
INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
VALUES ('rental-private-ids','rental-private-ids',false,8388608,
 ARRAY['image/jpeg','image/png','image/webp','image/heic','image/heif'])
ON CONFLICT (id) DO UPDATE SET public=false,file_size_limit=8388608,
 allowed_mime_types=EXCLUDED.allowed_mime_types;

-- Do not create public storage policies. Only the authenticated Edge Function
-- can access files through the service-role key kept on the server.
-- Ensure denied applications cannot retain references or ID paths.
CREATE OR REPLACE FUNCTION public.ez_scrub_denied_application()
RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF NEW.status='denied' THEN
  IF nullif(btrim(coalesce(NEW.denial_reason,'')),'') IS NULL THEN
   RAISE EXCEPTION 'A denial reason is required';
  END IF;
  IF NEW.id_storage_path IS NOT NULL THEN
   RAISE EXCEPTION 'Delete private ID file before denial';
  END IF;
  NEW.full_name:=NULL;
  NEW.street_address:=NULL;
  NEW.county:=NULL;
  NEW.state:=NULL;
  NEW.pay_frequency:=NULL;
  NEW.reference_contacts:=NULL;
  NEW.requested_products:='[]'::jsonb;
 END IF;
 NEW.updated_at:=now();
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS ez_scrub_denied_application ON public.rental_applications;
CREATE TRIGGER ez_scrub_denied_application
BEFORE INSERT OR UPDATE ON public.rental_applications
FOR EACH ROW EXECUTE FUNCTION public.ez_scrub_denied_application();

-- Disallow any authenticated browser user (including staff) from altering
-- the private file pointer. Only the Edge Function service role may do so.
CREATE OR REPLACE FUNCTION public.ez_protect_id_path()
RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF current_setting('request.jwt.claim.role',true) IS DISTINCT FROM 'service_role'
    AND NEW.id_storage_path IS DISTINCT FROM OLD.id_storage_path THEN
   RAISE EXCEPTION 'ID storage path can only be changed by secure server';
 END IF;
 RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS ez_protect_id_path ON public.rental_applications;
CREATE TRIGGER ez_protect_id_path
BEFORE UPDATE ON public.rental_applications
FOR EACH ROW EXECUTE FUNCTION public.ez_protect_id_path();
COMMIT;
