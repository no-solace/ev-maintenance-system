import { useState, useEffect } from 'react';
import { 
  FiUsers, FiSearch, FiCalendar, FiLoader
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import bookingService from '../../services/bookingService';
import customerService from '../../services/customerService';

const StaffCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  // Fetch all bookings and extract customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Fetch both customers and bookings
      const [customersResponse, bookingsResponse] = await Promise.all([
        customerService.getAllCustomers(),
        bookingService.getAllBookings()
      ]);
      
      if (customersResponse.success && customersResponse.data) {
        const bookings = bookingsResponse.success ? bookingsResponse.data : [];
        
        // Map customers with their booking data
        const customersWithData = customersResponse.data.map(customer => {
          // Find all bookings for this customer
          const customerBookings = bookings.filter(b => 
            b.customerPhone === customer.phone || b.customerEmail === customer.email
          );
          
          // Calculate stats
          const upcomingBookings = customerBookings.filter(
            b => b.status === 'UPCOMING' || b.status === 'PENDING_PAYMENT'
          ).length;
          
          // Use vehicles from CustomerDTO (already includes all customer's vehicles)
          const vehicles = customer.vehicles?.map(v => ({
            make: 'VinFast',
            model: v.model || 'Unknown',
            year: new Date().getFullYear(),
            plate: v.licensePlate || 'N/A'
          })) || [];
          
          return {
            id: customer.id,
            name: customer.fullName || 'Unknown',
            email: customer.email || 'N/A',
            phone: customer.phone || 'N/A',
            address: customer.address || 'N/A',
            status: customer.status?.toLowerCase() || 'active',
            totalServices: customerBookings.length,
            upcomingBookings,
            vehicles,
            bookings: customerBookings
          };
        });
        
        setCustomers(customersWithData);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    withVehicles: customers.filter(c => c.vehicles && c.vehicles.length > 0).length,
    upcomingAppointments: customers.reduce((sum, c) => sum + c.upcomingBookings, 0)
  };

  // dua tren tim kiem cua khach hang
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      (customer.vehiclePlate && customer.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'active') return matchesSearch && customer.status === 'active';
    if (filterType === 'withVehicles') return matchesSearch && customer.vehicles && customer.vehicles.length > 0;
    
    return matchesSearch;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'services') return b.totalServices - a.totalServices;
    return 0;
  });

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Danh Sách Khách Hàng</h1>
        <p className="text-gray-600 mt-1">Quản lý thông tin và giao tiếp với khách hàng</p>
      </div>
      <Card className="mb-6">
        <Card.Content className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng theo tên, email hoặc số điện thoại..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white cursor-pointer hover:border-gray-300 transition-colors"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tất cả khách hàng</option>
              <option value="active">Đang hoạt động</option>
              <option value="withVehicles">Có xe</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white cursor-pointer hover:border-gray-300 transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Tên</option>
              <option value="services">Số dịch vụ</option>
            </select>
          </div>
        </Card.Content>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <p className="text-sm text-gray-600 mb-2">Tổng khách hàng</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <p className="text-sm text-gray-600 mb-2">Đang hoạt động</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activeCustomers}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <p className="text-sm text-gray-600 mb-2">Có xe</p>
            <p className="text-3xl font-bold text-gray-900">{stats.withVehicles}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <p className="text-sm text-gray-600 mb-2">Lịch hẹn sắp tới</p>
            <p className="text-3xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
          </Card.Content>
        </Card>
      </div>
      {loading ? (
        <Card>
          <Card.Content className="p-12 text-center">
            <FiLoader className="mx-auto text-5xl text-teal-600 mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải danh sách khách hàng...</h3>
            <p className="text-gray-500">Vui lòng đợi</p>
          </Card.Content>
        </Card>
      ) : sortedCustomers.length === 0 ? (
        <Card>
          <Card.Content className="p-12 text-center">
            <FiUsers className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy khách hàng</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterType !== 'all' 
                ? 'Không có khách hàng nào phù hợp với tiêu chí tìm kiếm'
                : 'Chưa có khách hàng nào có lịch hẹn'}
            </p>
            {!searchQuery && filterType === 'all' && (
              <Button
                variant="outline"
                icon={<FiCalendar />}
                onClick={() => window.location.href = '/staff/appointments'}
              >
                Tạo lịch hẹn đầu tiên
              </Button>
            )}
          </Card.Content>
        </Card>
      ) : (
        <Card>
          <Card.Content className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Xe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.phone}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4" style={{ minWidth: '200px' }}>
                        {customer.vehicles && customer.vehicles.length > 0 ? (
                          <div>
                            {customer.vehicles.map((vehicle, index) => (
                              <div key={index} className={index > 0 ? 'mt-1.5' : ''}>
                                <span className="text-sm font-medium text-gray-900">{vehicle.plate}</span>
                                <span className="text-sm text-gray-500"> ({vehicle.model})</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Chưa có xe</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.totalServices}</div>
                        {customer.upcomingBookings > 0 && (
                          <div className="text-xs text-teal-600">{customer.upcomingBookings} sắp tới</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          customer.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default StaffCustomers;