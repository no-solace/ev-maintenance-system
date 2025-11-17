import React, { useState } from 'react';
import { 
  FiUsers, FiUserPlus, FiSearch, FiFilter, FiEdit2, 
  FiTrash2, FiMoreVertical, FiMail, FiPhone, FiShield,
  FiCheck, FiX, FiUser, FiLock, FiCalendar, FiActivity
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    status: 'active'
  });

  // data gia cho user
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@example.com',
      phone: '0901234567',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2 giờ trước',
      totalBookings: 12,
      totalSpent: 15000000,
      avatar: null
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      email: 'binh.tran@example.com',
      phone: '0907654321',
      role: 'user',
      status: 'active',
      joinDate: '2024-02-20',
      lastActive: '1 ngày trước',
      totalBookings: 8,
      totalSpent: 8500000,
      avatar: null
    },
    {
      id: 3,
      name: 'Admin',
      email: 'admin@evservice.com',
      phone: '0909999999',
      role: 'admin',
      status: 'active',
      joinDate: '2023-12-01',
      lastActive: 'Đang hoạt động',
      totalBookings: 0,
      totalSpent: 0,
      avatar: null
    },
    {
      id: 4,
      name: 'Lê Văn Cường',
      email: 'cuong.le@example.com',
      phone: '0908888888',
      role: 'technician',
      status: 'active',
      joinDate: '2024-01-10',
      lastActive: '5 phút trước',
      totalBookings: 0,
      totalSpent: 0,
      avatar: null
    },
    {
      id: 5,
      name: 'Phạm Thị Dung',
      email: 'dung.pham@example.com',
      phone: '0906666666',
      role: 'user',
      status: 'inactive',
      joinDate: '2024-03-01',
      lastActive: '1 tháng trước',
      totalBookings: 3,
      totalSpent: 2500000,
      avatar: null
    }
  ]);

  // trang thai thong ke
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    newUsersThisMonth: 2,
    totalRevenue: users.reduce((sum, user) => sum + user.totalSpent, 0)
  };

  // quyen
  const roles = [
    { value: 'all', label: 'Tất cả', color: 'gray' },
    { value: 'admin', label: 'Admin', color: 'red' },
    { value: 'technician', label: 'Kỹ thuật viên', color: 'blue' },
    { value: 'user', label: 'Khách hàng', color: 'green' }
  ];

  // trang thai loc
  const statusFilters = [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' },
    { value: 'suspended', label: 'Đã khóa' }
  ];

  // Lọc người dùng dựa trên tìm kiếm, vai trò và trạng thái
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // phan quyen
  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'technician': return 'bg-blue-100 text-blue-700';
      case 'user': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // trang thai
  const getStatusBadgeColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-yellow-100 text-yellow-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // giuwn them nguoi dung
  const handleAddUser = (e) => {
    e.preventDefault();
    
    const newUser = {
      id: users.length + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Vừa tạo',
      totalBookings: 0,
      totalSpent: 0,
      avatar: null
    };

    setUsers([...users, newUser]);
    setShowAddModal(false);
    resetForm();
    toast.success('Thêm người dùng thành công');
  };

  // chinh sua nguoi dung
  const handleEditUser = (e) => {
    e.preventDefault();
    
    const updatedUsers = users.map(user => {
      if (user.id === editingUser.id) {
        return {
          ...user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setShowEditModal(false);
    setEditingUser(null);
    resetForm();
    toast.success('Cập nhật người dùng thành công');
  };

  // xoa nguoi dung
  const handleDeleteUser = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      setUsers(users.filter(user => user.id !== id));
      toast.success('Xóa người dùng thành công');
    }
  };

  // kich hoat / vo hieu hoa
  const handleToggleStatus = (id) => {
    const updatedUsers = users.map(user => {
      if (user.id === id) {
        return {
          ...user,
          status: user.status === 'active' ? 'inactive' : 'active'
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    toast.success('Cập nhật trạng thái thành công');
  };

  // chinh sua model
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: '',
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
  };

  // reset lai
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      status: 'active'
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Quản lý người dùng và phân quyền</p>
        </div>
        <Button 
          variant="primary"
          icon={<FiUserPlus />}
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-500 to-teal-600"
        >
          Thêm người dùng
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng người dùng</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
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
                <p className="text-sm text-gray-600">Đang hoạt động</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeUsers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiActivity className="text-2xl text-green-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mới trong tháng</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.newUsersThisMonth}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <FiUserPlus className="text-2xl text-teal-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {(stats.totalRevenue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiActivity className="text-2xl text-yellow-600" />
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
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
          {roles.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statusFilters.map(filter => (
            <option key={filter.value} value={filter.value}>{filter.label}</option>
          ))}
        </select>
      </div>
      <Card>
        <Card.Content className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hoạt động
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thống kê
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiUser className="text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: #{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role === 'admin' ? 'Admin' : 
                         user.role === 'technician' ? 'Kỹ thuật viên' : 'Khách hàng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                        {user.status === 'active' ? 'Hoạt động' : 
                         user.status === 'inactive' ? 'Không hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Tham gia: {user.joinDate}</div>
                      <div>Hoạt động: {user.lastActive}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.role === 'user' ? (
                        <>
                          <div>{user.totalBookings} đặt lịch</div>
                          <div className="font-medium">₫{(user.totalSpent / 1000000).toFixed(1)}M</div>
                        </>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`p-2 rounded-lg ${
                            user.status === 'active' 
                              ? 'hover:bg-yellow-50 text-yellow-600' 
                              : 'hover:bg-green-50 text-green-600'
                          }`}
                          title={user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        >
                          {user.status === 'active' ? <FiX /> : <FiCheck />}
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                          title="Xóa"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <FiUsers className="mx-auto text-4xl text-gray-400 mb-4" />
                <p className="text-gray-500">Không tìm thấy người dùng nào</p>
              </div>
            )}
          </div>
        </Card.Content>
      </Card>
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {showEditModal ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <form onSubmit={showEditModal ? handleEditUser : handleAddUser} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>

                {!showEditModal && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu *
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required={!showEditModal}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                  >
                    <option value="user">Khách hàng</option>
                    <option value="technician">Kỹ thuật viên</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    required
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="suspended">Đã khóa</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                >
                  Hủy
                </Button>
                <Button type="submit" variant="primary">
                  <FiCheck className="mr-1" />
                  {showEditModal ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;