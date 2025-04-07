import { useState } from 'react';
import Link from 'next/link';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import AddPropertyModal from './AddPropertyModal';
import { Search, Menu, X, Plus } from 'lucide-react';

const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchVisible) {
      setIsSearchVisible(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-soft">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl">
              RF
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gradient hidden sm:inline">RoommateFinder</span>
            <span className="text-xl font-bold text-gradient sm:hidden">RF</span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for rooms, houses, or locations..."
                className="w-full py-2.5 px-5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-soft"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-2 text-primary border border-primary rounded-full hover:bg-gradient-subtle transition-colors font-medium text-sm cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2 bg-gradient text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-soft text-sm cursor-pointer"
            >
              Register
            </button>
            <button
              onClick={() => setIsAddPropertyModalOpen(true)}
              className="px-4 py-2 bg-gradient text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-soft text-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Property
            </button>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-primary transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="h-6 w-6" />
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-primary transition-colors cursor-pointer"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchVisible && (
          <div className="md:hidden mt-3 animate-fadeIn">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for rooms, houses, or locations..."
                  className="w-full py-2.5 px-5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-soft"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-primary border border-primary rounded-full hover:bg-gradient-subtle transition-colors font-medium text-sm text-center cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsRegisterModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 bg-gradient text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-soft text-sm text-center cursor-pointer"
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    setIsAddPropertyModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 bg-gradient text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-soft text-sm text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add Property
                </button>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <nav className="flex flex-col space-y-2">
                  <Link href="/" className="text-gray-700 hover:text-primary transition-colors py-1 cursor-pointer">
                    Home
                  </Link>
                  <Link href="/properties" className="text-gray-700 hover:text-primary transition-colors py-1 cursor-pointer">
                    Properties
                  </Link>
                  <Link href="/about" className="text-gray-700 hover:text-primary transition-colors py-1 cursor-pointer">
                    About Us
                  </Link>
                  <Link href="/contact" className="text-gray-700 hover:text-primary transition-colors py-1 cursor-pointer">
                    Contact
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
      {isRegisterModalOpen && <RegisterModal onClose={() => setIsRegisterModalOpen(false)} />}
      {isAddPropertyModalOpen && <AddPropertyModal onClose={() => setIsAddPropertyModalOpen(false)} />}
    </header>
  );
};

export default Header; 