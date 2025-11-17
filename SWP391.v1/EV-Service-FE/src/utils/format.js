import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
//tien vnd
export const formatCurrency = (amount) => {
  if (!amount) return '0 ₫';
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
  
  return formatted;
};
//ngay thang nam
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  let dateObj;
  if (typeof date === 'string') {
    // Handle dd-MM-yyyy format from backend
    if (date.includes('-') && date.split('-')[0].length === 2) {
      const [day, month, year] = date.split('-');
      dateObj = new Date(`${year}-${month}-${day}`);
    } else {
      // Handle ISO format YYYY-MM-DD
      dateObj = parseISO(date);
    }
  } else {
    dateObj = date;
  }
  
  return format(dateObj, formatStr, { locale: vi });
};
//thoigian
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { locale: vi, addSuffix: true });
};
//sdt vn
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
};
//bien so xe
export const formatLicensePlate = (plate) => {
  if (!plate) return '';
  const upperPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (upperPlate.length === 8) {
    return `${upperPlate.slice(0, 3)}-${upperPlate.slice(3, 6)}.${upperPlate.slice(6)}`;
  } else if (upperPlate.length === 9) {
    return `${upperPlate.slice(0, 4)}-${upperPlate.slice(4, 7)}.${upperPlate.slice(7)}`;
  }
  return plate;
};
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
//lay chu cai dau tien
export const getInitials = (name) => {
  if (!name) return '';  
  const words = name.split(' ');
  const initials = words.map(word => word[0]).join('');  
  return initials.slice(0, 2).toUpperCase();
};