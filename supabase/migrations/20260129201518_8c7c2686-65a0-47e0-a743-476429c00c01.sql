-- Fix function search path for security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Drop overly permissive policy and create a more restrictive one
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;

-- Allow public to insert leads (this is intentional for contact forms)
-- But we add basic validation by requiring name and email
CREATE POLICY "Public can create leads with required fields" 
ON public.leads 
FOR INSERT 
WITH CHECK (name IS NOT NULL AND email IS NOT NULL);