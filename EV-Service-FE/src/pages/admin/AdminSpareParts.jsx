import { useState, useEffect } from 'react';
import { 
  FiSearch, FiPlus, FiEdit2, FiPackage,
  FiAlertCircle, FiCheck, FiX
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { sparePartService } from '../../services/sparePartService';

const AdminSpareParts = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPriceUpdateModal, setShowPriceUpdateModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [centers, setCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [formData, setFormData] = useState({
    partName: '',
    partNumber: '',
    category: '',
    price: '',
    stockQuantity: '',
    minStockLevel: '',
    supplier: '',
    description: '',
    centerId: ''
  });

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  useEffect(() => {
    fetchSpareParts();
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    setLoadingCenters(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/centers`);
      if (!response.ok) {
        throw new Error('Failed to fetch centers');
      }
      const data = await response.json();
      // Response is array directly, not wrapped
      setCenters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching centers:', error);
      toast.error('Không thể tải danh sách trung tâm');
      setCenters([]); // Set empty array on error
    } finally {
      setLoadingCenters(false);
    }
  };

  const fetchSpareParts = async () => {
    setLoading(true);
    try {
      const response = await sparePartService.getAllSpareParts();
      console.log('Raw spare parts response:', response);
      
      // Filter only ACTIVE parts on frontend as well (double check)
      const activeParts = response.filter(part => 
        !part.partStatus || part.partStatus === 'ACTIVE'
      );
      console.log('Filtered ACTIVE parts:', activeParts);
      
      const transformedParts = activeParts.map(part => ({
        id: part.partId,
        partName: part.partName,
        partNumber: part.partNumber || 'N/A',
        category: part.category,
        price: part.unitPrice,
        stockQuantity: part.stockQuantity,
        minStockLevel: part.minStockLevel || 10,
        supplier: part.supplier || 'N/A',
        description: part.description || '',
        partStatus: part.partStatus,
        status: part.stockQuantity === 0 ? 'out-of-stock' : 
                part.stockQuantity <= (part.minStockLevel || 10) ? 'low' : 'in-stock'
      }));
      setSpareParts(transformedParts);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
      toast.error('Không thể tải danh sách phụ tùng');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['BATTERY', 'MOTOR', 'BRAKE', 'SUSPENSION', 'ELECTRICAL', 'BODY', 'OTHER'];

  const stats = {
    total: spareParts.length,
    inStock: spareParts.filter(p => p.status === 'in-stock').length,
    lowStock: spareParts.filter(p => p.status === 'low').length,
    outOfStock: spareParts.filter(p => p.status === 'out-of-stock').length,
    totalValue: spareParts.reduce((sum, p) => sum + ((p.price || 0) * (p.stockQuantity || 0)), 0)
  };

  const filteredParts = spareParts.filter(part => {
    const matchesSearch = 
      (part.partName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (part.partNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (part.supplier || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || part.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Format price input with thousand separators
  const handlePriceInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setFormData(prev => ({ ...prev, price: value }));
  };

  const formatPriceDisplay = (value) => {
    if (!value) return '';
    return parseInt(value).toLocaleString('vi-VN');
  };

  const resetForm = () => {
    setFormData({
      partName: '',
      partNumber: '',
      category: '',
      price: '',
      stockQuantity: '',
      minStockLevel: '',
      supplier: '',
      description: '',
      centerId: ''
    });
  };

  const handleAddPart = async (e) => {
    e.preventDefault();
    
    if (!formData.centerId) {
      toast.error('Vui lòng chọn trung tâm bảo dưỡng');
      return;
    }
    
    try {
      const newPart = {
        partName: formData.partName,
        partNumber: formData.partNumber,
        category: formData.category,
        unitPrice: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        minStockLevel: parseInt(formData.minStockLevel) || 10,
        supplier: formData.supplier,
        description: formData.description,
        centerId: parseInt(formData.centerId)
      };
      await sparePartService.createSparePart(newPart);
      toast.success('Đã thêm phụ tùng thành công!');
      setShowAddModal(false);
      resetForm();
      fetchSpareParts();
    } catch (error) {
      console.error('Error adding spare part:', error);
      toast.error('Không thể thêm phụ tùng');
    }
  };

  const handleEditPart = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        partName: selectedPart.partName,
        partNumber: selectedPart.partNumber,
        category: selectedPart.category,
        unitPrice: selectedPart.price,
        stockQuantity: parseInt(formData.stockQuantity),
        minStockLevel: selectedPart.minStockLevel,
        supplier: selectedPart.supplier,
        description: selectedPart.description
      };
      await sparePartService.updateSparePart(selectedPart.id, updateData);
      toast.success('Đã cập nhật số lượng tồn kho thành công!');
      setShowEditModal(false);
      setSelectedPart(null);
      resetForm();
      fetchSpareParts();
    } catch (error) {
      console.error('Error updating spare part:', error);
      toast.error('Không thể cập nhật số lượng');
    }
  };

  const handlePriceUpdate = async (e) => {
    e.preventDefault();
    try {
      // Create new version with same part number but new price
      // Transfer stock quantity from old version to new version
      const newPart = {
        partName: selectedPart.partName,
        partNumber: selectedPart.partNumber, // Keep same part number for version tracking
        category: selectedPart.category,
        unitPrice: parseFloat(formData.price),
        stockQuantity: selectedPart.stockQuantity, // Transfer stock from old version
        minStockLevel: selectedPart.minStockLevel,
        supplier: selectedPart.supplier,
        description: selectedPart.description
      };
      
      // Create new version
      await sparePartService.createSparePart(newPart);
      
      // Disable old version (backend will set status to DISABLED and quantity to 0)
      await sparePartService.deleteSparePart(selectedPart.id);
      
      toast.success('Đã tạo phiên bản mới với giá cập nhật và chuyển số lượng tồn kho!');
      setShowPriceUpdateModal(false);
      setSelectedPart(null);
      resetForm();
      fetchSpareParts();
    } catch (error) {
      console.error('Error updating price:', error);
      toast.error('Không thể cập nhật giá');
    }
  };

  const handleDisablePart = async (partId, partName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn ngừng sử dụng phụ tùng "${partName}"?`)) {
      return;
    }
    try {
      await sparePartService.deleteSparePart(partId);
      toast.success('Đã ngừng sử dụng phụ tùng!');
      fetchSpareParts();
    } catch (error) {
      console.error('Error disabling spare part:', error);
      toast.error('Không thể ngừng sử dụng phụ tùng');
    }
  };

  const openEditModal = (part) => {
    setSelectedPart(part);
    setFormData({
      partName: part.partName,
      partNumber: part.partNumber,
      category: part.category,
      price: part.price.toString(),
      stockQuantity: part.stockQuantity.toString(),
      minStockLevel: part.minStockLevel.toString(),
      supplier: part.supplier,
      description: part.description
    });
    setShowEditModal(true);
  };

  const openPriceUpdateModal = (part) => {
    setSelectedPart(part);
    setFormData({
      partName: part.partName,
      partNumber: part.partNumber,
      category: part.category,
      price: part.price.toString(),
      stockQuantity: part.stockQuantity.toString(),
      minStockLevel: part.minStockLevel.toString(),
      supplier: part.supplier,
      description: part.description
    });
    setShowPriceUpdateModal(true);
  };

  const getStatusBadge = (status) => {
    if (status === 'out-of-stock') {
      return <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Hết hàng</span>;
    }
    if (status === 'low') {
      return <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Sắp hết</span>;
    }
    return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Còn hàng</span>;
  };

  const getCategoryName = (category) => {
    const names = {
      'BATTERY': 'Pin',
      'MOTOR': 'Động cơ',
      'BRAKE': 'Phanh',
      'SUSPENSION': 'Giảm xóc',
      'ELECTRICAL': 'Điện',
      'BODY': 'Thân xe',
      'OTHER': 'Khác'
    };
    return names[category] || category;
  };

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý phụ tùng</h1>
        <p className="text-gray-600 mt-1">Quản lý kho phụ tùng xe điện</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tên phụ tùng, mã số, nhà cung cấp..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{getCategoryName(cat)}</option>
          ))}
        </select>
        <Button
          variant="primary"
          icon={<FiPlus />}
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 whitespace-nowrap"
        >
          Thêm phụ tùng
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng số mặt hàng</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiPackage className="text-2xl text-blue-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Còn hàng</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.inStock}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheck className="text-2xl text-green-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sắp hết hàng</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.lowStock}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiAlertCircle className="text-2xl text-orange-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hết hàng</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.outOfStock}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FiAlertCircle className="text-2xl text-red-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Giá trị kho</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {formatCurrency(stats.totalValue)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiPackage className="text-2xl text-purple-600" />
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
              <p className="text-gray-600">Đang tải danh sách phụ tùng...</p>
            </div>
          ) : filteredParts.length === 0 ? (
            <div className="p-12 text-center">
              <FiPackage className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có phụ tùng</h3>
              <p className="text-gray-500">Chưa có phụ tùng nào được thêm vào kho</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mã phụ tùng</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tên phụ tùng</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Danh mục</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Giá</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tồn kho</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nhà cung cấp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParts.map((part) => (
                    <tr key={part.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{part.partNumber}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{part.partName}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{getCategoryName(part.category)}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">{formatCurrency(part.price)}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={part.stockQuantity <= part.minStockLevel ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                          {part.stockQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{part.supplier}</td>
                      <td className="px-4 py-4">{getStatusBadge(part.status)}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(part)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Cập nhật số lượng"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => openPriceUpdateModal(part)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="Cập nhật giá"
                          >
                            <FiPlus />
                          </button>
                          <button
                            onClick={() => handleDisablePart(part.id, part.partName)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Ngừng sử dụng"
                          >
                            <FiX />
                          </button>
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


      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Thêm phụ tùng mới</h3>
                <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>
            <form onSubmit={handleAddPart} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-red-700">
                    Trung tâm bảo dưỡng * 
                    <span className="text-xs text-gray-500 ml-2">(Đây là bước đầu tiên)</span>
                  </label>
                  <select 
                    name="centerId" 
                    value={formData.centerId} 
                    onChange={handleInputChange} 
                    className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    required
                  >
                    <option value="">-- Chọn trung tâm --</option>
                    {loadingCenters ? (
                      <option disabled>Đang tải...</option>
                    ) : (
                      centers.map(center => (
                        <option key={center.id} value={center.id}>
                          {center.centerName} - {center.centerAddress}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tên phụ tùng *</label>
                  <input type="text" name="partName" value={formData.partName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mã phụ tùng *</label>
                  <input type="text" name="partNumber" value={formData.partNumber} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Chọn danh mục</option>
                    {categories.map(cat => <option key={cat} value={cat}>{getCategoryName(cat)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giá (₫) *</label>
                  <input 
                    type="text" 
                    name="price" 
                    value={formatPriceDisplay(formData.price)} 
                    onChange={handlePriceInputChange} 
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                    placeholder="VD: 1.000.000"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng *</label>
                  <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mức tối thiểu</label>
                  <input type="number" name="minStockLevel" value={formData.minStockLevel} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" min="0" placeholder="10" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Nhà cung cấp</label>
                  <input type="text" name="supplier" value={formData.supplier} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Mô tả</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); resetForm(); }}>Hủy</Button>
                <Button type="submit" variant="primary" className="bg-blue-600"><FiCheck className="mr-1" />Thêm</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Cập nhật số lượng</h3>
                <button onClick={() => { setShowEditModal(false); setSelectedPart(null); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>
            <form onSubmit={handleEditPart} className="p-6">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Lưu ý:</strong> Chỉ có thể cập nhật số lượng tồn kho.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">Tên phụ tùng</label>
                  <input type="text" value={formData.partName} className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">Mã phụ tùng</label>
                  <input type="text" value={formData.partNumber} className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-green-700">Số lượng tồn kho *</label>
                  <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} className="w-full px-3 py-2 border-2 border-green-500 rounded-lg focus:ring-2 focus:ring-green-500" required min="0" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => { setShowEditModal(false); setSelectedPart(null); resetForm(); }}>Hủy</Button>
                <Button type="submit" variant="primary" className="bg-blue-600"><FiCheck className="mr-1" />Cập nhật</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Price Update Modal */}
      {showPriceUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Cập nhật giá phụ tùng</h3>
                <button onClick={() => { setShowPriceUpdateModal(false); setSelectedPart(null); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>
            <form onSubmit={handlePriceUpdate} className="p-6">
              <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800 mb-2">
                  <strong>Lưu ý:</strong> Khi cập nhật giá, hệ thống sẽ:
                </p>
                <ol className="text-sm text-orange-700 ml-4 list-decimal">
                  <li>Tạo phiên bản mới với giá mới</li>
                  <li>Chuyển số lượng tồn kho từ phiên bản cũ sang phiên bản mới</li>
                  <li>Ngừng sử dụng phiên bản cũ (giữ lại cho lịch sử đơn hàng)</li>
                </ol>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">Tên phụ tùng</label>
                  <input type="text" value={formData.partName} className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">Mã phụ tùng</label>
                  <input type="text" value={formData.partNumber} className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">Danh mục</label>
                  <input type="text" value={getCategoryName(formData.category)} className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-orange-700">Giá mới (₫) *</label>
                  <input 
                    type="text" 
                    name="price" 
                    value={formatPriceDisplay(formData.price)} 
                    onChange={handlePriceInputChange} 
                    className="w-full px-3 py-2 border-2 border-orange-500 rounded-lg focus:ring-2 focus:ring-orange-500" 
                    placeholder="VD: 1.500.000"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">Số lượng hiện tại</label>
                  <input type="number" value={formData.stockQuantity} className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">Mức tối thiểu</label>
                  <input type="number" value={formData.minStockLevel} className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" disabled />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-500">Nhà cung cấp</label>
                  <input type="text" value={formData.supplier} className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" disabled />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-500">Mô tả</label>
                  <textarea value={formData.description} rows="3" className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" disabled />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => { setShowPriceUpdateModal(false); setSelectedPart(null); resetForm(); }}>Hủy</Button>
                <Button type="submit" variant="primary" className="bg-orange-600"><FiCheck className="mr-1" />Cập nhật giá</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpareParts;
