-- Migration: Add attributes to phu_tung_su_dung table
-- This converts the simple many-to-many join table into a full entity with attributes

-- Add new columns to phu_tung_su_dung table
-- Note: total_price is NOT stored - it's calculated as quantity * unit_price
ALTER TABLE phu_tung_su_dung 
ADD COLUMN IF NOT EXISTS id INT AUTO_INCREMENT PRIMARY KEY FIRST,
ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1,
ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS notes VARCHAR(500),
ADD COLUMN IF NOT EXISTS requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS is_critical BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS issue_description VARCHAR(1000);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_reception_spare_reception ON phu_tung_su_dung(reception_id);
CREATE INDEX IF NOT EXISTS idx_reception_spare_part ON phu_tung_su_dung(spare_part_id);
CREATE INDEX IF NOT EXISTS idx_reception_spare_status ON phu_tung_su_dung(status);

-- Update existing records with default values
UPDATE phu_tung_su_dung 
SET 
    quantity = 1,
    status = 'USED',
    requested_at = NOW(),
    is_critical = FALSE
WHERE quantity IS NULL;
