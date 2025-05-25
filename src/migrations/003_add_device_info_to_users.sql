-- Add device information columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS device_type VARCHAR(255),
ADD COLUMN IF NOT EXISTS device_version VARCHAR(255),
ADD COLUMN IF NOT EXISTS device_model VARCHAR(255),
ADD COLUMN IF NOT EXISTS device_name VARCHAR(255);

-- Add comment to explain the columns
COMMENT ON COLUMN users.device_type IS 'Device type (e.g., iPhone, Android)';
COMMENT ON COLUMN users.device_version IS 'Operating system version';
COMMENT ON COLUMN users.device_model IS 'Device model name';
COMMENT ON COLUMN users.device_name IS 'Device name set by user'; 