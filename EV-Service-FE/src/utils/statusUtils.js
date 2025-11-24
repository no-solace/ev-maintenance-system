
export const getReceptionStatusConfig = (status) => {
  const statusMap = {
    'RECEIVED': { 
      label: 'Chờ giao việc', 
      color: 'bg-blue-100 text-blue-700' 
    },
    'ASSIGNED': { 
      label: 'Đã giao việc', 
      color: 'bg-purple-100 text-purple-700' 
    },
    'IN_PROGRESS': { 
      label: 'Đang tiến hành', 
      color: 'bg-yellow-100 text-yellow-700' 
    },
    'COMPLETED': { 
      label: 'Hoàn tất', 
      color: 'bg-green-100 text-green-700' 
    },
    'PAID': { 
      label: 'Đã thanh toán', 
      color: 'bg-teal-100 text-teal-700' 
    }
  };
  
  return statusMap[status] || { 
    label: status, 
    color: 'bg-gray-100 text-gray-700' 
  };
};
// For dropdown options
export const getReceptionStatusOptions = () => {
  return [
    { value: 'RECEIVED', label: 'Chờ giao việc' },
    { value: 'ASSIGNED', label: 'Đã giao việc' },
    { value: 'IN_PROGRESS', label: 'Đang tiến hành' },
    { value: 'COMPLETED', label: 'Hoàn tất' },
    { value: 'PAID', label: 'Đã thanh toán' }
  ];
};
