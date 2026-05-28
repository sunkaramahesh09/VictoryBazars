import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderStats } from '../../features/orders/ordersSlice';
import { fetchAdminProducts } from '../../features/products/productsSlice';
import AdminLayout from '../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiPackage, FiClock, FiCheckCircle, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';

const STATUS_COLORS = { pending: 'status-pending', confirmed: 'status-confirmed', preparing: 'status-preparing', ready: 'status-ready', completed: 'status-completed', cancelled: 'status-cancelled' };

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, recentOrders } = useSelector((s) => s.orders);
  const { adminProducts } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchOrderStats());
    dispatch(fetchAdminProducts({ limit: 5 }));
  }, [dispatch]);

  const STAT_CARDS = [
    { label: "Today's Orders", value: stats?.todayOrders ?? '—', icon: FiTrendingUp, color: 'text-blue-600 bg-blue-50', link: '/admin/orders' },
    { label: 'Pending', value: stats?.pending ?? '—', icon: FiClock, color: 'text-yellow-600 bg-yellow-50', link: '/admin/orders?status=pending' },
    { label: 'Preparing', value: stats?.preparing ?? '—', icon: FiAlertCircle, color: 'text-orange-600 bg-orange-50', link: '/admin/orders?status=preparing' },
    { label: 'Ready for Pickup', value: stats?.ready ?? '—', icon: FiCheckCircle, color: 'text-green-600 bg-green-50', link: '/admin/orders?status=ready' },
    { label: 'Total Orders', value: stats?.total ?? '—', icon: FiShoppingBag, color: 'text-red-600 bg-red-50', link: '/admin/orders' },
    { label: 'Total Products', value: adminProducts?.length ?? '—', icon: FiPackage, color: 'text-purple-600 bg-purple-50', link: '/admin/products' },
  ];

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="font-display font-black text-2xl text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back! Here's what's happening at Victory Bazars.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {STAT_CARDS.map(({ label, value, icon: Icon, color, link }) => (
            <Link key={label} to={link} className="card p-5 hover:-translate-y-0.5 transition-transform group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                  <p className="font-display font-black text-3xl text-gray-900">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-red-700 font-medium hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders?.length === 0 && (
              <p className="p-6 text-center text-gray-400">No orders yet</p>
            )}
            {recentOrders?.map((order) => (
              <div key={order._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                    <FiShoppingBag className="w-4 h-4 text-red-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{order.customerName}</p>
                    <p className="text-xs text-gray-400 font-mono">{order.orderNumber} · {order.branch?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={STATUS_COLORS[order.status] || 'badge-gray'}>{order.status}</span>
                  <p className="text-sm font-bold text-gray-900 mt-1">₹{order.subtotal?.toFixed(0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Warning */}
        {adminProducts.filter(p => p.stock <= 5 && p.stock > 0).length > 0 && (
          <div className="mt-6 card border-l-4 border-orange-400">
            <div className="p-5">
              <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-3">
                <FiAlertCircle /> Low Stock Products
              </h3>
              <div className="space-y-2">
                {adminProducts.filter(p => p.stock <= 5 && p.stock > 0).map(p => (
                  <div key={p._id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{p.name}</span>
                    <span className="text-orange-600 font-bold">Only {p.stock} left</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
