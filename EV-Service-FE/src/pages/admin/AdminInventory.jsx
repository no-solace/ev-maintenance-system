import React, { useState, useEffect } from 'react';
import { 
  FiPackage, FiSearch, FiFilter, FiPlus, FiEdit2, 
  FiTrash2, FiAlertTriangle, FiShoppingCart, FiTrendingUp,
  FiDownload, FiUpload, FiX, FiCheck, FiInfo
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import { sparePartService } from '../../services/sparePartService';

const AdminInventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    category: '',
    quantity: '',
    minStock: '',
    unitCost: '',
    location: '',
    supplier: '',
    description: ''
  });

  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // check thong ke
  const stats = {
    totalItems: inventoryItems.length,
    lowStockItems: inventoryItems.filter(item => item.status === 'low').length,
    outOfStock: inventoryItems.filter(item => item.status === 'out').length,
    totalValue: inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)
  };

  // Fetch spare parts from API
  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    try {
      setLoading(true);
      const data = await sparePartService.getAllSpareParts();
      console.log('✅ Fetched spare parts:', data);
      
      // Transform backend data to frontend format
      const transformedData = data.map(item => ({
        id: item.sparePartId,
        name: item.sparePartName,
        partNumber: item.partNumber || 'N/A',
        category: getCategoryLabel(item.category),
        currentStock: item.quantity,
        minStock: item.minimumStock || 0,
        maxStock: item.minimumStock ? item.minimumStock * 4 : 100,
        unitCost: item.unitCost || item.price,
        location: item.location || 'N/A',
        supplier: item.supplier || 'N/A',
        lastRestocked: new Date().toISOString().split('T')[0],
        status: item.quantity === 0 ? 'out' : item.quantity < (item.minimumStock || 0) ? 'low' : 'in-stock',
        description: item.description || ''
      }));
      
      setInventoryItems(transformedData);
    } catch (error) {
      console.error('❌ Error fetching spare parts:', error);
      toast.error('Không thể tải dữ liệu phụ tùng');
    } finally {
      setLoading(false);
    }
  };

  // Map backend category enum to display label
  const getCategoryLabel = (category) => {
    const categoryMap = {
      'BATTERY': 'Battery Components',
      'MOTOR': 'Motors & Drives',
      'CHARGER': 'Charging Equipment',
      'BRAKE': 'Brake System',
      'TIRE': 'Tires & Wheels',
      'LIGHT': 'Lighting',
      'MIRROR': 'Mirrors',
      'HORN': 'Horn',
      'ELECTRICAL': 'Electrical',
      'OTHER': 'Other'
    };
    return categoryMap[category] || category;
  };

  // Map frontend category to backend enum
  const getCategoryEnum = (label) => {
    const enumMap = {
      'Battery Components': 'BATTERY',
      'Motors & Drives': 'MOTOR',
      'Charging Equipment': 'CHARGER',
      'Brake System': 'BRAKE',
      'Tires & Wheels': 'TIRE',
      'Lighting': 'LIGHT',
      'Mirrors': 'MIRROR',
      'Horn': 'HORN',
      'Electrical': 'ELECTRICAL',
      'Other': 'OTHER'
    };
    return enumMap[label] || 'OTHER';
  };

  // linh kien
  const categories = [
    'all',
    'Battery Components',
    'Charging Equipment',
    'Brake System',
    'Motors & Drives',
    'Tires & Wheels',
    'Lighting',
    'Mirrors',
    'Horn',
    'Electrical',
    'Other'
  ];

  // loc trang thai
  const statusFilters = [
    { value: 'all', label: 'All Items', color: 'gray' },
    { value: 'in-stock', label: 'In Stock', color: 'green' },
    { value: 'low', label: 'Low Stock', color: 'yellow' },
    { value: 'out', label: 'Out of Stock', color: 'red' }
  ];

  // loc linh kien theo ten
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'in-stock' && item.currentStock >= item.minStock) ||
                         item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Tinh toan muc ton kho
  const getStockLevel = (current, min, max) => {
    if (current === 0) return 0;
    if (current >= min) return ((current - min) / (max - min)) * 100;
    return (current / min) * 15; // 15% cho muc thap nhat
  };

  // Mau sac muc ton kho
  const getStockColor = (item) => {
    if (item.currentStock === 0) return 'bg-red-500';
    if (item.currentStock < item.minStock) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Them linh kien moi
  const handleAddItem = async (e) => {
    e.preventDefault();
    
    try {
      // Transform frontend data to backend format
      const backendData = {
        sparePartName: formData.name,
        partNumber: formData.partNumber,
        category: getCategoryEnum(formData.category),
        quantity: parseInt(formData.quantity),
        minimumStock: parseInt(formData.minStock),
        price: parseFloat(formData.unitCost), // Backend uses 'price' for selling price
        unitCost: parseFloat(formData.unitCost),
        inStock: parseInt(formData.quantity) > 0,
        location: formData.location,
        supplier: formData.supplier,
        description: formData.description
      };

      console.log('📤 Creating spare part:', backendData);
      await sparePartService.createSparePart(backendData);
      
      // Refresh data from server
      await fetchSpareParts();
      
      setShowAddModal(false);
      setFormData({
        name: '',
        partNumber: '',
        category: '',
        quantity: '',
        minStock: '',
        unitCost: '',
        location: '',
        supplier: '',
        description: ''
      });
      toast.success('Phụ tùng đã được thêm thành công!');
    } catch (error) {
      console.error('❌ Error adding spare part:', error);
      toast.error('Không thể thêm phụ tùng. Vui lòng thử lại.');
    }
  };

  // Sua linh kien
  const handleEditItem = async (e) => {
    e.preventDefault();
    
    try {
      const backendData = {
        sparePartName: formData.name,
        partNumber: formData.partNumber,
        category: getCategoryEnum(formData.category),
        quantity: parseInt(formData.quantity),
        minimumStock: parseInt(formData.minStock),
        price: parseFloat(formData.unitCost),
        unitCost: parseFloat(formData.unitCost),
        inStock: parseInt(formData.quantity) > 0,
        location: formData.location,
        supplier: formData.supplier,
        description: formData.description
      };

      console.log('📝 Updating spare part ID:', editingItem.id, backendData);
      await sparePartService.updateSparePart(editingItem.id, backendData);
      
      // Refresh data from server
      await fetchSpareParts();
      
      setShowEditModal(false);
      setEditingItem(null);
      toast.success('Phụ tùng đã được cập nhật!');
    } catch (error) {
      console.error('❌ Error updating spare part:', error);
      toast.error('Không thể cập nhật phụ tùng. Vui lòng thử lại.');
    }
  };

  // Xoa linh kien
  const handleDeleteItem = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phụ tùng này?')) {
      try {
        console.log('🗑️ Deleting spare part ID:', id);
        await sparePartService.deleteSparePart(id);
        
        // Refresh data from server
        await fetchSpareParts();
        
        toast.success('Phụ tùng đã được xóa!');
      } catch (error) {
        console.error('❌ Error deleting spare part:', error);
        toast.error('Không thể xóa phụ tùng. Vui lòng thử lại.');
      }
    }
  };

  // Mo modal sua
  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      partNumber: item.partNumber,
      category: item.category,
      quantity: item.currentStock.toString(),
      minStock: item.minStock.toString(),
      unitCost: item.unitCost.toString(),
      location: item.location,
      supplier: item.supplier,
      description: item.description
    });
    setShowEditModal(true);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your service center inventory</p>
        </div>
        <Button 
          variant="primary"
          icon={<FiPlus />}
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-500 to-teal-600"
        >
          Add Item
        </Button>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search items by name, part number, or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.slice(1).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalItems}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiPackage className="text-2xl text-green-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.lowStockItems}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiAlertTriangle className="text-2xl text-yellow-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.outOfStock}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FiInfo className="text-2xl text-red-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ${stats.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-teal-100 rounded-lg">
                <FiTrendingUp className="text-2xl text-teal-600" />
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
      <div className="space-y-4">
        {loading ? (
          <Card>
            <Card.Content className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </Card.Content>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card>
            <Card.Content className="p-12 text-center">
              <FiPackage className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500">Không tìm thấy phụ tùng nào</p>
            </Card.Content>
          </Card>
        ) : (
          filteredItems.map((item) => (
          <Card key={item.id}>
            <Card.Content className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FiPackage className="text-xl text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {item.name}
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {item.partNumber}
                        </span>
                        {item.status === 'low' && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                            Low Stock
                          </span>
                        )}
                        {item.status === 'out' && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            Out of Stock
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <FiEdit2 className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <FiTrash2 className="text-red-600" />
                      </button>
                      {item.currentStock < item.minStock && (
                        <Button variant="outline" size="sm" className="ml-2">
                          <FiShoppingCart className="mr-1" />
                          Reorder
                        </Button>
                      )}
                      {item.currentStock === 0 && (
                        <Button variant="primary" size="sm" className="ml-2 bg-red-500 hover:bg-red-600">
                          <FiAlertTriangle className="mr-1" />
                          Urgent Order
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="text-sm font-medium text-gray-900">{item.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Current Stock</p>
                      <p className="text-sm font-medium text-gray-900">
                        {item.currentStock} / {item.maxStock}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Unit Cost</p>
                      <p className="text-sm font-medium text-gray-900">
                        ${item.unitCost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{item.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Supplier</p>
                      <p className="text-sm font-medium text-gray-900">{item.supplier}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Stock Level</span>
                      <span className="text-xs text-gray-600">
                        {Math.round(getStockLevel(item.currentStock, item.minStock, item.maxStock))}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStockColor(item)}`}
                        style={{ 
                          width: `${getStockLevel(item.currentStock, item.minStock, item.maxStock)}%` 
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Last restocked: {item.lastRestocked}
                    </p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
          ))
        )}
      </div>
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {showEditModal ? 'Edit Item' : 'Add New Item'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingItem(null);
                    setFormData({
                      name: '',
                      partNumber: '',
                      category: '',
                      quantity: '',
                      minStock: '',
                      unitCost: '',
                      location: '',
                      supplier: '',
                      description: ''
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <form onSubmit={showEditModal ? handleEditItem : handleAddItem} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
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
                    Part Number *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.partNumber}
                    onChange={(e) => setFormData({...formData, partNumber: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Stock *
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.minStock}
                    onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Cost ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.unitCost}
                    onChange={(e) => setFormData({...formData, unitCost: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., A1-01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingItem(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  <FiCheck className="mr-1" />
                  {showEditModal ? 'Update Item' : 'Add Item'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;