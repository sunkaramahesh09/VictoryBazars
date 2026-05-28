import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiCheckCircle, FiMapPin, FiClock, FiShoppingBag } from 'react-icons/fi';

export default function OrderSuccess() {
  const { currentOrder } = useSelector((s) => s.orders);
  const navigate = useNavigate();

  // Snapshot currentOrder into a ref on first render.
  // This makes the component immune to Redux state changes caused by
  // React StrictMode's simulate-unmount/remount cycle, which previously
  // cleared currentOrder before the component could read it.
  const orderRef = useRef(currentOrder);
  const order = orderRef.current;

  useEffect(() => {
    // If there was no order at all when this page loaded, go home.
    if (!order) navigate('/', { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!order) return null;

  const pin = order.pickupPIN || '----';
  const branch = order.branch;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="container-custom max-w-lg">
        <div className="card p-8 text-center animate-slide-up">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="font-display font-black text-3xl text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-2">Your order has been received and is being prepared.</p>
          <p className="text-sm text-gray-400 mb-8">
            Order ID: <span className="font-mono font-bold text-gray-700">{order.orderNumber}</span>
          </p>

          {/* PIN Display */}
          <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-8 mb-6 text-white">
            <p className="text-red-200 text-sm font-medium uppercase tracking-widest mb-3">Your Pickup PIN</p>
            <div className="flex justify-center gap-3 mb-4">
              {pin.split('').map((digit, i) => (
                <div key={i} className="pin-digit">{digit}</div>
              ))}
            </div>
            <p className="text-red-200 text-sm">Show this PIN at the store to collect your order</p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left space-y-3">
            {branch && (
              <div className="flex items-start gap-3">
                <FiMapPin className="w-4 h-4 text-red-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Pickup Store</p>
                  <p className="font-semibold text-gray-900">{branch.name}</p>
                  <p className="text-sm text-gray-500">{branch.address}, {branch.city}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <FiClock className="w-4 h-4 text-red-700 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Estimated Ready In</p>
                <p className="font-semibold text-gray-900">{order.estimatedTime || '20–30 minutes'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiShoppingBag className="w-4 h-4 text-red-700 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Order Total</p>
                <p className="font-semibold text-gray-900">₹{order.subtotal?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-bold text-yellow-800 mb-2">📋 Pickup Instructions</p>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Wait for your order to be prepared (check status in My Orders)</li>
              <li>Visit the store during working hours</li>
              <li>Show this <strong>4-digit PIN</strong> to the staff</li>
              <li>Collect your items and you're done!</li>
            </ol>
          </div>

          <div className="flex gap-3">
            <Link to="/my-orders" className="btn-outline flex-1 justify-center text-sm">My Orders</Link>
            <Link to="/products" className="btn-primary flex-1 justify-center text-sm">Shop More</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
