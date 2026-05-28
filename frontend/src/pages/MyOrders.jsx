import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../features/orders/ordersSlice';
import { Link } from 'react-router-dom';
import { FiPackage, FiMapPin, FiClock } from 'react-icons/fi';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: 'Pending',    cls: 'status-pending',   emoji: '⏳', next: 'Order received, being confirmed' },
  confirmed: { label: 'Confirmed',  cls: 'status-confirmed', emoji: '✅', next: 'Order confirmed, being prepared' },
  preparing: { label: 'Preparing',  cls: 'status-preparing', emoji: '👨‍🍳', next: 'Your order is being prepared' },
  ready:     { label: 'Ready!',     cls: 'status-ready',     emoji: '🎉', next: 'Ready for pickup! Show your PIN' },
  completed: { label: 'Completed',  cls: 'bg-green-100 text-green-700 font-bold badge', emoji: '✔️', next: 'Order collected successfully!' },
  cancelled: { label: 'Cancelled',  cls: 'status-cancelled', emoji: '❌', next: 'Order was cancelled' },
};

// ─── Progress bar for order flow ──────────────────────────────────────────────
const STEPS = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];

function StatusProgress({ status }) {
  if (status === 'cancelled') return (
    <div className="flex items-center gap-2 text-red-500 text-xs font-medium">
      <span>❌</span> Order Cancelled
    </div>
  );

  const stepIdx = STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-3">
      {STEPS.map((step, i) => {
        const done = i <= stepIdx;
        const active = i === stepIdx;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-500 ${
                active  ? 'bg-red-600 ring-2 ring-red-300 scale-125' :
                done    ? 'bg-red-600' : 'bg-gray-200'
              }`}
            />
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-0.5 transition-all duration-700 ${i < stepIdx ? 'bg-red-600' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Single order card ─────────────────────────────────────────────────────────
function OrderCard({ order }) {
  const [liveStatus, setLiveStatus] = useState(order.status);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Connect to Socket.io and listen for real-time status updates for THIS order
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    socket.on(`order_update_${order._id}`, ({ status: newStatus }) => {
      setLiveStatus(newStatus);
      setPulse(true);
      setTimeout(() => setPulse(false), 2000);

      const cfg = STATUS_CONFIG[newStatus];
      toast.success(
        `Order ${order.orderNumber}: ${cfg?.emoji} ${cfg?.label}!`,
        { duration: 5000, position: 'top-center' }
      );
    });

    return () => socket.disconnect();
  }, [order._id, order.orderNumber]);

  const cfg = STATUS_CONFIG[liveStatus] || STATUS_CONFIG.pending;
  const isReady = liveStatus === 'ready';
  const isDone  = liveStatus === 'completed';

  return (
    <div
      className={`card p-5 transition-all duration-500 ${
        pulse ? 'ring-2 ring-red-400 shadow-lg scale-[1.01]' : ''
      } ${
        isDone    ? 'border-l-4 border-green-500 bg-green-50/40' :
        isReady   ? 'border-l-4 border-green-500' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono font-bold text-gray-900 text-sm">{order.orderNumber}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
            {' · '}
            {new Date(order.createdAt).toLocaleTimeString('en-IN', { timeStyle: 'short' })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {/* Completed gets a bold green badge */}
          {isDone ? (
            <span className="flex items-center gap-1.5 bg-green-100 text-green-700 font-bold text-xs px-3 py-1 rounded-full">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Completed
            </span>
          ) : (
            <span className={cfg.cls}>{cfg.emoji} {cfg.label}</span>
          )}
          {pulse && (
            <span className="text-[10px] text-red-600 font-semibold animate-pulse">● Live update</span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <StatusProgress status={liveStatus} />

      {/* Status message */}
      <p className={`text-xs mt-2 mb-3 font-medium ${
        isDone ? 'text-green-600' : 'text-gray-500'
      }`}>
        {isDone && (
          <svg className="inline w-3.5 h-3.5 mr-1 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {cfg.next}
      </p>

      {/* Branch + time */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-wrap">
        {order.branch && (
          <span className="flex items-center gap-1">
            <FiMapPin className="w-3 h-3 text-red-500" />
            {order.branch.name}, {order.branch.city}
          </span>
        )}
        {order.estimatedTime && (
          <span className="flex items-center gap-1">
            <FiClock className="w-3 h-3 text-red-500" />
            {order.estimatedTime}
          </span>
        )}
      </div>

      {/* Footer: items + total + PIN */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div>
          <p className="text-xs text-gray-400">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
          <p className="font-bold text-gray-900">₹{order.subtotal?.toFixed(2)}</p>
        </div>

        {/* Show PIN only when ready for pickup */}
        {isReady && order.pickupPIN && (
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1 font-medium">🔢 Pickup PIN</p>
            <div className="flex gap-1">
              {order.pickupPIN.split('').map((d, i) => (
                <span
                  key={i}
                  className="w-8 h-9 bg-red-700 text-white text-sm font-black rounded-lg flex items-center justify-center shadow-md"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────
export default function MyOrders() {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((s) => s.orders);

  const refresh = useCallback(() => dispatch(fetchMyOrders()), [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading && !myOrders.length) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!loading && !myOrders.length) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiPackage className="w-9 h-9 text-red-300" />
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-6">Start shopping and place your first order!</p>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header — clean, no Live/Refresh buttons */}
      <div className="page-hero py-8">
        <div className="container-custom">
          <h1 className="font-display font-black text-3xl text-white">My Orders</h1>
          <p className="text-red-200 text-sm mt-1">{myOrders.length} order{myOrders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Orders list */}
      <div className="container-custom py-8 max-w-2xl">
        <div className="space-y-4">
          {myOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}
