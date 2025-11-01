/*
  # Remove Translation Cache Table
  
  The content_translations table is unnecessary because:
  - GPT-4o naturally translates Italian context into user's language
  - Adds complexity without significant benefit
  - Extra storage and maintenance overhead
*/

-- Drop translation cache table
DROP TABLE IF EXISTS content_translations CASCADE;

-- Remove any references or policies
-- (None exist yet since table was just created)
