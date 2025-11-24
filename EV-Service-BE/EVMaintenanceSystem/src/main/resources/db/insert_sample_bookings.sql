-- Insert Sample Bookings for Admin Dashboard
-- 50 bookings per center (5 centers) = 250 bookings
-- Distribution:
-- - 20 bookings: Maintenance Level 3
-- - 20 bookings: Maintenance Level 2  
-- - 20 bookings: Battery Pack replacement
-- - 20 bookings: Battery Management System replacement
-- - 20 bookings: Battery Temperature Sensor replacement

-- Note: Adjust booking_id starting number based on existing data
-- This script assumes booking_id starts from 100

DECLARE @startBookingId INT = 100;
DECLARE @currentId INT = @startBookingId;
DECLARE @centerId INT;
DECLARE @vehicleId INT;
DECLARE @bookingDate DATE;
DECLARE @bookingTime TIME;
DECLARE @serviceType NVARCHAR(100);
DECLARE @cost DECIMAL(10,2);

-- Loop through 5 centers
DECLARE @centerLoop INT = 1;
WHILE @centerLoop <= 5
BEGIN
    SET @centerId = @centerLoop;
    
    -- 10 bookings per service type per center
    DECLARE @serviceLoop INT = 1;
    WHILE @serviceLoop <= 10
    BEGIN
        -- Set random vehicle (1-10)
        SET @vehicleId = ((@serviceLoop - 1) % 10) + 1;
        
        -- Set booking date (random in November 2025)
        SET @bookingDate = DATEADD(DAY, FLOOR(RAND() * 30), '2025-11-01');
        
        -- Set booking time (08:00 - 17:00)
        SET @bookingTime = CAST(DATEADD(HOUR, 8 + FLOOR(RAND() * 10), CAST('00:00:00' AS TIME)) AS TIME);
        
        -- Service Type 1: Maintenance Level 3 (2 bookings)
        IF @serviceLoop <= 2
        BEGIN
            INSERT INTO lich_hen (customer_name, customer_phone, customer_email, vehicle_id, center_id, booking_date, booking_time, status, notes)
            VALUES (
                N'Khách hàng ' + CAST(@currentId AS NVARCHAR),
                '090' + RIGHT('0000000' + CAST(@currentId AS NVARCHAR), 7),
                'customer' + CAST(@currentId AS NVARCHAR) + '@test.com',
                @vehicleId,
                @centerId,
                @bookingDate,
                @bookingTime,
                'COMPLETED',
                N'Bảo dưỡng cấp 3 - 10000km'
            );
            
            -- Insert payment for this booking
            INSERT INTO thanh_toan (
                booking_id, invoice_number, customer_name, customer_phone, customer_email,
                vehicle_info, license_plate, service_name, service_description,
                total_amount, discount_amount, final_amount, payment_status, payment_method, payment_date
            )
            VALUES (
                @currentId,
                'INV' + RIGHT('000000' + CAST(@currentId AS NVARCHAR), 6),
                N'Khách hàng ' + CAST(@currentId AS NVARCHAR),
                '090' + RIGHT('0000000' + CAST(@currentId AS NVARCHAR), 7),
                'customer' + CAST(@currentId AS NVARCHAR) + '@test.com',
                'VinFast Evo 200',
                '49MD' + RIGHT('00000' + CAST(@currentId AS NVARCHAR), 5),
                N'Bảo dưỡng cấp 3',
                N'Gói bảo dưỡng mỗi 10000km',
                300000,
                0,
                300000,
                'COMPLETED',
                'VNPAY',
                DATEADD(HOUR, 2, CAST(@bookingDate AS DATETIME) + CAST(@bookingTime AS DATETIME))
            );
            
            SET @currentId = @currentId + 1;
        END
        
        -- Service Type 2: Maintenance Level 2 (2 bookings)
        ELSE IF @serviceLoop <= 4
        BEGIN
            INSERT INTO lich_hen (customer_name, customer_phone, customer_email, vehicle_id, center_id, booking_date, booking_time, status, notes)
            VALUES (
                N'Khách hàng ' + CAST(@currentId AS NVARCHAR),
                '090' + RIGHT('0000000' + CAST(@currentId AS NVARCHAR), 7),
                'customer' + CAST(@currentId AS NVARCHAR) + '@test.com',
                @vehicleId,
                @centerId,
                @bookingDate,
                @bookingTime,
                'COMPLETED',
                N'Bảo dưỡng cấp 2 - 5000km'
            );
            
            INSERT INTO thanh_toan (
                booking_id, invoice_number, customer_name, customer_phone, customer_email,
                vehicle_info, license_plate, service_name, service_description,
                total_amount, discount_amount, final_amount, payment_status, payment_method, payment_date
            )
            VALUES (
                @currentId,
                'INV' + RIGHT('000000' + CAST(@currentId AS NVARCHAR), 6),
                N'Khách hàng ' + CAST(@currentId AS NVARCHAR),
                '090' + RIGHT('0000000' + CAST(@currentId AS NVARCHAR), 7),
                'customer' + CAST(@currentId AS NVARCHAR) + '@test.com',
                'VinFast Theon S',
                '59MD' + RIGHT('00000' + CAST(@currentId AS NVARCHAR), 5),
                N'Bảo dưỡng cấp 2',
                N'Gói bảo dưỡng mỗi 5000km',
                250000,
                0,
                250000,
                'COMPLETED',
                'VNPAY',
                DATEADD(HOUR, 2, CAST(@bookingDate AS DATETIME) + CAST(@bookingTime AS DATETIME))
            );
            
            SET @currentId = @currentId + 1;
        END
        
        -- Service Type 3: Battery Pack replacement (2 bookings)
        ELSE IF @serviceLoop <= 6
        BEGIN
            INSERT INTO lich_hen (customer_name, customer_phone, customer_email, vehicle_id, center_id, booking_date, booking_time, status, notes)
            VALUES (
                N'Khách hàng ' + CAST(@currentId AS NVARCHAR),
                '090' + RIGHT('0000000' + CAST(@currentId AS NVARCHAR), 7),
                'customer' + CAST(@currentId AS NVARCHAR) + '@test.com',
                @vehicleId,
                @centerId,
                @bookingDate,
                @bookingTime,
                'COMPLETED',
                N'Thay thế Battery Pack 48V 20Ah'
            );
            
            INSERT INTO thanh_toan (
                booking_id, invoice_number, customer_name, customer_phone, customer_email,
                vehicle_info, license_plate, service_name, service_description,
                total_amount, discount_amount, final_amount, payment_status, payment_method, payment_date
            )
            VALUES (
                @currentId,
                'INV' + RIGHT('000000' + CAST(@currentId AS NVARCHAR), 6),
                N'Khách hàng ' + CAST(@currentId AS NVARCHAR),
                '090' + RIGHT('0000000' + CAST(@currentId AS NVARCHAR), 7),
                'customer' + CAST(@currentId AS NVARCHAR) + '@test.com',
                'VinFast Feliz S',
                '51MD' + RIGHT('00000' + CAST(@currentId AS NVARCHAR), 5),
                N'Thay thế phụ tùng',
                N'Battery Pack 48V 20Ah',
                3500000,
                0,
                3500000,
                'COMPLETED',
                'VNPAY',
                DATEADD(HOUR, 3, CAST(@bookingDate AS DATETIME) + CAST(@bookingTime AS DATETIME))
            );
            
            SET @currentId = @currentId + 1;
        END
        
        -- Service Type 4: Battery Management System (2 bookings)
        ELSE IF @serviceLoop <= 8
        BEGIN
            INSERT INTO lich_hen (customer_name, customer_phone, customer_email, vehicle_id, center_id, booking_date, booking_time, status, notes)
            VALUES (
                N'Khách hàng ' + CAST(@currentId AS NVARCHAR),
                '090' + RIGHT('0000000' + CAST(@currentId AS NVARCHAR), 7),
                'customer' + CAST(@currentId AS NVARCHAR) + '@test.com',
                @vehicleId,
                @centerId,
                @bookingDate,
                @bookingTime,
                'COMPLETED',
                N'Thay thế Battery Management System'
            );
            
            INSERT INTO thanh_toan (
                booking_id, invoice_number, customer_name, customer_phone, customer_email,
                vehicle_info, license_plate, service_name, service_description,
                total_amount, discount_amount, final_amount, payment_status, payment_method, payment_date
            )
            VALUES (
                @currentId,
                'INV' + RIGHT('000000' + CAST(@currentId AS NVARCHAR), 6),
                N'Khách hàng ' + CAST(@currentId AS NVARCHAR),
                '090' + RIGHT('0000000' + CAST(@currentId AS NVARCHAR), 7),
                'customer' + CAST(@currentId AS NVARCHAR) + '@test.com',
                'VinFast Klara S',
                '52MD' + RIGHT('00000' + CAST(@currentId AS NVARCHAR), 5),
                N'Thay thế phụ tùng',
                N'Battery Management System',
                1200000,
                0,
                1200000,
                'COMPLETED',
                'CASH',
                DATEADD(HOUR, 2, CAST(@bookingDate AS DATETIME) + CAST(@bookingTime AS DATETIME))
            );
            
            SET @currentId = @currentId + 1;
        END
        
        -- Service Type 5: Battery Temperature Sensor (2 bookings)
        ELSE
        BEGIN
            INSERT INTO lich_hen (customer_name, customer_phone, customer_email, vehicle_id, center_id, booking_date, booking_time, status, notes)
            VALUES (
                N'Khách hàng ' + CAST(@currentId AS NVARCHAR),
                '090' + RIGHT('0000000' + CAST(@currentId AS NVARCHAR), 7),
                'customer' + CAST(@currentId AS NVARCHAR) + '@test.com',
                @vehicleId,
                @centerId,
                @bookingDate,
                @bookingTime,
                'COMPLETED',
                N'Thay thế Battery Temperature Sensor'
            );
            
            INSERT INTO thanh_toan (
                booking_id, invoice_number, customer_name, customer_phone, customer_email,
                vehicle_info, license_plate, service_name, service_description,
                total_amount, discount_amount, final_amount, payment_status, payment_method, payment_date
            )
            VALUES (
                @currentId,
                'INV' + RIGHT('000000' + CAST(@currentId AS NVARCHAR), 6),
                N'Khách hàng ' + CAST(@currentId AS NVARCHAR),
                '090' + RIGHT('0000000' + CAST(@currentId AS NVARCHAR), 7),
                'customer' + CAST(@currentId AS NVARCHAR) + '@test.com',
                'VinFast Ludo',
                '53MD' + RIGHT('00000' + CAST(@currentId AS NVARCHAR), 5),
                N'Thay thế phụ tùng',
                N'Battery Temperature Sensor',
                180000,
                0,
                180000,
                'COMPLETED',
                'CASH',
                DATEADD(HOUR, 1, CAST(@bookingDate AS DATETIME) + CAST(@bookingTime AS DATETIME))
            );
            
            SET @currentId = @currentId + 1;
        END
        
        SET @serviceLoop = @serviceLoop + 1;
    END
    
    SET @centerLoop = @centerLoop + 1;
END

PRINT 'Successfully inserted 250 sample bookings and payments!';
