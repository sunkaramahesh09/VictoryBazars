import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiClock, FiMapPin } from 'react-icons/fi';
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const footerLinks = {
  'Quick Links': [
    { to: '/', label: 'Home' }, { to: '/products', label: 'Shop Online' },
    { to: '/locations', label: 'Our Stores' }, { to: '/about', label: 'About Us' },
    { to: '/careers', label: 'Careers' }, { to: '/contact', label: 'Contact' },
  ],
  'Categories': [
    { to: '/products?category=Groceries', label: 'Groceries' },
    { to: '/products?category=Dairy & Eggs', label: 'Dairy & Eggs' },
    { to: '/products?category=Beverages', label: 'Beverages' },
    { to: '/products?category=Snacks & Namkeen', label: 'Snacks & Namkeen' },
    { to: '/products?category=Personal Care', label: 'Personal Care' },
    { to: '/products?category=Home Care', label: 'Home Care' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top bar */}
      <div className="bg-red-700">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white font-display font-semibold text-sm">🛒 Order Online & Pickup at Your Nearest Store!</p>
          <Link to="/products" className="bg-white text-red-700 font-bold text-sm px-5 py-2 rounded-full hover:bg-red-50 transition-colors">
            Shop Now →
          </Link>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">V</span>
              </div>
              <div>
                <p className="font-display font-black text-white text-lg leading-tight">Victory Bazars</p>
                <p className="text-xs text-gray-400 tracking-wider">Symbol of Fine Quality</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Since 2001, serving families across Andhra Pradesh with quality products, fair prices, and a modern supermarket experience.
            </p>
            <div className="flex gap-3">
              {[
                { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
                { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
                { icon: FaWhatsapp, href: 'https://wa.me/919256265626', label: 'WhatsApp' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-red-700 flex items-center justify-center transition-colors duration-200">
                  <Icon className="w-4 h-4 text-gray-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-4">{heading}</h3>
              <ul className="space-y-2.5">
                {links.map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className="text-gray-400 hover:text-red-400 text-sm transition-colors duration-200 flex items-center gap-1.5 group">
                      <span className="w-1 h-1 bg-red-700 rounded-full group-hover:w-2 transition-all duration-200" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-white font-display font-semibold text-sm uppercase tracking-wider mb-4">Head Office</h3>
            <div className="space-y-3">
              <div className="flex gap-2.5 text-sm text-gray-400">
                <FiMapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>8-452/2, CRC Road, Ravulapalem – 533238<br />Dr. B.R. Ambedkar Konaseema District, AP</span>
              </div>
              <a href="tel:+919256265626" className="flex gap-2.5 text-sm text-gray-400 hover:text-red-400 transition-colors">
                <FiPhone className="w-4 h-4 text-red-500 shrink-0" />
                +91 9256265626
              </a>
              <a href="mailto:victorybazarscustomercare@gmail.com" className="flex gap-2.5 text-sm text-gray-400 hover:text-red-400 transition-colors">
                <FiMail className="w-4 h-4 text-red-500 shrink-0" />
                victorybazarscustomercare@gmail.com
              </a>
              <div className="flex gap-2.5 text-sm text-gray-400">
                <FiClock className="w-4 h-4 text-red-500 shrink-0" />
                10:00 AM – 5:00 PM (Office Hours)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2025 Victory Bazars Supermarket. Symbol of Fine Quality.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-red-400 transition-colors">Terms & Conditions</Link>
            <span>|</span>
            <Link to="#" className="hover:text-red-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
