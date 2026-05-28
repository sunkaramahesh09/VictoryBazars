import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../features/orders/ordersSlice';
import { fetchBranches } from '../../features/branches/branchesSlice';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiRefreshCw, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { addRealtimeOrder, updateRealtimeStatus } from '../../features/orders/ordersSlice';

const STATUS_COLORS = { pending: 'status-pending', confirmed: 'status-confirmed', preparing: 'status-preparing', ready: 'status-ready', completed: 'status-completed', cancelled: 'status-cancelled' };
const NEXT_STATUS = { pending: 'confirmed', confirmed: 'preparing', preparing: 'ready', ready: 'completed' };
const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

export default function OrdersMgmt() {
  const dispatch = useDispatch();
  const { adminOrders, loading } = useSelector((s) => s.orders);
  const { branches } = useSelector((s) => s.branches);
  const [statusFilter, setStatusFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchBranches());

    // Use env var — VITE_SOCKET_URL=http://localhost:4000 (matches backend PORT)
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    const joinAdmin = () => socket.emit('join_admin');
    socket.on('connect', joinAdmin); // re-join admin room after reconnects

    socket.on('new_order', (data) => {
      dispatch(addRealtimeOrder(data));
      toast.success(`🛒 New order from ${data.customerName}!`, { duration: 5000 });
    });
    socket.on('order_status_update', (data) => {
      dispatch(updateRealtimeStatus(data));
    });
    return () => socket.disconnect();
  }, [dispatch]);

  const handleStatusUpdate = async (id, status) => {
    const res = await dispatch(updateOrderStatus({ id, status }));
    if (updateOrderStatus.fulfilled.match(res)) {
      toast.success(`Order marked as ${status}`);
    }
  };

  const filtered = adminOrders.filter((o) => {
    const matchStatus = !statusFilter || o.status === statusFilter;
    const matchBranch = !branchFilter || o.branch?._id === branchFilter;
    return matchStatus && matchBranch;
  });

  return (
    <AdminLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-black text-2xl text-gray-900">Order Management</h1>
            <p className="text-gray-500 text-sm">{filtered.length} orders • Real-time updates enabled</p>
          </div>
          <button onClick={() => dispatch(fetchAllOrders())} className="btn-outline py-2 text-sm">
            <FiRefreshCw /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-5 flex flex-wrap gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-44 py-2">
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="input-field w-60 py-2">
            <option value="">All Branches</option>
            {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
          {(statusFilter || branchFilter) && (
            <button onClick={() => { setStatusFilter(''); setBranchFilter(''); }} className="text-sm text-red-700 font-medium hover:underline">Clear</button>
          )}
        </div>

        {/* Orders Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading orders...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {['Order ID', 'Customer', 'Branch', 'Items', 'Total', 'Status', 'Actions', 'Time'].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-700 font-bold">{order.orderNumber}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-400">{order.customerPhone}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{order.branch?.name}<br />{order.branch?.city}</td>
                      <td className="px-4 py-3 text-gray-600">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                      <td className="px-4 py-3 font-bold text-gray-900">₹{order.subtotal?.toFixed(0)}</td>
                      <td className="px-4 py-3"><span className={STATUS_COLORS[order.status] || 'badge-gray'}>{order.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {NEXT_STATUS[order.status] && (
                            <button onClick={() => handleStatusUpdate(order._id, NEXT_STATUS[order.status])}
                              className="text-xs bg-red-700 text-white px-2.5 py-1.5 rounded-lg hover:bg-red-800 transition-colors font-medium">
                              → {NEXT_STATUS[order.status]}
                            </button>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <button onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                              className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString('en-IN', { timeStyle: 'short' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
