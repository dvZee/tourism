/*
  # Allow Public Inserts for Initial Knowledge Base Setup
  
  Temporarily allow public inserts to monuments and knowledge_base tables
  for initial data population. This can be restricted later via application logic.
  
  Alternative: Use service role key for population script
*/

-- Drop restrictive insert policies
DROP POLICY IF EXISTS "Authenticated users can insert monuments" ON monuments;
DROP POLICY IF EXISTS "Authenticated users can update monuments" ON monuments;
DROP POLICY IF EXISTS "Authenticated users can insert knowledge" ON knowledge_base;
DROP POLICY IF EXISTS "Authenticated users can update knowledge" ON knowledge_base;

-- Allow public inserts (for initial setup)
CREATE POLICY "Allow inserts for setup"
  ON monuments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow updates for setup"
  ON monuments FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow inserts for setup"
  ON knowledge_base FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow updates for setup"
  ON knowledge_base FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Note: In production, you might want to restrict this to:
-- 1. Only specific API keys
-- 2. Only during initial setup window
-- 3. Or use service role key for population
