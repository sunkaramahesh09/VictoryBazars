import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Locations from './pages/Locations';
import About from './pages/About';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/admin/Dashboard';
import OrdersMgmt from './pages/admin/OrdersMgmt';
import ProductsMgmt from './pages/admin/ProductsMgmt';
import PINVerify from './pages/admin/PINVerify';
import BranchMgmt from './pages/admin/BranchMgmt';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/common/ScrollToTop';

// Route guards
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useSelector((s) => s.auth);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isLoggedIn, user } = useSelector((s) => s.auth);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '12px', fontSize: '14px', fontWeight: 500 },
        success: { iconTheme: { primary: '#CC0000', secondary: '#fff' } },
      }} />
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
        <Route path="/locations" element={<PublicLayout><Locations /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/careers" element={<PublicLayout><Careers /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

        {/* Protected routes */}
        <Route path="/checkout" element={<PublicLayout><ProtectedRoute><Checkout /></ProtectedRoute></PublicLayout>} />
        <Route path="/order-success" element={<PublicLayout><ProtectedRoute><OrderSuccess /></ProtectedRoute></PublicLayout>} />
        <Route path="/my-orders" element={<PublicLayout><ProtectedRoute><MyOrders /></ProtectedRoute></PublicLayout>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><OrdersMgmt /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><ProductsMgmt /></AdminRoute>} />
        <Route path="/admin/pin" element={<AdminRoute><PINVerify /></AdminRoute>} />
        <Route path="/admin/branches" element={<AdminRoute><BranchMgmt /></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <PublicLayout>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <p className="text-8xl font-black text-red-700 mb-4">404</p>
                <h1 className="font-display font-bold text-2xl text-gray-900 mb-2">Page Not Found</h1>
                <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </>
  );
}
