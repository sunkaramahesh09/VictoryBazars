import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { logout } from '../../features/auth/authSlice';
import toast from 'react-hot-toast';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/locations', label: 'Our Stores' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/careers', label: 'Careers' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isLoggedIn, user } = useSelector((s) => s.auth);
  const { itemCount } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center shadow-md group-hover:bg-red-800 transition-colors">
              <span className="text-white font-black text-lg font-display">V</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-black text-xl text-red-700 leading-tight">Victory</span>
              <span className="font-display font-black text-xl text-gray-800 leading-tight"> Bazars</span>
              <p className="text-[10px] text-gray-400 font-medium -mt-0.5 tracking-wider uppercase">Symbol of Fine Quality</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) => `nav-link px-3 py-2 rounded-lg text-sm ${isActive ? 'nav-link-active bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-xl hover:bg-red-50 transition-colors group">
              <FiShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-red-700 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-700 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-slow">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium text-gray-700">
                  <div className="w-7 h-7 bg-red-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="hidden md:block">{user?.name?.split(' ')[0]}</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 animate-fade-in">
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 font-medium">
                        <FiUser className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <Link to="/my-orders" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
                      My Orders
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-xl hover:bg-red-50 transition-colors">
              {menuOpen ? <FiX className="w-5 h-5 text-gray-700" /> : <FiMenu className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl animate-slide-up">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-red-700 text-white' : 'text-gray-700 hover:bg-red-50 hover:text-red-700'}`}>
                {label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex-1 btn-outline text-sm py-2 justify-center">Logout</button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 btn-outline text-sm py-2 justify-center">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 btn-primary text-sm py-2 justify-center">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
