import { useState, useEffect } from 'react';
import { ProductRepository } from '../../Infrastructure/Repositories/ProductRepository';
import { ProductCategoryRepository } from '../../Infrastructure/Repositories/ProductCategoryRepository';
import { getAllProducts } from '../../Application/Usecases/product/getAllProducts';
import { getAllProductCategories } from '../../Application/Usecases/productCategory/getAllProductCategories';
import type { ProductResponse } from '../../Domain/Types/ProductResponse';
import type { ProductCategoryResponse } from '../../Domain/Types/ProductCategoryResponse';
import { useAuth } from '../../Interface/Components/Contexts/AuthContext';

const productRepo = new ProductRepository();
const categoryRepo = new ProductCategoryRepository();
const getAllProductsUseCase = getAllProducts(productRepo);
const getAllCategoriesUseCase = getAllProductCategories(categoryRepo);

export default function Dashboard() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError('No authentication token available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          getAllProductsUseCase(token),
          getAllCategoriesUseCase(token)
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Calculate statistics
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stockQuantity), 0);
  const lowStockProducts = products.filter(product => product.stockQuantity < 10).length;
  const outOfStockProducts = products.filter(product => product.stockQuantity === 0).length;
  
  // Get products with images
  const productsWithImages = products.filter(product => product.imageUrl || product.imageFileName).length;
  
  // Get most expensive product

  // Get category with most products
  const categoryProductCounts = categories.map(category => ({
    ...category,
    productCount: products.filter(product => product.categoryId === category.id).length
  }));
  const topCategory = categoryProductCounts.length > 0 
    ? categoryProductCounts.reduce((max, category) => category.productCount > max.productCount ? category : max)
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              <p className="text-xs text-gray-500 mt-1">
                {productsWithImages} with images
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
              <p className="text-xs text-gray-500 mt-1">
                {topCategory ? `${topCategory.name} (${topCategory.productCount} products)` : 'No products yet'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">Rs. {totalValue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                {lowStockProducts} low stock, {outOfStockProducts} out of stock
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stock Status</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockProducts}</p>
              <p className="text-xs text-gray-500 mt-1">
                {lowStockProducts} need restocking
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Distribution Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h3>
          <div className="space-y-3">
            {categoryProductCounts.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${totalProducts > 0 ? (category.productCount / totalProducts) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{category.productCount}</span>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-gray-500 text-center py-8">No categories found</p>
            )}
          </div>
        </div>

        {/* Top Products - Right Side */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {products.length > 0 ? (
              products
                .sort((a, b) => b.price - a.price)
                .slice(0, 5)
                .map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">Stock: {product.stockQuantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">Rs. {product.price.toLocaleString()}</span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center py-8">No products found</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Product</th>
                <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Category</th>
                <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Price</th>
                <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Stock</th>
                <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products
                  .sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                  })
                  .slice(0, 5)
                  .map((product) => {
                    const category = categories.find(cat => cat.id === product.categoryId);
                    const stockStatus = product.stockQuantity === 0 ? 'Out of Stock' : 
                                      product.stockQuantity < 10 ? 'Low Stock' : 'In Stock';
                    const statusColor = product.stockQuantity === 0 ? 'bg-red-100 text-red-800' : 
                                      product.stockQuantity < 10 ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-green-100 text-green-800';
                    
                    return (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{category?.name || 'Unknown'}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-green-600">Rs. {product.price.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{product.stockQuantity}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                            {stockStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}