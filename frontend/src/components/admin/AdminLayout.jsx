import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { FiGrid, FiPackage, FiShoppingBag, FiMapPin, FiKey, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/products', label: 'Products', icon: FiPackage },
  { to: '/admin/pin', label: 'Verify PIN', icon: FiKey },
  { to: '/admin/branches', label: 'Branches', icon: FiMapPin },
];

export default function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { dispatch(logout()); toast.success('Logged out'); navigate('/'); };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-lg">V</span>
          </div>
          <div>
            <p className="font-display font-black text-gray-900 text-sm">Victory Bazars</p>
            <p className="text-xs text-red-700 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            <Icon className="w-4 h-4" />{label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="admin-nav-item w-full text-red-600 hover:bg-red-50 hover:text-red-700">
          <FiLogOut className="w-4 h-4" />Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 shadow-sm flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <FiMenu className="w-5 h-5 text-gray-700" />
          </button>
          <p className="font-display font-bold text-gray-900">Admin Panel</p>
          <div className="w-9 h-9 bg-red-700 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">{user?.name?.[0]}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
