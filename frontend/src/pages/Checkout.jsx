import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../features/orders/ordersSlice';
import { fetchBranches } from '../features/branches/branchesSlice';
import { clearCart } from '../features/cart/cartSlice';
import { FiMapPin, FiUser, FiPhone, FiMail, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((s) => s.cart);
  const { branches } = useSelector((s) => s.branches);
  const { user } = useSelector((s) => s.auth);
  const { loading } = useSelector((s) => s.orders);

  // Tracks whether the user has just placed an order.
  // We need this because clearCart() empties items[], which would
  // trigger the "go back to cart" guard below BEFORE navigate('/order-success')
  // runs — causing the order-success page to never be seen.
  const orderPlaced = useRef(false);

  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    customerEmail: user?.email || '',
    branch: '',
    notes: '',
  });

  useEffect(() => { dispatch(fetchBranches()); }, [dispatch]);

  // Only redirect to cart if the cart is empty AND we haven't just placed an order
  useEffect(() => {
    if (items.length === 0 && !orderPlaced.current) navigate('/cart');
  }, [items, navigate]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.branch) return toast.error('Please select a pickup branch');
    if (!form.customerName || !form.customerPhone) return toast.error('Please fill all required fields');

    const orderData = {
      ...form,
      items: items.map(({ _id, name, price, quantity, image }) => ({ product: _id, name, price, quantity, image })),
      subtotal: total,
    };

    const res = await dispatch(placeOrder(orderData));
    if (placeOrder.fulfilled.match(res)) {
      orderPlaced.current = true;
      navigate('/order-success');  // navigate FIRST — currentOrder is now in Redux
      dispatch(clearCart());       // clear cart after — harmless after navigation
    } else {
      toast.error(res.payload || 'Failed to place order');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-hero">
        <div className="container-custom py-6">
          <h1 className="font-display font-black text-3xl text-white">Checkout</h1>
          <p className="text-red-100">Select your pickup store and confirm order</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Details */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-lg text-gray-900 mb-4 flex items-center gap-2"><FiUser className="text-red-700" /> Customer Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input name="customerName" value={form.customerName} onChange={handleChange} required placeholder="Your full name" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input name="customerPhone" value={form.customerPhone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX" className="input-field pl-9" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (Optional)</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input name="customerEmail" value={form.customerEmail} onChange={handleChange} type="email" placeholder="your@email.com" className="input-field pl-9" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pickup Branch */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-lg text-gray-900 mb-4 flex items-center gap-2"><FiMapPin className="text-red-700" /> Select Pickup Branch *</h2>
                <select name="branch" value={form.branch} onChange={handleChange} required className="input-field">
                  <option value="">-- Choose your nearest Victory Bazars store --</option>
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>{b.name} — {b.city}, {b.district}</option>
                  ))}
                </select>
                {form.branch && (
                  <div className="mt-3 p-3 bg-red-50 rounded-xl">
                    {(() => {
                      const b = branches.find((br) => br._id === form.branch);
                      return b ? (
                        <p className="text-sm text-red-800">
                          <strong>{b.name}</strong> · {b.address} · {b.timing}
                        </p>
                      ) : null;
                    })()}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Can't find your store? <Link to="/locations" className="text-red-700 hover:underline">View all 55+ locations</Link>
                </p>
              </div>

              {/* Notes */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-lg text-gray-900 mb-4">Order Notes (Optional)</h2>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                  placeholder="Any special instructions for your order..." className="input-field resize-none" />
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <div className="card p-6 sticky top-20">
                <h3 className="font-display font-bold text-lg text-gray-900 mb-4 flex items-center gap-2"><FiShoppingBag className="text-red-700" /> Order Summary</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-3 text-sm">
                      <img src={item.image || `https://placehold.co/48x48/fee2e2/CC0000?text=${item.name[0]}`}
                        alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <span className="font-semibold text-gray-900 flex-shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span><span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Delivery</span><span className="font-semibold">FREE (Pickup)</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-100 pt-2">
                    <span>Total</span><span className="text-red-700">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3.5">
                  {loading ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Placing Order...</span>
                  ) : 'Place Order & Get PIN'}
                </button>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-xs text-yellow-800 text-center font-medium">
                    🔢 You'll receive a <strong>4-digit PIN</strong> to collect your order at the store
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
