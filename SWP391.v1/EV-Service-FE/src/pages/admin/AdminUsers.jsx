import { useState } from 'react';
import { FiUsers, FiUserCheck, FiBriefcase } from 'react-icons/fi';
import AdminCustomers from './AdminCustomers';
import AdminEmployees from './AdminEmployees';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('customers');

  const tabs = [
    { id: 'customers', label: 'Khách hàng', icon: FiUserCheck },
    { id: 'employees', label: 'Nhân sự', icon: FiBriefcase }
  ];

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p className="text-gray-600 mt-1">Quản lý khách hàng và nhân sự</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isCustomers = tab.id === 'customers';
              const activeColor = isCustomers ? 'text-blue-600' : 'text-green-600';
              const borderColor = isCustomers ? 'bg-blue-600' : 'bg-green-600';
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-3 font-medium transition-all relative ${
                    isActive
                      ? activeColor
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="text-lg" />
                  {tab.label}
                  {isActive && (
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${borderColor}`}></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeTab === 'customers' && (
        <div className="bg-blue-50/30 border-2 border-blue-200 rounded-lg p-6 animate-fadeIn">
          <AdminCustomers />
        </div>
      )}
      {activeTab === 'employees' && (
        <div className="bg-green-50/30 border-2 border-green-200 rounded-lg p-6 animate-fadeIn">
          <AdminEmployees />
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
