-- Add payment QR and price fields to events table
ALTER TABLE events
ADD COLUMN IF NOT EXISTS payment_qr_url TEXT,
ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 60;

-- Update existing events to have default price
UPDATE events SET price = 60 WHERE price IS NULL;
