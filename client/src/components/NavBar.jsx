import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  FiHome, 
  FiGrid, 
  FiFileText, 
  FiClock, 
  FiEye, 
  FiBarChart2, 
  FiUploadCloud, 
  FiSettings,
  FiMenu,
  FiX
} from "react-icons/fi";

const NavBar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: FiHome },
    { path: "/compounds", label: "Compounds", icon: FiGrid },
    { path: "/papers", label: "Papers", icon: FiFileText },
    { path: "/timeline", label: "Timeline", icon: FiClock },
    { path: "/visualizer", label: "Visualizer", icon: FiEye },
    { path: "/graph", label: "Graph", icon: FiBarChart2 },
    { path: "/paper-upload", label: "AI Upload", icon: FiUploadCloud },
    { path: "/admin", label: "Admin", icon: FiSettings },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all">
                <span className="text-white font-bold text-lg">BC</span>
              </div>
            </div>
            <span className="text-xl font-bold text-secondary-900 hidden sm:block">
              BioCycleDB
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-colors"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-secondary-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-secondary-600 hover:bg-secondary-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
