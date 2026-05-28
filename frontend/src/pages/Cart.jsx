import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Cart() {
  const dispatch = useDispatch();
  const { items, total, itemCount } = useSelector((s) => s.cart);

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name.split(' ')[0]} removed from cart`);
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiShoppingBag className="w-10 h-10 text-red-300" />
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Link to="/products" className="btn-primary">Start Shopping <FiArrowRight /></Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-hero">
        <div className="container-custom py-6">
          <h1 className="font-display font-black text-3xl text-white">My Cart</h1>
          <p className="text-red-100">{itemCount} item{itemCount !== 1 ? 's' : ''} in cart</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-display font-bold text-lg text-gray-900">Cart Items</h2>
              <button onClick={() => { dispatch(clearCart()); toast.success('Cart cleared'); }}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                <FiTrash2 className="w-4 h-4" /> Clear All
              </button>
            </div>

            {items.map((item) => (
              <div key={item._id} className="card p-4 flex gap-4 animate-fade-in">
                <Link to={`/products/${item._id}`}>
                  <img src={item.image || `https://placehold.co/80x80/fee2e2/CC0000?text=${item.name[0]}`}
                    alt={item.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item._id}`}
                    className="font-semibold text-gray-900 hover:text-red-700 transition-colors line-clamp-2 text-sm">
                    {item.name}
                  </Link>
                  <p className="text-gray-400 text-xs mt-0.5">{item.unit}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-red-50 text-gray-600 hover:text-red-700 transition-colors text-sm">
                        <FiMinus />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-red-50 text-gray-600 hover:text-red-700 transition-colors text-sm">
                        <FiPlus />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => handleRemove(item._id, item.name)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h3 className="font-display font-bold text-lg text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate pr-2">{item.name.split(' ').slice(0, 3).join(' ')} × {item.quantity}</span>
                    <span className="font-medium text-gray-900 flex-shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total ({itemCount} items)</span>
                  <span className="text-xl text-red-700">₹{total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">* No delivery charges. Free pickup at store.</p>
              </div>
              <Link to="/checkout" className="btn-primary w-full justify-center mb-3">
                Proceed to Checkout <FiArrowRight />
              </Link>
              <Link to="/products" className="btn-outline w-full justify-center text-sm">Continue Shopping</Link>

              <div className="mt-5 p-3 bg-red-50 rounded-xl">
                <p className="text-xs text-red-700 font-medium text-center">🏪 Pickup at your nearest store — No delivery charges!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
