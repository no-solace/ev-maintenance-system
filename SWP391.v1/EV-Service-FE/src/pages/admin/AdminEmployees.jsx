import { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiShield, FiEye, FiX, FiMail, FiPhone, FiMapPin, FiBriefcase } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { userService } from '../../services/userService';

const AdminEmployees = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const result = await userService.getAllEmployees();
      if (result.success) {
        setEmployees(result.data || []);
      } else {
        toast.error(result.error);
        setEmployees([]);
      }
    } catch (error) {
      toast.error('Không thể tải danh sách nhân viên');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      (emp.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.phone || '').includes(searchQuery);
    const matchesRole = selectedRole === 'all' || emp.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const config = {
      ADMIN: { label: 'Quản trị viên', className: 'bg-red-100 text-red-700' },
      STAFF: { label: 'Nhân viên', className: 'bg-blue-100 text-blue-700' },
      TECHNICIAN: { label: 'Kỹ thuật viên', className: 'bg-green-100 text-green-700' }
    };
    const c = config[role] || config.STAFF;
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${c.className}`}>{c.label}</span>;
  };

  const stats = {
    total: employees.length,
    admin: employees.filter(e => e.role === 'ADMIN').length,
    staff: employees.filter(e => e.role === 'STAFF').length,
    technician: employees.filter(e => e.role === 'TECHNICIAN').length
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
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="all">Tất cả vai trò</option>
          <option value="ADMIN">Quản trị viên</option>
          <option value="STAFF">Nhân viên</option>
          <option value="TECHNICIAN">Kỹ thuật viên</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng nhân viên</p>
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
                <p className="text-sm text-gray-600">Quản trị viên</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.admin}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FiShield className="text-2xl text-red-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nhân viên</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.staff}</p>
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
                <p className="text-sm text-gray-600">Kỹ thuật viên</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.technician}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiShield className="text-2xl text-green-600" />
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
          ) : filteredEmployees.length === 0 ? (
            <div className="p-12 text-center">
              <FiUsers className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500">Không tìm thấy nhân viên</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân viên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liên hệ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trung tâm</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.employeeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                          <div className="text-sm text-gray-500">ID: #{emp.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{emp.email}</div>
                        <div className="text-sm text-gray-500">{emp.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(emp.role)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {emp.centerName || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(emp)}
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
      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Chi tiết nhân viên</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl mr-4">
                  {(selectedEmployee.name || 'E').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedEmployee.name}</h3>
                  <p className="text-gray-500">ID: #{selectedEmployee.employeeId}</p>
                  <div className="mt-2">{getRoleBadge(selectedEmployee.role)}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <FiMail className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedEmployee.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiPhone className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="text-gray-900">{selectedEmployee.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiMapPin className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="text-gray-900">{selectedEmployee.address || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FiBriefcase className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Trung tâm làm việc</p>
                    <p className="text-gray-900">{selectedEmployee.centerName || 'Chưa phân công'}</p>
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

export default AdminEmployees;
