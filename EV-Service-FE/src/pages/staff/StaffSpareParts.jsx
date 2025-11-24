import { useState, useEffect } from 'react';
import { 
  FiSearch, FiPackage, FiAlertCircle, FiCheck
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';
import { sparePartService } from '../../services/sparePartService';

const StaffSpareParts = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    setLoading(true);
    try {
      const response = await sparePartService.getAllSpareParts();
      const transformedParts = response.map(part => ({
        id: part.partId,
        partName: part.partName,
        partNumber: part.partNumber || 'N/A',
        category: part.category,
        price: part.unitPrice,
        stockQuantity: part.stockQuantity,
        minStockLevel: part.minStockLevel || 10,
        supplier: part.supplier || 'N/A',
        description: part.description || '',
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
        <h1 className="text-2xl font-bold text-gray-900">Phụ tùng</h1>
        <p className="text-gray-600 mt-1">Xem danh sách phụ tùng trong kho</p>
      </div>

      <Card className="mb-6">
        <Card.Content className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tên phụ tùng, mã số, nhà cung cấp..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{getCategoryName(cat)}</option>
              ))}
            </select>
          </div>
        </Card.Content>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border border-gray-200">
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng số mặt hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FiPackage className="text-3xl text-blue-500" />
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-gray-200">
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Còn hàng</p>
                <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
              </div>
              <FiCheck className="text-3xl text-green-500" />
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-gray-200">
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sắp hết hàng</p>
                <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
              </div>
              <FiAlertCircle className="text-3xl text-orange-500" />
            </div>
          </Card.Content>
        </Card>

        <Card className="border border-gray-200">
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Hết hàng</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <FiAlertCircle className="text-3xl text-red-500" />
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy phụ tùng</h3>
              <p className="text-gray-500">Không có phụ tùng nào phù hợp với tìm kiếm của bạn</p>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredParts.map((part) => (
                    <tr key={part.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{part.partNumber}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{part.partName}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{getCategoryName(part.category)}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{(part.price || 0).toLocaleString('vi-VN')}₫</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={part.stockQuantity <= part.minStockLevel ? 'text-red-600 font-semibold' : 'text-gray-900'}>
                          {part.stockQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{part.supplier}</td>
                      <td className="px-4 py-4">{getStatusBadge(part.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default StaffSpareParts;
