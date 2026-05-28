import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearSelected } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import ProductCard from '../components/products/ProductCard';
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, similarProducts, loading } = useSelector((s) => s.products);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelected());
  }, [id, dispatch]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    toast.success(`${qty} × ${product.name.split(' ')[0]} added to cart!`, { icon: '🛒' });
  };

  const discount = product && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  if (loading) return (
    <div className="container-custom py-12">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="skeleton-shimmer aspect-square rounded-2xl" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton-shimmer h-6 rounded" />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <p className="text-2xl">😕 Product not found</p>
      <Link to="/products" className="btn-primary mt-4">Back to Products</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-700 mb-6 transition-colors">
          <FiArrowLeft /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            <div className="card rounded-2xl overflow-hidden aspect-square mb-3">
              <img src={product.images?.[activeImg]?.url || `https://placehold.co/600x600/fee2e2/CC0000?text=${encodeURIComponent(product.name.split(' ')[0])}`}
                alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-red-700' : 'border-gray-200'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="animate-slide-up">
            <span className="badge-red mb-3">{product.category}</span>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 mb-2">{product.name}</h1>
            <p className="text-gray-400 text-sm mb-4 flex items-center gap-1.5"><FiPackage className="w-4 h-4" />{product.unit}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-display font-black text-4xl text-gray-900">₹{product.price}</span>
              {product.mrp > product.price && (
                <span className="text-gray-400 text-lg line-through">₹{product.mrp}</span>
              )}
              {discount > 0 && <span className="badge bg-green-100 text-green-700 font-bold">{discount}% OFF</span>}
            </div>
            <p className="text-green-600 text-sm font-medium mb-6">
              {product.mrp > product.price ? `You save ₹${product.mrp - product.price}` : 'Best Price'}
            </p>

            {/* Stock */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 ${product.stock > 5 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
              <span className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`} />
              {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-red-50 text-gray-700 hover:text-red-700 transition-colors">
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="w-11 h-11 flex items-center justify-center hover:bg-red-50 text-gray-700 hover:text-red-700 transition-colors">
                    <FiPlus />
                  </button>
                </div>
                <button onClick={handleAdd} className="btn-primary flex-1 justify-center">
                  <FiShoppingCart /> Add to Cart
                </button>
              </div>
            )}

            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-sm text-red-800 font-medium">🏪 Order online & pickup at your nearest Victory Bazars store</p>
              <Link to="/locations" className="text-xs text-red-700 hover:underline mt-1 block">Find nearest store →</Link>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
