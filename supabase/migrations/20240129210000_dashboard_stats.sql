CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  total_properties BIGINT,
  active_properties BIGINT,
  inactive_properties BIGINT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM properties) as total_properties,
    (SELECT COUNT(*) FROM properties WHERE active = true) as active_properties,
    (SELECT COUNT(*) FROM properties WHERE active = false) as inactive_properties;
END;
$$;
