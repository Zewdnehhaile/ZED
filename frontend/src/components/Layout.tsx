import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, LogOut, User, Menu, X, Facebook, Twitter, Instagram } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSectionNav = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setIsMenuOpen(false);
      return;
    }
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return;
    const sectionId = location.hash.replace('#', '');
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#2A1B7A] p-2 rounded-xl">
              <Package className="h-6 w-6 text-[#F28C3A]" />
            </div>
            <span className="font-bold text-xl text-[#2A1B7A]">Zemen Express</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <button
              type="button"
              onClick={() => handleSectionNav('home')}
              className="text-gray-600 hover:text-[#F28C3A] font-medium"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleSectionNav('services')}
              className="text-gray-600 hover:text-[#F28C3A] font-medium"
            >
              Services
            </button>
            <Link to="/store" className="text-gray-600 hover:text-[#F28C3A] font-medium flex items-center gap-1">
              Store
            </Link>
            {user ? (
              <>
                <Link to={`/${user.role}-dashboard`} className="text-gray-600 hover:text-[#F28C3A] font-medium">
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                  <User className="h-4 w-4" />
                  <span>{user.name} ({user.role})</span>
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 p-2">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-[#2A1B7A] font-medium">Login</Link>
                <Link to="/register" className="bg-[#F28C3A] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#F28C3A]/90 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4">
            <button
              type="button"
              className="block text-left text-gray-600 font-medium w-full"
              onClick={() => handleSectionNav('home')}
            >
              Home
            </button>
            <button
              type="button"
              className="block text-left text-gray-600 font-medium w-full"
              onClick={() => handleSectionNav('services')}
            >
              Services
            </button>
            <Link to="/store" className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>
              ZED Store
            </Link>
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <User className="h-4 w-4" />
                  <span>{user.name} ({user.role})</span>
                </div>
                <Link to={`/${user.role}-dashboard`} className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-red-600 font-medium w-full text-left">
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block text-[#F28C3A] font-medium" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 w-full mx-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-[#2A1B7A] p-2 rounded-xl">
                <Package className="h-6 w-6 text-[#F28C3A]" />
              </div>
              <span className="font-bold text-xl text-[#2A1B7A]">Zemen Express</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Your trusted partner for parcel and package delivery. We connect customers with reliable drivers for seamless logistics.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#2A1B7A] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-[#F28C3A] transition-colors">Home</Link></li>
              <li><Link to="/store" className="hover:text-[#F28C3A] transition-colors">ZED Store</Link></li>
              <li><Link to="/login" className="hover:text-[#F28C3A] transition-colors">Track Package</Link></li>
              <li><Link to="/register" className="hover:text-[#F28C3A] transition-colors">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#2A1B7A] mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Email: support@zemenexpress.com</li>
              <li>Phone: +251 911 000000</li>
              <li>Address: Addis Ababa, Ethiopia</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#2A1B7A] mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#F28C3A] transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F28C3A] transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F28C3A] transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Zemen Express Delivery System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
