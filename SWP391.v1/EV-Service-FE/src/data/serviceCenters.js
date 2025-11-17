// Danh sách trung tâm dịch vụ VinFast
// export const serviceCenters = [
//   {
//     id: 1,
//     name: 'VinFast Service Center Quận 1',
//     address: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
//     phone: '028 1234 5678',
//     lat: 10.7769,
//     lng: 106.7009,
//     district: 'Quận 1',
//     city: 'TP.HCM',
//     openTime: '08:00',
//     closeTime: '18:00',
//     workingDays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
//     services: ['maintenance', 'repair', 'parts', 'emergency'],
//     technicians: 5,
//     rating: 4.8,
//     distance: null // Will be calculated based on user location
//   },
//   {
//     id: 2,
//     name: 'VinFast Service Center Quận 7',
//     address: '456 Nguyễn Văn Linh, Phường Tân Hưng, Quận 7, TP.HCM',
//     phone: '028 2345 6789',
//     lat: 10.7340,
//     lng: 106.7220,
//     district: 'Quận 7',
//     city: 'TP.HCM',
//     openTime: '08:00',
//     closeTime: '19:00',
//     workingDays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
//     services: ['maintenance', 'repair', 'parts', 'emergency'],
//     technicians: 8,
//     rating: 4.9,
//     distance: null
//   },
//   {
//     id: 3,
//     name: 'VinFast Service Center Thủ Đức',
//     address: '789 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP.HCM',
//     phone: '028 3456 7890',
//     lat: 10.8507,
//     lng: 106.7720,
//     district: 'TP. Thủ Đức',
//     city: 'TP.HCM',
//     openTime: '07:30',
//     closeTime: '18:30',
//     workingDays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
//     services: ['maintenance', 'repair', 'parts'],
//     technicians: 6,
//     rating: 4.7,
//     distance: null
//   },
//   {
//     id: 4,
//     name: 'VinFast Service Center Gò Vấp',
//     address: '321 Phan Văn Trị, Phường 5, Quận Gò Vấp, TP.HCM',
//     phone: '028 4567 8901',
//     lat: 10.8162,
//     lng: 106.6870,
//     district: 'Quận Gò Vấp',
//     city: 'TP.HCM',
//     openTime: '08:00',
//     closeTime: '18:00',
//     workingDays: ['T2', 'T3', 'T4', 'T5', 'T6'],
//     services: ['maintenance', 'repair', 'parts'],
//     technicians: 4,
//     rating: 4.6,
//     distance: null
//   },
//   {
//     id: 5,
//     name: 'VinFast Service Center Bình Thạnh',
//     address: '654 Xô Viết Nghệ Tĩnh, Phường 25, Quận Bình Thạnh, TP.HCM',
//     phone: '028 5678 9012',
//     lat: 10.8013,
//     lng: 106.7104,
//     district: 'Quận Bình Thạnh',
//     city: 'TP.HCM',
//     openTime: '08:00',
//     closeTime: '19:00',
//     workingDays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
//     services: ['maintenance', 'repair', 'parts', 'emergency'],
//     technicians: 7,
//     rating: 4.8,
//     distance: null
//   }
// ];

// Danh sách xe máy điện VinFast
export const vinfastModels = [
  { id: 'klara-s', name: 'Klara S', type: 'electric', batteryCapacity: '3.5 kWh' },
  { id: 'feliz-s', name: 'Feliz S', type: 'electric', batteryCapacity: '3.5 kWh' },
  { id: 'vento-s', name: 'Vento S', type: 'electric', batteryCapacity: '3.5 kWh' },
  { id: 'theon-s', name: 'Theon S', type: 'electric', batteryCapacity: '3.5 kWh' },
  { id: 'evo200', name: 'Evo 200', type: 'electric', batteryCapacity: '2.5 kWh' },
  { id: 'evo200-lite', name: 'Evo 200 Lite', type: 'electric', batteryCapacity: '2.5 kWh' },
  { id: 'impes', name: 'Impes', type: 'electric', batteryCapacity: '2.0 kWh' },
  { id: 'ludo', name: 'Ludo', type: 'electric', batteryCapacity: '1.8 kWh' },
  { id: 'klara-a2', name: 'Klara A2', type: 'electric', batteryCapacity: '2.5 kWh' }
];

// Danh sách dịch vụ chi tiết
export const serviceDetails = {
  maintenance: {
    id: 'maintenance',
    name: 'Bảo dưỡng định kỳ',
    description: 'Bảo dưỡng toàn diện xe máy điện theo tiêu chuẩn VinFast',
    icon: '🔧',
    packages: [] // Will be fetched from backend API
  },
  parts: {
    id: 'parts',
    name: 'Thay thế phụ tùng',
    description: 'Thay thế phụ tùng chính hãng VinFast',
    icon: '🔩',
    requiresInventoryCheck: true,
    commonParts: [
      { id: 'brake-pad', name: 'Má phanh', price: 250000, inStock: true },
      { id: 'tire', name: 'Lốp xe', price: 450000, inStock: true },
      { id: 'battery-charger', name: 'Bộ sạc pin', price: 1500000, inStock: true },
      { id: 'headlight', name: 'Đèn pha', price: 350000, inStock: true },
      { id: 'mirror', name: 'Gương chiếu hậu', price: 150000, inStock: true },
      { id: 'horn', name: 'Còi xe', price: 120000, inStock: false },
      { id: 'brake-fluid', name: 'Dầu phanh', price: 80000, inStock: true }
    ]
  },
  repair: {
    id: 'repair',
    name: 'Sửa chữa',
    description: 'Sửa chữa các vấn đề kỹ thuật',
    icon: '🛠️',
    requiresDescription: true,
    commonIssues: [
      'Xe không khởi động được',
      'Pin sạc không vào',
      'Phanh không ăn',
      'Đèn không sáng',
      'Còi không kêu',
      'Xe chạy yếu',
      'Tiếng kêu lạ khi vận hành',
      'Khác'
    ]
  }
};

// Khung giờ làm việc
export const timeSlots = [
  { time: '08:00', available: true },
  { time: '08:30', available: true },
  { time: '09:00', available: true },
  { time: '09:30', available: true },
  { time: '10:00', available: true },
  { time: '10:30', available: true },
  { time: '11:00', available: true },
  { time: '11:30', available: false },
  { time: '13:00', available: true },
  { time: '13:30', available: true },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: true },
  { time: '16:00', available: false },
  { time: '16:30', available: true },
  { time: '17:00', available: true },
  { time: '17:30', available: true }
];

// Calculate distance between two points
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return Math.round(d * 10) / 10;
};
