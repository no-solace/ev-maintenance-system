import { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiEye, FiX, FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';

const AdminCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const result = await userService.getAllCustomers();
      if (result.success) {
        setCustomers(result.data || []);
      } else {
        toast.error(result.error);
        setCustomers([]);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách khách hàng');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const filteredCustomers = customers.filter(customer =>
    (customer.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.phone || '').includes(searchQuery)
  );

  const stats = {
    total: customers.length,
    withPhone: customers.filter(c => c.phone).length,
    withAddress: customers.filter(c => c.address).length
  };

  return (
    <div>
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng khách hàng</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiUsers className="text-2xl text-blue-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Có số điện thoại</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.withPhone}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiPhone className="text-2xl text-green-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Có địa chỉ</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.withAddress}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiMapPin className="text-2xl text-purple-600" />
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>

      <Card>
        <Card.Content className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin mx-auto h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-12 text-center">
              <FiUsers className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500">Không tìm thấy khách hàng</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liên hệ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.fullName}</div>
                          <div className="text-sm text-gray-500">ID: #{customer.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {customer.address || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(customer)}
                          >
                            <FiEye className="mr-1" />
                            Chi tiết
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Chi tiết khách hàng</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl mr-4">
                  {(selectedCustomer.fullName || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedCustomer.fullName}</h3>
                  <p className="text-gray-500">ID: #{selectedCustomer.id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <FiMail className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedCustomer.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiPhone className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="text-gray-900">{selectedCustomer.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMapPin className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="text-gray-900">{selectedCustomer.address || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiCalendar className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày tạo tài khoản</p>
                    <p className="text-gray-900">
                      {selectedCustomer.createdAt 
                        ? new Date(selectedCustomer.createdAt).toLocaleDateString('vi-VN')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
