package com.swp.evmsystem.config;

import com.swp.evmsystem.entity.*;
import com.swp.evmsystem.enums.*;
import com.swp.evmsystem.repository.*;
import com.swp.evmsystem.service.*;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DataInitializer implements CommandLineRunner {

    // ==================== CENTRALIZED DATA STORAGE ====================

    static class InitData {
        // Employee Data
        static final String[][] EMPLOYEES = {
                {"Admin", "ADMIN", "0123456789", "dinhdinhchibao@gmail.com", "admin123"},
                {"Nguyễn Ngoại Ngữ", "STAFF", "0987654321", "ddinhchibao@gmail.com", "staff123"},
                {"Trần Văn Trọng", "TECHNICIAN", "0111222333", "zzz.dinhchibao.15@gmail.com", "tech123"},
                {"Dương Văn Quá", "TECHNICIAN", "0999888777", "technician2@evservice.com", "tech123"},
                {"Kim Văn Dung", "TECHNICIAN", "0888777666", "technician3@evservice.com", "tech123"}
        };

        // Customer Data
        static final String[][] CUSTOMERS = {
                {"Vegeta", "0905111111", "quangphap931@gmail.com", "user123"},
                {"Songoku", "0905222222", "baodcse184280@fpt.edu.vn", "user123"}
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

        // EV Model Data
        static final String[] MODEL_NAMES = {
                "Klara S (3.5 kWh)", "Feliz S (3.5 kWh)", "Vento S (3.5 kWh)",
                "Theon S (3.5 kWh)", "Evo 200 (2.5 kWh)", "Evo 200 Lite (2.5 kWh)",
                "Impes (2.0 kWh)", "Ludo (1.8 kWh)", "Klara A2 (2.5 kWh)"
        };

        // Vehicle Data
        static final String[] VINS = {"FAKEVIN0000000000", "TESTVIN0000000000", "PLACEHOLDER000000"};
        static final String[] LICENSE_PLATES = {"49MĐ685692", "59MĐ102563", "59MĐ155567"};

        // Offer Type Data
        static final String[][] OFFER_TYPES = {
                {"Bảo dưỡng định kỳ", "Bảo dưỡng toàn diện xe máy điện theo tiêu chuẩn VinFast"},
                {"Thay thế phụ tùng", "Thay thế phụ tùng chính hãng VinFast"},
                {"Sửa chữa", "Sửa chữa các vấn đề kỹ thuật"}
        };

        // Maintenance Package Data
        static final Object[][] MAINTENANCE_PACKAGES = {
                {"Gói cơ bản", 150000, 30, "Bảo dưỡng cơ bản cho xe máy điện",
                        "Kiểm tra hệ thống điện|Kiểm tra phanh|Kiểm tra lốp và áp suất|Kiểm tra đèn và còi|Vệ sinh xe cơ bản"},
                {"Gói nâng cao", 350000, 45, "Bảo dưỡng toàn diện cho xe máy điện",
                        "Tất cả dịch vụ gói cơ bản|Kiểm tra chi tiết pin|Kiểm tra động cơ điện|Kiểm tra hệ thống làm mát|Thay dầu phanh (nếu cần)|Cân chỉnh bánh xe|Vệ sinh xe chuyên sâu|Kiểm tra phần mềm và cập nhật"}
        };

        // Issue Data for Repair
        static final String[][] REPAIR_ISSUES = {
                {"Xe không khởi động được", "Xe không phản hồi khi bật nút nguồn"},
                {"Pin sạc không vào", "Cắm sạc nhưng không tăng dung lượng"},
                {"Phanh không ăn", "Hiệu quả phanh kém hoặc mất phanh"},
                {"Đèn không sáng", "Đèn pha/đèn hậu không hoạt động"},
                {"Còi không kêu", "Còi không phát ra âm thanh"},
                {"Xe chạy yếu", "Gia tốc chậm, công suất giảm"},
                {"Tiếng kêu lạ khi vận hành", "Âm thanh bất thường từ động cơ hoặc truyền động"},
                {"Khác", "Vấn đề khác"}
        };

        // Issue Data for Part Replacement
        static final String[] REPLACEMENT_ISSUES = {
                "Thay má phanh", "Thay lốp", "Thay đèn", "Thay còi"
        };

        // Issue Data for Maintenance
        static final String[] MAINTENANCE_ISSUES = {
                "Bảo dưỡng định kỳ 3.000km", "Bảo dưỡng tổng quát"
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
    }

    // ==================== REPOSITORY DEPENDENCIES ====================

    @Autowired UserRepository userRepository;
    @Autowired ElectricVehicleRepository electricVehicleRepository;
    @Autowired ServiceCenterRepository serviceCenterRepository;
    @Autowired ProvinceRepository provinceRepository;
    @Autowired DistrictRepository districtRepository;
    @Autowired WardRepository wardRepository;
    @Autowired AddressRepository addressRepository;
    @Autowired EvModelRepository evModelRepository;
    @Autowired OfferTypeRepository offerTypeRepository;
    @Autowired MaintenancePackageRepository maintenancePackageRepository;
    @Autowired IssueRepository issueRepository;
    @Autowired SparePartRepository sparePartRepository;

    // ==================== MAIN RUNNER ====================

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        AddressEntity[] customerAddresses = initializeLocationData();
        CustomerEntity[] customers = initializeCustomers(customerAddresses);
        List<EvModelEntity> models = initializeEvModels();
        initializeElectricVehicles(models, customers);
        OfferTypeEntity maintenanceOfferType = initializeOfferTypes();
        initializeMaintenancePackages(maintenanceOfferType);
        initializeIssues();
        initializeSpareParts();
        initializeUsers();
    }

    // ==================== INITIALIZATION METHODS ====================

    private void initializeUsers() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        for (String[] data : InitData.EMPLOYEES) {
            UserEntity employee = EmployeeEntity.builder()
                    .fullName(data[0])
                    .role(Role.valueOf(data[1]))
                    .phone(data[2])
                    .email(data[3])
                    .password(encoder.encode(data[4]))
                    .status(UserStatus.ACTIVE)
                    .center(serviceCenterRepository.findById(1).orElse(null))
                    .workingStatus(WorkingStatus.AVAILABLE)
                    .build();
            userRepository.save(employee);
        }
    }

    private AddressEntity[] initializeLocationData() {
        ProvinceEntity province = ProvinceEntity.builder()
                .provinceName(InitData.PROVINCE)
                .build();
        provinceRepository.save(province);

        AddressEntity[] customerAddresses = new AddressEntity[2];

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
                    .build();
            addressRepository.save(address);

            if (i < 2) {
                customerAddresses[i] = address;
            }

            ServiceCenterEntity serviceCenter = ServiceCenterEntity.builder()
                    .centerName(InitData.CENTER_NAMES[i])
                    .centerPhone(InitData.CENTER_PHONES[i])
                    .centerAddress(address)
                    .startTime(InitData.START_TIME)
                    .endTime(InitData.END_TIME)
                    .maxCapacity(InitData.MAX_CAPACITY)
                    .build();
            serviceCenterRepository.save(serviceCenter);
        }

        return customerAddresses;
    }

    private CustomerEntity[] initializeCustomers(AddressEntity[] addresses) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        CustomerEntity[] customers = new CustomerEntity[InitData.CUSTOMERS.length];

        for (int i = 0; i < InitData.CUSTOMERS.length; i++) {
            String[] data = InitData.CUSTOMERS[i];
            UserEntity customer = CustomerEntity.builder()
                    .fullName(data[0])
                    .role(Role.CUSTOMER)
                    .phone(data[1])
                    .email(data[2])
                    .password(encoder.encode(data[3]))
                    .status(UserStatus.ACTIVE)
                    .address(addresses[i])
                    .build();
            userRepository.save(customer);
            customers[i] = (CustomerEntity) customer;
        }

        return customers;
    }

    private List<EvModelEntity> initializeEvModels() {
        List<EvModelEntity> models = new ArrayList<>();

        for (String name : InitData.MODEL_NAMES) {
            EvModelEntity model = EvModelEntity.builder()
                    .modelName(name)
                    .manufacturer("VinFast")
                    .build();
            models.add(evModelRepository.save(model));
        }

        return models;
    }

    private void initializeElectricVehicles(List<EvModelEntity> models, CustomerEntity[] customers) {
        if (models.isEmpty()) return;

        // Customer 1 - Vehicle 1 (With Warranty)
        LocalDate purchaseDate1 = LocalDate.now().minusMonths(6);
        LocalDate warrantyEnd1 = purchaseDate1.plusYears(2);

        ElectricVehicleEntity vehicle1 = ElectricVehicleEntity.builder()
                .vin(InitData.VINS[0])
                .licensePlate(InitData.LICENSE_PLATES[0])
                .model(models.get(4))
                .owner(customers[0])
                .maintenanceStatus(EvMaintenanceStatus.AVAILABLE)
                .hasWarranty(LocalDate.now().isBefore(warrantyEnd1) || LocalDate.now().isEqual(warrantyEnd1))
                .purchaseDate(purchaseDate1)
                .warrantyStartDate(purchaseDate1)
                .warrantyEndDate(warrantyEnd1)
                .warrantyYears(2)
                .build();
        electricVehicleRepository.save(vehicle1);

        // Customer 1 - Vehicle 2 (Warranty Expired)
        LocalDate purchaseDate2 = LocalDate.of(2022, 9, 12);
        LocalDate warrantyEnd2 = purchaseDate2.plusYears(2);

        ElectricVehicleEntity vehicle2 = ElectricVehicleEntity.builder()
                .vin(InitData.VINS[1])
                .licensePlate(InitData.LICENSE_PLATES[1])
                .model(models.get(5))
                .owner(customers[0])
                .maintenanceStatus(EvMaintenanceStatus.AVAILABLE)
                .hasWarranty(LocalDate.now().isBefore(warrantyEnd2) || LocalDate.now().isEqual(warrantyEnd2))
                .purchaseDate(purchaseDate2)
                .warrantyStartDate(purchaseDate2)
                .warrantyEndDate(warrantyEnd2)
                .warrantyYears(2)
                .build();
        electricVehicleRepository.save(vehicle2);

        // Customer 2 - Vehicle (No Warranty)
        ElectricVehicleEntity vehicle3 = ElectricVehicleEntity.builder()
                .vin(InitData.VINS[2])
                .licensePlate(InitData.LICENSE_PLATES[2])
                .model(models.get(2))
                .owner(customers[1])
                .maintenanceStatus(EvMaintenanceStatus.AVAILABLE)
                .hasWarranty(false)
                .build();
        electricVehicleRepository.save(vehicle3);
    }

    private OfferTypeEntity initializeOfferTypes() {
        OfferTypeEntity maintenanceOfferType = null;

        for (int i = 0; i < InitData.OFFER_TYPES.length; i++) {
            String[] data = InitData.OFFER_TYPES[i];
            OfferTypeEntity offerType = OfferTypeEntity.builder()
                    .offerTypeName(data[0])
                    .offerTypeDescription(data[1])
                    .build();
            offerType = offerTypeRepository.save(offerType);

            if (i == 0) {
                maintenanceOfferType = offerType;
            }
        }

        return maintenanceOfferType;
    }

    private void initializeMaintenancePackages(OfferTypeEntity maintenanceOfferType) {
        if (maintenanceOfferType == null) return;

        for (Object[] data : InitData.MAINTENANCE_PACKAGES) {
            MaintenancePackageEntity packageEntity = MaintenancePackageEntity.builder()
                    .packageName((String) data[0])
                    .price((Integer) data[1])
                    .durationMinutes((Integer) data[2])
                    .description((String) data[3])
                    .includes((String) data[4])
                    .offerType(maintenanceOfferType)
                    .build();
            maintenancePackageRepository.save(packageEntity);
        }
    }

    private void initializeIssues() {
        List<OfferTypeEntity> offerTypes = offerTypeRepository.findAll();

        OfferTypeEntity maintenance = offerTypes.stream()
                .filter(o -> o.getOfferTypeName().equals("Bảo dưỡng định kỳ"))
                .findFirst().orElse(null);

        OfferTypeEntity replacement = offerTypes.stream()
                .filter(o -> o.getOfferTypeName().equals("Thay thế phụ tùng"))
                .findFirst().orElse(null);

        OfferTypeEntity repair = offerTypes.stream()
                .filter(o -> o.getOfferTypeName().equals("Sửa chữa"))
                .findFirst().orElse(null);

        // Repair Issues
        if (repair != null) {
            for (String[] data : InitData.REPAIR_ISSUES) {
                IssueEntity issue = IssueEntity.builder()
                        .issueName(data[0])
                        .description(data[1])
                        .offerType(repair)
                        .build();
                issueRepository.save(issue);
            }
        }

        // Replacement Issues
        if (replacement != null) {
            for (String name : InitData.REPLACEMENT_ISSUES) {
                IssueEntity issue = IssueEntity.builder()
                        .issueName(name)
                        .offerType(replacement)
                        .build();
                issueRepository.save(issue);
            }
        }

        // Maintenance Issues
        if (maintenance != null) {
            for (String name : InitData.MAINTENANCE_ISSUES) {
                IssueEntity issue = IssueEntity.builder()
                        .issueName(name)
                        .offerType(maintenance)
                        .build();
                issueRepository.save(issue);
            }
        }
    }

    private void initializeSpareParts() {
        for (Object[] data : InitData.SPARE_PARTS) {
            SparePartEntity sparePart = SparePartEntity.builder()
                    .sparePartName((String) data[0])
                    .partNumber((String) data[1])
                    .category((PartCategory) data[2])
                    .center(serviceCenterRepository.findById(1).orElse(null))
                    .quantity((Integer) data[3])
                    .minimumStock((Integer) data[4])
                    .price((Integer) data[5])
                    .unitCost((Integer) data[6])
                    .inStock((Boolean) data[7])
                    .supplier((String) data[8])
                    .description((String) data[9])
                    .build();
            sparePartRepository.save(sparePart);
        }
    }
}