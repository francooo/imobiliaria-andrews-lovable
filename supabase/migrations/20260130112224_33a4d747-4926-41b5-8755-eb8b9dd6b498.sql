-- Create function to get dashboard statistics
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (
  total_properties BIGINT,
  active_properties BIGINT,
  inactive_properties BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM properties)::BIGINT as total_properties,
    (SELECT COUNT(*) FROM properties WHERE active = true)::BIGINT as active_properties,
    (SELECT COUNT(*) FROM properties WHERE active IS NOT TRUE)::BIGINT as inactive_properties;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO anon;