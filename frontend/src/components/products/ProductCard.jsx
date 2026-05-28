import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiCheck } from 'react-icons/fi';
import { addToCart } from '../../features/cart/cartSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((s) => s.cart.items);
  const inCart = cartItems.find((i) => i._id === product._id);

  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    dispatch(addToCart(product));
    toast.success(`Added!`, { icon: '🛒', duration: 1200 });
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="block bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 group"
      style={{ borderColor: '#e8e8e8' }}
    >
      {/* ── Image ── */}
      <div className="relative bg-[#f8f8f8]" style={{ aspectRatio: '1/1' }}>
        <img
          src={
            product.images?.[0]?.url ||
            `https://placehold.co/300x300/f8f8f8/cccccc?text=${encodeURIComponent(product.name.split(' ')[0])}`
          }
          alt={product.name}
          className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-[1.04] transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-1 left-1 bg-[#0c831f] text-white rounded-[3px] px-1 py-0.5 text-center leading-none">
            <div className="text-[7px] sm:text-[8px] font-bold">{discount}%</div>
            <div className="text-[7px] sm:text-[8px] font-bold">OFF</div>
          </div>
        )}

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
            <span className="text-[9px] sm:text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Out of Stock</span>
          </div>
        )}

        {/* Low stock */}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-1 right-1 bg-orange-500 text-white text-[7px] sm:text-[8px] font-bold px-1 py-0.5 rounded-[3px]">
            {product.stock} left
          </span>
        )}
      </div>

      {/* ── Info ── */}
      <div className="px-1.5 sm:px-2 pt-1.5 pb-2">
        {/* Delivery chip */}
        <div className="flex items-center gap-0.5 mb-1">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className="text-[9px] sm:text-[9px] text-gray-400 font-medium">Pickup at store</span>
        </div>

        {/* Name */}
        <p className="text-[12px] sm:text-[13px] font-semibold text-gray-800 leading-tight line-clamp-2 mb-0.5 group-hover:text-green-700 transition-colors">
          {product.name}
        </p>

        {/* Unit */}
        <p className="text-[10px] sm:text-[10px] text-gray-400 mb-1.5 leading-none">{product.unit}</p>

        {/* Price + ADD */}
        <div className="flex items-center justify-between gap-1">
          <div className="min-w-0">
            <span className="text-[13px] sm:text-[14px] font-bold text-gray-900">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-[10px] sm:text-[10px] text-gray-400 line-through ml-0.5">₹{product.mrp}</span>
            )}
          </div>

          {/* ADD button */}
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`flex-shrink-0 flex items-center justify-center gap-0.5 text-[11px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1.5 sm:py-1.5 rounded-lg border-2 transition-all duration-150 active:scale-95 min-w-[44px] sm:min-w-[46px]
              ${inCart
                ? 'bg-[#0c831f] border-[#0c831f] text-white'
                : product.stock === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'bg-white border-[#0c831f] text-[#0c831f] hover:bg-[#0c831f] hover:text-white'
              }`}
          >
            {inCart
              ? <><FiCheck className="w-3 h-3 sm:w-3 sm:h-3" />Added</>
              : <><FiPlus className="w-3 h-3 sm:w-3 sm:h-3" />ADD</>
            }
          </button>
        </div>
      </div>
    </Link>
  );
}
