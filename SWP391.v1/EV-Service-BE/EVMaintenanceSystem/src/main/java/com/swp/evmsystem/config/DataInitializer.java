package com.swp.evmsystem.config;

import com.swp.evmsystem.entity.*;
import com.swp.evmsystem.enums.*;
import com.swp.evmsystem.repository.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Random;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    static class InitData {
        // Employee Data: {FullName, Role, Phone, Email, Password, CenterId}
        // Admin (no center)
        static final Object[][] ADMIN = {
                {"Admin", Role.ADMIN, "0123456789", "dinhdinhchibao@gmail.com", "admin123", null}
        };

        // Staff for each center (2 per center)
        static final Object[][] STAFF = {
                // Center 1 - Quận 1
                {"Nguyễn Văn An", Role.STAFF, "0901111001", "staff.q1.1@evservice.com", "staff123", 1},
                {"Trần Thị Bình", Role.STAFF, "0901111002", "staff.q1.2@evservice.com", "staff123", 1},
                // Center 2 - Quận 7
                {"Lê Văn Cường", Role.STAFF, "0902222001", "staff.q7.1@evservice.com", "staff123", 2},
                {"Phạm Thị Dung", Role.STAFF, "0902222002", "staff.q7.2@evservice.com", "staff123", 2},
                // Center 3 - Thủ Đức
                {"Hoàng Văn Em", Role.STAFF, "0903333001", "staff.td.1@evservice.com", "staff123", 3},
                {"Võ Thị Phượng", Role.STAFF, "0903333002", "staff.td.2@evservice.com", "staff123", 3},
                // Center 4 - Gò Vấp
                {"Đặng Văn Giang", Role.STAFF, "0904444001", "staff.gv.1@evservice.com", "staff123", 4},
                {"Ngô Thị Hoa", Role.STAFF, "0904444002", "staff.gv.2@evservice.com", "staff123", 4},
                // Center 5 - Bình Thạnh
                {"Bùi Văn Khoa", Role.STAFF, "0905555001", "staff.bt.1@evservice.com", "staff123", 5},
                {"Đinh Thị Lan", Role.STAFF, "0905555002", "staff.bt.2@evservice.com", "staff123", 5}
        };

        // Technicians for each center (6 per center)
        static final Object[][] TECHNICIANS = {
                // Center 1 - Quận 1
                {"Trần Văn Minh", Role.TECHNICIAN, "0911111001", "tech.q1.1@evservice.com", "tech123", 1},
                {"Nguyễn Văn Nam", Role.TECHNICIAN, "0911111002", "tech.q1.2@evservice.com", "tech123", 1},
                {"Lê Văn Ơn", Role.TECHNICIAN, "0911111003", "tech.q1.3@evservice.com", "tech123", 1},
                {"Phạm Văn Phúc", Role.TECHNICIAN, "0911111004", "tech.q1.4@evservice.com", "tech123", 1},
                {"Hoàng Văn Quân", Role.TECHNICIAN, "0911111005", "tech.q1.5@evservice.com", "tech123", 1},
                {"Võ Văn Sơn", Role.TECHNICIAN, "0911111006", "tech.q1.6@evservice.com", "tech123", 1},
                // Center 2 - Quận 7
                {"Đặng Văn Tài", Role.TECHNICIAN, "0922222001", "tech.q7.1@evservice.com", "tech123", 2},
                {"Ngô Văn Uy", Role.TECHNICIAN, "0922222002", "tech.q7.2@evservice.com", "tech123", 2},
                {"Bùi Văn Vũ", Role.TECHNICIAN, "0922222003", "tech.q7.3@evservice.com", "tech123", 2},
                {"Đinh Văn Xuân", Role.TECHNICIAN, "0922222004", "tech.q7.4@evservice.com", "tech123", 2},
                {"Trương Văn Yên", Role.TECHNICIAN, "0922222005", "tech.q7.5@evservice.com", "tech123", 2},
                {"Phan Văn Anh", Role.TECHNICIAN, "0922222006", "tech.q7.6@evservice.com", "tech123", 2},
                // Center 3 - Thủ Đức
                {"Dương Văn Bảo", Role.TECHNICIAN, "0933333001", "tech.td.1@evservice.com", "tech123", 3},
                {"Lý Văn Cảnh", Role.TECHNICIAN, "0933333002", "tech.td.2@evservice.com", "tech123", 3},
                {"Mai Văn Đạt", Role.TECHNICIAN, "0933333003", "tech.td.3@evservice.com", "tech123", 3},
                {"Tô Văn Đức", Role.TECHNICIAN, "0933333004", "tech.td.4@evservice.com", "tech123", 3},
                {"Vũ Văn Hải", Role.TECHNICIAN, "0933333005", "tech.td.5@evservice.com", "tech123", 3},
                {"Hồ Văn Hùng", Role.TECHNICIAN, "0933333006", "tech.td.6@evservice.com", "tech123", 3},
                // Center 4 - Gò Vấp
                {"Cao Văn Kiên", Role.TECHNICIAN, "0944444001", "tech.gv.1@evservice.com", "tech123", 4},
                {"Đỗ Văn Long", Role.TECHNICIAN, "0944444002", "tech.gv.2@evservice.com", "tech123", 4},
                {"La Văn Mạnh", Role.TECHNICIAN, "0944444003", "tech.gv.3@evservice.com", "tech123", 4},
                {"Lưu Văn Nghĩa", Role.TECHNICIAN, "0944444004", "tech.gv.4@evservice.com", "tech123", 4},
                {"Mạc Văn Phong", Role.TECHNICIAN, "0944444005", "tech.gv.5@evservice.com", "tech123", 4},
                {"Nghiêm Văn Quang", Role.TECHNICIAN, "0944444006", "tech.gv.6@evservice.com", "tech123", 4},
                // Center 5 - Bình Thạnh
                {"Ông Văn Rộng", Role.TECHNICIAN, "0955555001", "tech.bt.1@evservice.com", "tech123", 5},
                {"Phùng Văn Sang", Role.TECHNICIAN, "0955555002", "tech.bt.2@evservice.com", "tech123", 5},
                {"Quách Văn Thắng", Role.TECHNICIAN, "0955555003", "tech.bt.3@evservice.com", "tech123", 5},
                {"Tạ Văn Toàn", Role.TECHNICIAN, "0955555004", "tech.bt.4@evservice.com", "tech123", 5},
                {"Thái Văn Tuấn", Role.TECHNICIAN, "0955555005", "tech.bt.5@evservice.com", "tech123", 5},
                {"Ứng Văn Vinh", Role.TECHNICIAN, "0955555006", "tech.bt.6@evservice.com", "tech123", 5}
        };

        // Customer Data: {FullName, Phone, Email, Password, AddressId}
        static final Object[][] CUSTOMERS = {
                {"Vegeta", "0905111111", "quangphap931@gmail.com", "user123", 1},
                {"Songoku", "0905222222", "baodcse184280@fpt.edu.vn", "user123", 2},
                {"Bulma", "0905333333", "customer3@evservice.com", "user123", 3},
                {"Piccolo", "0905444444", "customer4@evservice.com", "user123", 4},
                {"Gohan", "0905555555", "customer5@evservice.com", "user123", 5},
                {"Trunks", "0905666666", "customer6@evservice.com", "user123", 1}
        };

        // Vehicle Data: {VIN, LicensePlate, Model, CustomerId, PurchaseDate, WarrantyYears}
        // All vehicles have purchase date and warranty info (warranty may be expired but data is complete)
        static final Object[][] VEHICLES = {
                // Customer 1 (Vegeta) - 2 vehicles
                {"FAKEVIN0000000001", "49MĐ685692", VehicleModel.EVO_200, 1, LocalDate.now().minusMonths(6), 2},  // Still under warranty
                {"FAKEVIN0000000002", "59MĐ102563", VehicleModel.THEON_S, 1, LocalDate.of(2022, 9, 12), 2},      // Warranty expired
                // Customer 2 (Songoku) - 1 vehicle
                {"FAKEVIN0000000003", "59MĐ155567", VehicleModel.FELIZ_S, 2, LocalDate.of(2021, 5, 20), 2},      // Warranty expired
                // Customer 3 (Bulma) - 2 vehicles
                {"FAKEVIN0000000004", "51MĐ123456", VehicleModel.KLARA_S, 3, LocalDate.now().minusMonths(3), 2}, // Still under warranty
                {"FAKEVIN0000000005", "51MĐ789012", VehicleModel.IMPES, 3, LocalDate.now().minusMonths(8), 2},   // Still under warranty
                // Customer 4 (Piccolo) - 1 vehicle
                {"FAKEVIN0000000006", "52MĐ345678", VehicleModel.LUDO, 4, LocalDate.of(2020, 11, 15), 2},        // Warranty expired
                // Customer 5 (Gohan) - 1 vehicle
                {"FAKEVIN0000000007", "53MĐ901234", VehicleModel.VENTO_S, 5, LocalDate.now().minusMonths(10), 2}, // Still under warranty
                // Customer 6 (Trunks) - 3 vehicles
                {"FAKEVIN0000000008", "49MĐ111222", VehicleModel.EVO_200, 6, LocalDate.now().minusMonths(4), 2},  // Still under warranty
                {"FAKEVIN0000000009", "49MĐ333444", VehicleModel.KLARA_S, 6, LocalDate.now().minusMonths(12), 2}, // Still under warranty
                {"FAKEVIN0000000010", "49MĐ555666", VehicleModel.FELIZ_S, 6, LocalDate.of(2021, 8, 20), 2}       // Warranty expired
        };

        // Location Data
        static final String PROVINCE = "TP. HCM";
        static final String[] DISTRICTS = {"Quận 1", "Quận 7", "TP. Thủ Đức", "Quận Gò Vấp", "Quận Bình Thạnh"};
        static final String[] WARDS = {"Phường Bến Nghé", "Phường Tân Hưng", "Phường Linh Chiểu", "Phường 5", "Phường 25"};
        static final String[] ADDRESS_LINES = {"123 Nguyễn Huệ", "456 Nguyễn Văn Linh", "789 Võ Văn Ngân", "321 Phan Văn Trị", "654 Xô Viết Nghệ Tĩnh"};

        // Service Center Data
        static final String[] CENTER_NAMES = {
                "VinFast Service Center Quận 1",
                "VinFast Service Center Quận 7",
                "VinFast Service Center Thủ Đức",
                "VinFast Service Center Gò Vấp",
                "VinFast Service Center Bình Thạnh"
        };
        static final String[] CENTER_PHONES = {"02812345678", "02823456789", "02834567890", "02845678901", "02856789012"};
        static final LocalTime START_TIME = LocalTime.parse("08:00");
        static final LocalTime END_TIME = LocalTime.parse("18:00");
        static final int MAX_CAPACITY = 3;

        // Geographic coordinates for each service center (matching order)
        // Format: {latitude, longitude}
        static final double[][] CENTER_COORDINATES = {
                {10.7769, 106.7009},  // Quận 1 - Nguyễn Huệ area
                {10.7340, 106.7220},  // Quận 7 - Nguyễn Văn Linh
                {10.8507, 106.7720},  // Thủ Đức - Võ Văn Ngân
                {10.8162, 106.6870},  // Gò Vấp - Phan Văn Trị
                {10.8013, 106.7104}   // Bình Thạnh - Xô Viết Nghệ Tĩnh
        };


        // Maintenance Package Data
        static final Object[][] MAINTENANCE_PACKAGES = {
                {OfferType.MAINTENANCE, PackageLevel.LEVEL_1, "Gói bảo dưỡng cấp 1", "Gói bảo dưỡng mỗi 1000km", 200000, 30},
                {OfferType.MAINTENANCE, PackageLevel.LEVEL_2, "Gói bảo dưỡng cấp 2", "Gói bảo dưỡng mỗi 5000km", 250000, 40},
                {OfferType.MAINTENANCE, PackageLevel.LEVEL_3, "Gói bảo dưỡng cấp 3", "Gói bảo dưỡng mỗi 10000km", 300000, 50}

        };

        // Spare Parts Data
        static final Object[][] SPARE_PARTS = {
                // Battery Parts
                {"Battery Pack 48V 20Ah", "BP-001", PartCategory.BATTERY, 15, 5, 3500000, 3000000, true, "VinFast Parts", "High capacity lithium battery pack"},
                {"Battery Management System", "BP-002", PartCategory.BATTERY, 8, 3, 1200000, 1000000, true, "VinFast Electronics", "BMS for battery protection"},
                {"Battery Charger Port", "BP-003", PartCategory.BATTERY, 25, 10, 150000, 120000, true, "VinFast Parts", "Standard charging port"},
                {"Battery Temperature Sensor", "BP-004", PartCategory.BATTERY, 3, 10, 180000, 140000, true, "VinFast Electronics", "Temperature sensor"},
                // Motor Parts
                {"BLDC Hub Motor 1500W", "MT-001", PartCategory.MOTOR, 6, 2, 5500000, 4800000, true, "Motor Tech Vietnam", "Brushless DC hub motor"},
                {"Motor Controller", "MT-002", PartCategory.MOTOR, 10, 5, 850000, 700000, true, "Motor Tech Vietnam", "Electronic speed controller"},
                {"Motor Bearing Set", "MT-003", PartCategory.MOTOR, 20, 10, 180000, 150000, true, "Industrial Parts Co", "High precision bearings"},
                {"Starter Motor", "MT-004", PartCategory.MOTOR, 2, 5, 1800000, 1500000, true, "Motor Tech Vietnam", "Electric starter motor"},
                // Charger Parts
                {"Fast Charger 48V 5A", "CH-001", PartCategory.CHARGER, 12, 8, 890000, 750000, true, "VinFast Electronics", "Smart fast charger"},
                {"Charging Cable 3m", "CH-002", PartCategory.CHARGER, 30, 15, 120000, 90000, true, "Cable Solutions", "Heavy duty cable"},
                {"Charger Adapter", "CH-003", PartCategory.CHARGER, 18, 10, 85000, 65000, true, "VinFast Electronics", "Universal adapter"},
                // Brake Parts
                {"Disc Brake Pads Front", "BR-001", PartCategory.BRAKE, 45, 20, 180000, 140000, true, "Brake Masters", "Ceramic brake pads"},
                {"Disc Brake Pads Rear", "BR-002", PartCategory.BRAKE, 38, 20, 160000, 120000, true, "Brake Masters", "Ceramic rear pads"},
                {"Brake Disc Rotor 160mm", "BR-003", PartCategory.BRAKE, 22, 10, 250000, 200000, true, "Brake Masters", "Stainless steel rotor"},
                {"Brake Cable Set", "BR-004", PartCategory.BRAKE, 35, 15, 95000, 70000, true, "Cable Solutions", "Complete cable kit"},
                {"Hydraulic Brake Fluid", "BR-005", PartCategory.BRAKE, 50, 20, 65000, 45000, true, "Brake Masters", "DOT 4 brake fluid 250ml"},
                {"Brake Lever Left", "BR-006", PartCategory.BRAKE, 5, 10, 150000, 120000, true, "Brake Masters", "Left brake lever"},
                // Tire Parts
                {"Front Tire 90/90-12", "TR-001", PartCategory.TIRE, 28, 15, 450000, 380000, true, "Tire Masters", "Tubeless front tire"},
                {"Rear Tire 100/90-12", "TR-002", PartCategory.TIRE, 25, 15, 480000, 400000, true, "Tire Masters", "Tubeless rear tire"},
                {"Inner Tube 12 inch", "TR-003", PartCategory.TIRE, 40, 20, 85000, 65000, true, "Tire Masters", "Heavy duty inner tube"},
                {"Tire Valve Cap Set", "TR-004", PartCategory.TIRE, 100, 30, 15000, 10000, true, "General Parts", "Aluminum valve caps 4pcs"},
                // Light Parts
                {"LED Headlight Assembly", "LT-001", PartCategory.LIGHT, 18, 8, 650000, 520000, true, "LED Solutions", "High brightness LED"},
                {"Tail Light LED", "LT-002", PartCategory.LIGHT, 25, 10, 280000, 220000, true, "LED Solutions", "LED tail light"},
                {"Turn Signal Light Pair", "LT-003", PartCategory.LIGHT, 30, 12, 180000, 140000, true, "LED Solutions", "LED turn signals"},
                {"Light Bulb H4 LED", "LT-004", PartCategory.LIGHT, 50, 25, 120000, 90000, true, "LED Solutions", "Replacement LED bulb"},
                // Mirror Parts
                {"Rearview Mirror Left", "MR-001", PartCategory.MIRROR, 20, 10, 195000, 150000, true, "Mirror Co", "Left side mirror"},
                {"Rearview Mirror Right", "MR-002", PartCategory.MIRROR, 18, 10, 195000, 150000, true, "Mirror Co", "Right side mirror"},
                {"Mirror Glass Replacement", "MR-003", PartCategory.MIRROR, 35, 15, 65000, 45000, true, "Mirror Co", "Mirror glass only"},
                // Horn Parts
                {"Electric Horn 12V", "HR-001", PartCategory.HORN, 40, 20, 85000, 65000, true, "Horn Factory", "Loud electric horn 110dB"},
                {"Horn Button", "HR-002", PartCategory.HORN, 45, 20, 35000, 25000, true, "General Parts", "Horn button switch"},
                // Electrical Parts
                {"Wiring Harness Complete", "EL-001", PartCategory.ELECTRICAL, 8, 5, 1200000, 950000, true, "Electrical Systems", "Complete wiring kit"},
                {"Fuse Box Assembly", "EL-002", PartCategory.ELECTRICAL, 15, 8, 280000, 220000, true, "Electrical Systems", "Fuse box with fuses"},
                {"Ignition Switch", "EL-003", PartCategory.ELECTRICAL, 22, 10, 320000, 250000, true, "VinFast Parts", "Electronic ignition"},
                {"DC-DC Converter 48V-12V", "EL-004", PartCategory.ELECTRICAL, 10, 5, 450000, 360000, true, "VinFast Electronics", "Voltage converter"},
                {"Dashboard Display LCD", "EL-005", PartCategory.ELECTRICAL, 12, 5, 890000, 720000, true, "VinFast Electronics", "Digital LCD display"},
                {"Throttle Grip Assembly", "EL-006", PartCategory.ELECTRICAL, 25, 12, 280000, 220000, true, "VinFast Parts", "Electronic throttle"},
                {"Speed Sensor", "EL-007", PartCategory.ELECTRICAL, 30, 15, 150000, 120000, true, "VinFast Electronics", "Magnetic speed sensor"},
                {"Side Stand Switch", "EL-008", PartCategory.ELECTRICAL, 4, 10, 95000, 75000, true, "VinFast Parts", "Safety side stand switch"},
                {"USB Charging Port", "EL-009", PartCategory.ELECTRICAL, 0, 10, 220000, 180000, false, "VinFast Electronics", "USB port 5V 2A"},
                // Other Parts
                {"Seat Cushion", "OT-001", PartCategory.OTHER, 15, 8, 450000, 350000, true, "Comfort Seats", "Waterproof seat cushion"},
                {"Handlebar Grip Pair", "OT-002", PartCategory.OTHER, 50, 20, 95000, 70000, true, "General Parts", "Rubber handlebar grips"},
                {"Kickstand", "OT-003", PartCategory.OTHER, 28, 12, 180000, 140000, true, "General Parts", "Heavy duty kickstand"},
                {"Suspension Spring Front", "OT-004", PartCategory.OTHER, 20, 10, 320000, 250000, true, "Suspension Pro", "Front suspension spring"},
                {"Suspension Spring Rear", "OT-005", PartCategory.OTHER, 18, 10, 350000, 280000, true, "Suspension Pro", "Rear suspension spring"},
                {"Chain Guard", "OT-006", PartCategory.OTHER, 25, 12, 120000, 90000, true, "General Parts", "Plastic chain guard"},
                {"Footrest Rubber Pad", "OT-007", PartCategory.OTHER, 60, 25, 45000, 30000, true, "General Parts", "Rubber footrest 2pcs"},
                {"License Plate Holder", "OT-008", PartCategory.OTHER, 35, 15, 85000, 65000, true, "General Parts", "Adjustable holder"},
                {"Tool Kit Complete", "OT-009", PartCategory.OTHER, 12, 5, 280000, 220000, true, "Tool Master", "Complete maintenance kit"},
                {"Windshield Screen", "OT-010", PartCategory.OTHER, 0, 5, 650000, 520000, false, "General Parts", "Transparent windshield"}
        };

        // Inspection Tasks: {Category, Description, KmInterval}
        static final Object[][] INSPECTION_TASKS = {
                // BATTERY - Pin & Hệ thống điện
                {InspectionCategory.BATTERY, "Kiểm tra mức pin & dung lượng", KmInterval.ONE_THOUSAND},
                {InspectionCategory.BATTERY, "Kiểm tra cổng sạc, dây sạc", KmInterval.ONE_THOUSAND},
                {InspectionCategory.BATTERY, "Kiểm tra ECU / đèn lỗi cơ bản", KmInterval.FIVE_THOUSAND},
                {InspectionCategory.BATTERY, "Kiểm tra pin chi tiết, hiệu suất", KmInterval.TEN_THOUSAND},
                // MOTOR - Động cơ & truyền động
                {InspectionCategory.MOTOR, "Kiểm tra động cơ, rung ồn cơ bản", KmInterval.ONE_THOUSAND},
                {InspectionCategory.MOTOR, "Kiểm tra dây curoa / truyền động", KmInterval.ONE_THOUSAND},
                {InspectionCategory.MOTOR, "Kiểm tra phanh động cơ / bôi trơn dây curoa", KmInterval.FIVE_THOUSAND},
                {InspectionCategory.MOTOR, "Kiểm tra chi tiết động cơ, nhiệt độ, thay dây curoa nếu cần", KmInterval.TEN_THOUSAND},
                // BRAKE_SUSPENSION - Phanh & Hệ thống treo
                {InspectionCategory.BRAKE_SUSPENSION, "Kiểm tra phanh cơ bản, tay phanh", KmInterval.ONE_THOUSAND},
                {InspectionCategory.BRAKE_SUSPENSION, "Kiểm tra dầu phanh, hệ thống treo", KmInterval.FIVE_THOUSAND},
                {InspectionCategory.BRAKE_SUSPENSION, "Thay má phanh, dầu giảm xóc, kiểm tra giảm xóc tổng thể", KmInterval.TEN_THOUSAND},
                // WHEELS_TIRES - Bánh xe & lốp
                {InspectionCategory.WHEELS_TIRES, "Kiểm tra áp suất lốp", KmInterval.ONE_THOUSAND},
                {InspectionCategory.WHEELS_TIRES, "Kiểm tra độ mòn gai lốp", KmInterval.ONE_THOUSAND},
                {InspectionCategory.WHEELS_TIRES, "Kiểm tra vành, nan hoa", KmInterval.FIVE_THOUSAND},
                {InspectionCategory.WHEELS_TIRES, "Kiểm tra cân bằng bánh, thay lốp nếu mòn", KmInterval.TEN_THOUSAND},
                // FRAME_BODY - Khung & thân xe
                {InspectionCategory.FRAME_BODY, "Kiểm tra thân xe, ốc vít, gương, đèn", KmInterval.ONE_THOUSAND},
                {InspectionCategory.FRAME_BODY, "Kiểm tra khung, bảo vệ sườn", KmInterval.FIVE_THOUSAND},
                {InspectionCategory.FRAME_BODY, "Kiểm tra chi tiết khung, trầy xước nghiêm trọng", KmInterval.TEN_THOUSAND},
                // CONTROLS_SAFETY - Hệ thống điều khiển & an toàn
                {InspectionCategory.CONTROLS_SAFETY, "Kiểm tra tay ga, tay phanh, tay côn", KmInterval.ONE_THOUSAND},
                {InspectionCategory.CONTROLS_SAFETY, "Kiểm tra bảng đồng hồ, nút điều khiển, cảnh báo lỗi", KmInterval.ONE_THOUSAND},
                {InspectionCategory.CONTROLS_SAFETY, "Kiểm tra ABS (nếu có)", KmInterval.FIVE_THOUSAND},
                {InspectionCategory.CONTROLS_SAFETY, "Kiểm tra tổng thể hệ thống điều khiển & an toàn", KmInterval.TEN_THOUSAND}
        };
    }

    UserRepository userRepository;
    ElectricVehicleRepository electricVehicleRepository;
    CenterRepository centerRepository;
    ProvinceRepository provinceRepository;
    DistrictRepository districtRepository;
    WardRepository wardRepository;
    AddressRepository addressRepository;
    MaintenancePackageRepository maintenancePackageRepository;
    SparePartRepository sparePartRepository;
    InspectionTaskRepository inspectionTaskRepository;
    CustomerRepository customerRepository;
    BookingRepository bookingRepository;
    PaymentRepository paymentRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        initializeAddressAndCenter();
        initializeEmployees();
        initializeCustomers();
        initializeElectricVehicles();
        initializeMaintenancePackages();
        initializeSpareParts();
        initializeInspectionTasks();
        initializeSampleBookings(); // Add sample bookings for dashboard
    }

    void initializeEmployees() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // Create Admin
        for (Object[] data : InitData.ADMIN) {
            EmployeeEntity admin = EmployeeEntity.builder()
                    .fullName((String) data[0])
                    .role((Role) data[1])
                    .phone((String) data[2])
                    .email((String) data[3])
                    .password(encoder.encode((String) data[4]))
                    .status(UserStatus.ACTIVE)
                    .center(null) // Admin has no center
                    .workingStatus(WorkingStatus.AVAILABLE)
                    .build();
            userRepository.save(admin);
        }

        // Create Staff for each center
        for (Object[] data : InitData.STAFF) {
            Integer centerId = (Integer) data[5];
            EmployeeEntity staff = EmployeeEntity.builder()
                    .fullName((String) data[0])
                    .role((Role) data[1])
                    .phone((String) data[2])
                    .email((String) data[3])
                    .password(encoder.encode((String) data[4]))
                    .status(UserStatus.ACTIVE)
                    .center(centerRepository.findById(centerId).orElse(null))
                    .workingStatus(WorkingStatus.AVAILABLE)
                    .build();
            userRepository.save(staff);
        }

        // Create Technicians for each center
        for (Object[] data : InitData.TECHNICIANS) {
            Integer centerId = (Integer) data[5];
            EmployeeEntity technician = EmployeeEntity.builder()
                    .fullName((String) data[0])
                    .role((Role) data[1])
                    .phone((String) data[2])
                    .email((String) data[3])
                    .password(encoder.encode((String) data[4]))
                    .status(UserStatus.ACTIVE)
                    .center(centerRepository.findById(centerId).orElse(null))
                    .workingStatus(WorkingStatus.AVAILABLE)
                    .build();
            userRepository.save(technician);
        }
    }

    void initializeAddressAndCenter() {
        ProvinceEntity province = ProvinceEntity.builder()
                .provinceName(InitData.PROVINCE)
                .build();
        provinceRepository.save(province);

        for (int i = 0; i < InitData.DISTRICTS.length; i++) {
            DistrictEntity district = DistrictEntity.builder()
                    .districtName(InitData.DISTRICTS[i])
                    .province(province)
                    .build();
            districtRepository.save(district);

            WardEntity ward = WardEntity.builder()
                    .wardName(InitData.WARDS[i])
                    .district(district)
                    .build();
            wardRepository.save(ward);

            AddressEntity address = AddressEntity.builder()
                    .addressLine(InitData.ADDRESS_LINES[i])
                    .ward(ward)
                    .latitude(InitData.CENTER_COORDINATES[i][0])  // Set latitude
                    .longitude(InitData.CENTER_COORDINATES[i][1]) // Set longitude
                    .build();
            addressRepository.save(address);

            ServiceCenterEntity serviceCenter = ServiceCenterEntity.builder()
                    .centerName(InitData.CENTER_NAMES[i])
                    .centerPhone(InitData.CENTER_PHONES[i])
                    .centerAddress(address)
                    .startTime(InitData.START_TIME)
                    .endTime(InitData.END_TIME)
                    .maxCapacity(InitData.MAX_CAPACITY)
                    .build();
            centerRepository.save(serviceCenter);
        }
    }

    private void initializeCustomers() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        for (Object[] data : InitData.CUSTOMERS) {
            Integer addressId = (Integer) data[4];
            UserEntity customer = CustomerEntity.builder()
                    .fullName((String) data[0])
                    .role(Role.CUSTOMER)
                    .phone((String) data[1])
                    .email((String) data[2])
                    .password(encoder.encode((String) data[3]))
                    .status(UserStatus.ACTIVE)
                    .address(addressRepository.findById(addressId).orElse(null))
                    .build();
            userRepository.save(customer);
        }
    }

    void initializeElectricVehicles() {
        // Calculate customer ID offset (1 admin + 10 staff + 30 technicians = 41)
        int customerIdOffset = 41;

        for (Object[] data : InitData.VEHICLES) {
            String vin = (String) data[0];
            String licensePlate = (String) data[1];
            VehicleModel model = (VehicleModel) data[2];
            Integer customerIndex = (Integer) data[3]; // 1-based index in CUSTOMERS array
            LocalDate purchaseDate = (LocalDate) data[4];
            Integer warrantyYears = (Integer) data[5];
            Integer customerId = customerIdOffset + customerIndex;
            LocalDate warrantyEnd = purchaseDate.plusYears(warrantyYears);
            boolean isWarrantyValid = LocalDate.now().isBefore(warrantyEnd) || LocalDate.now().isEqual(warrantyEnd);

            // All vehicles have complete warranty information
            ElectricVehicleEntity vehicle = ElectricVehicleEntity.builder()
                    .vin(vin)
                    .licensePlate(licensePlate)
                    .model(model)
                    .owner(customerRepository.findById(customerId).orElse(null))
                    .maintenanceStatus(EvMaintenanceStatus.AVAILABLE)
                    .hasWarranty(isWarrantyValid)
                    .purchaseDate(purchaseDate)
                    .warrantyStartDate(purchaseDate)
                    .warrantyEndDate(warrantyEnd)
                    .warrantyYears(warrantyYears)
                    .build();

            electricVehicleRepository.save(vehicle);
        }
    }

    void initializeMaintenancePackages() {

        for (Object[] data : InitData.MAINTENANCE_PACKAGES) {
            MaintenancePackageEntity packageEntity = MaintenancePackageEntity.builder()
                    .offerType((OfferType) data[0])
                    .level((PackageLevel) data[1])
                    .packageName((String) data[2])
                    .description((String) data[3])
                    .price((Integer) data[4])
                    .durationMinutes((Integer) data[5])
                    .build();
            maintenancePackageRepository.save(packageEntity);
        }
    }

    void initializeSpareParts() {
        for (Object[] data : InitData.SPARE_PARTS) {
            SparePartEntity sparePart = SparePartEntity.builder()
                    .sparePartName((String) data[0])
                    .partNumber((String) data[1])
                    .category((PartCategory) data[2])
                    .center(centerRepository.findById(1).orElse(null))
                    .quantity((Integer) data[3])
                    .minimumStock((Integer) data[4])
                    .price((Integer) data[5])
                    .unitCost((Integer) data[6])
                    .status(SparePartStatus.ACTIVE)
                    .inStock((Boolean) data[7])
                    .supplier((String) data[8])
                    .offerType(OfferType.REPLACEMENT)
                    .description((String) data[9])
                    .build();
            sparePartRepository.save(sparePart);
        }
    }

    void initializeInspectionTasks() {
        for (Object[] data : InitData.INSPECTION_TASKS) {
            InspectionTaskEntity task = InspectionTaskEntity.builder()
                    .category((InspectionCategory) data[0])
                    .description((String) data[1])
                    .kmInterval((KmInterval) data[2])
                    .build();
            inspectionTaskRepository.save(task);
        }
    }

    void initializeSampleBookings() {
        Random random = new Random();
        int totalInserted = 0;

        // Loop through 5 centers, 50 bookings per center (250 total)
        for (int centerLoop = 1; centerLoop <= 5; centerLoop++) {
            ServiceCenterEntity center = centerRepository.findById(centerLoop).orElse(null);
            if (center == null) continue;

            // 50 bookings per center: 10 of each service type (5 types)
            for (int serviceLoop = 1; serviceLoop <= 50; serviceLoop++) {
                int vehicleId = ((serviceLoop - 1) % 10) + 1;
                ElectricVehicleEntity vehicle = electricVehicleRepository.findById(vehicleId).orElse(null);
                if (vehicle == null) continue;

                // Random date in November 2025
                LocalDate bookingDate = LocalDate.of(2025, 11, 1).plusDays(random.nextInt(30));
                LocalTime bookingTime = LocalTime.of(8 + random.nextInt(10), 0);

                String serviceName;
                String serviceDescription;
                long totalAmount;
                PaymentMethod paymentMethod;
                String vehicleModel;
                String notes;

                // Determine service type: 10 bookings per type (5 types × 10 = 50)
                // Type 1-10: Maintenance Level 3
                // Type 11-20: Maintenance Level 2
                // Type 21-30: Battery Pack
                // Type 31-40: Battery Management System
                // Type 41-50: Temperature Sensor
                if (serviceLoop <= 10) {
                    serviceName = "Bảo dưỡng cấp 3";
                    serviceDescription = "Gói bảo dưỡng mỗi 10000km";
                    totalAmount = 300000;
                    paymentMethod = PaymentMethod.VNPAY;
                    vehicleModel = "VinFast Evo 200";
                    notes = "Bảo dưỡng cấp 3 - 10000km";
                } else if (serviceLoop <= 20) {
                    serviceName = "Bảo dưỡng cấp 2";
                    serviceDescription = "Gói bảo dưỡng mỗi 5000km";
                    totalAmount = 250000;
                    paymentMethod = PaymentMethod.VNPAY;
                    vehicleModel = "VinFast Theon S";
                    notes = "Bảo dưỡng cấp 2 - 5000km";
                } else if (serviceLoop <= 30) {
                    serviceName = "Thay thế phụ tùng";
                    serviceDescription = "Battery Pack 48V 20Ah";
                    totalAmount = 3500000;
                    paymentMethod = PaymentMethod.VNPAY;
                    vehicleModel = "VinFast Feliz S";
                    notes = "Thay thế Battery Pack 48V 20Ah";
                } else if (serviceLoop <= 40) {
                    serviceName = "Thay thế phụ tùng";
                    serviceDescription = "Battery Management System";
                    totalAmount = 1200000;
                    paymentMethod = PaymentMethod.CASH;
                    vehicleModel = "VinFast Klara S";
                    notes = "Thay thế Battery Management System";
                } else {
                    serviceName = "Thay thế phụ tùng";
                    serviceDescription = "Battery Temperature Sensor";
                    totalAmount = 180000;
                    paymentMethod = PaymentMethod.CASH;
                    vehicleModel = "VinFast Ludo";
                    notes = "Thay thế Battery Temperature Sensor";
                }
                
                // Create and save booking entity
                BookingEntity booking = BookingEntity.builder()
                        .customerName("Khách hàng " + totalInserted)
                        .customerPhone(String.format("090%07d", 1000000 + totalInserted))
                        .customerEmail("customer" + totalInserted + "@test.com")
                        .vehicle(vehicle)
                        .center(center)
                        .bookingDate(bookingDate)
                        .bookingTime(bookingTime)
                        .status(BookingStatus.COMPLETED)
                        .notes(notes)
                        .createdAt(LocalDateTime.now())
                        .build();

                BookingEntity savedBooking = bookingRepository.save(booking);

                // Create and save payment entity
                String licensePlate = String.format("%dMD%05d", 49 + (serviceLoop % 5), totalInserted);
                LocalDateTime paymentDate = LocalDateTime.of(bookingDate, bookingTime).plusHours(2);

                PaymentEntity payment = PaymentEntity.builder()
                        .booking(savedBooking)
                        .invoiceNumber(String.format("INV%06d", totalInserted))
                        .customerName(savedBooking.getCustomerName())
                        .customerPhone(savedBooking.getCustomerPhone())
                        .customerEmail(savedBooking.getCustomerEmail())
                        .vehicleInfo(vehicleModel)
                        .licensePlate(licensePlate)
                        .serviceName(serviceName)
                        .serviceDescription(serviceDescription)
                        .totalAmount((double) totalAmount)
                        .discountAmount(0.0)
                        .finalAmount((double) totalAmount)
                        .paymentStatus(PaymentStatus.COMPLETED)
                        .paymentMethod(paymentMethod)
                        .paymentDate(paymentDate)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();

                paymentRepository.save(payment);
                totalInserted++;
            }
        }

        System.out.println("✅ Successfully initialized " + totalInserted + " sample bookings and payments!");
    }
}
