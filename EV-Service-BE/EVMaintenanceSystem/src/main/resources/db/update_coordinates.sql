-- SQL Script to update geographic coordinates for existing service center addresses
-- Run this script AFTER the latitude and longitude columns are added to dia_chi table
-- (Hibernate will auto-create these columns when you restart the application)

-- Update coordinates for VinFast Service Center Quận 1
UPDATE dia_chi 
SET latitude = 10.7769, longitude = 106.7009
WHERE address_line = '123 Nguyễn Huệ';

-- Update coordinates for VinFast Service Center Quận 7  
UPDATE dia_chi 
SET latitude = 10.7340, longitude = 106.7220
WHERE address_line = '456 Nguyễn Văn Linh';

-- Update coordinates for VinFast Service Center Thủ Đức
UPDATE dia_chi 
SET latitude = 10.8507, longitude = 106.7720
WHERE address_line = '789 Võ Văn Ngân';

-- Update coordinates for VinFast Service Center Gò Vấp
UPDATE dia_chi 
SET latitude = 10.8162, longitude = 106.6870
WHERE address_line = '321 Phan Văn Trị';

-- Update coordinates for VinFast Service Center Bình Thạnh
UPDATE dia_chi 
SET latitude = 10.8013, longitude = 106.7104
WHERE address_line = '654 Xô Viết Nghệ Tĩnh';

-- Verify the updates
SELECT 
    a.address_id,
    a.address_line,
    a.latitude,
    a.longitude,
    c.center_name
FROM dia_chi a
JOIN trung_tam c ON c.address_id = a.address_id
WHERE a.latitude IS NOT NULL
ORDER BY a.address_id;
