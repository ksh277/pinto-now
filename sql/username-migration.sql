-- Add unique username if not present:
ALTER TABLE users ADD COLUMN username VARCHAR(50) NOT NULL UNIQUE AFTER email;
-- Backfill example:
-- UPDATE users SET username = SUBSTRING_INDEX(email,'@',1) WHERE username IS NULL OR username='';
