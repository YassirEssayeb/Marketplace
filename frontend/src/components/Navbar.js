import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!user) { setUnread(0); return; }
    const fetchUnread = () => api.get('/messages/unread-count').then(r => setUnread(r.data.count)).catch(() => {});
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileOpen(false);
      if (!e.target.closest('.relative')) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`bg-surface-container-lowest fixed top-0 w-full z-50 border-b border-outline-variant transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-container-max mx-auto px-margin-desktop flex justify-between items-center h-20">
        <div className="flex items-center gap-12 h-full">
          <Link to="/" className="flex items-center no-underline">
            <img src="/logo.png" alt="ProMarket" className="h-10 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-stack-lg">
            <Link to="/browse" className={`font-label-md text-label-md transition-colors duration-200 no-underline ${isActive('/browse') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant font-medium hover:text-secondary'}`}>Browse</Link>
            <Link to="/browse?tab=categories" className={`font-label-md text-label-md transition-colors duration-200 no-underline ${isActive('/categories') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant font-medium hover:text-secondary'}`}>Categories</Link>
            <Link to="/browse?tab=sellers" className={`font-label-md text-label-md transition-colors duration-200 no-underline ${isActive('/sellers') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant font-medium hover:text-secondary'}`}>Sellers</Link>
            <Link to="/about" className={`font-label-md text-label-md transition-colors duration-200 no-underline ${isActive('/about') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant font-medium hover:text-secondary'}`}>Help</Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant w-64 focus-within:ring-2 focus-within:ring-secondary/20 transition-all">
            <span className="material-symbols-outlined text-outline">search</span>
            <input
              type="text"
              placeholder="Search listing..."
              className="bg-transparent border-none focus:ring-0 text-body-sm font-body-sm w-full"
              onFocus={() => navigate('/browse')}
              readOnly
            />
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/messages" className={`relative material-symbols-outlined transition-colors no-underline ${isActive('/messages') ? 'text-secondary' : 'text-on-surface-variant hover:text-primary'}`}>
                  chat
                  {unread > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>}
                </Link>
                <Link to="/favorites" className={`material-symbols-outlined transition-colors no-underline ${isActive('/favorites') ? 'text-secondary' : 'text-on-surface-variant hover:text-primary'}`}>
                  favorite
                </Link>
                <button onClick={toggle} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer" title={dark ? 'Light mode' : 'Dark mode'}>
                  {dark ? 'light_mode' : 'dark_mode'}
                </button>
                <div className="h-10 w-px bg-outline-variant mx-1"></div>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="hidden md:flex items-center gap-3 bg-transparent border-none cursor-pointer p-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
                    </div>
                    <span className="font-label-md text-label-md text-on-surface hidden lg:block">{user.name}</span>
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 top-14 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-2 min-w-[200px] z-50">
                      <div className="px-4 py-2 border-b border-outline-variant">
                        <p className="font-label-md text-label-md text-on-surface">{user.name}</p>
                        <p className="text-body-xs text-on-surface-variant">{user.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-high transition-colors no-underline">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
                        <span className="font-label-sm text-label-sm text-on-surface">My Profile</span>
                      </Link>
                      <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-high transition-colors no-underline">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">settings</span>
                        <span className="font-label-sm text-label-sm text-on-surface">Settings</span>
                      </Link>
                      <Link to="/seller-dashboard" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-high transition-colors no-underline">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">storefront</span>
                        <span className="font-label-sm text-label-sm text-on-surface">Seller Dashboard</span>
                      </Link>
                      {user.is_admin && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-high transition-colors no-underline">
                          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">admin_panel_settings</span>
                          <span className="font-label-sm text-label-sm text-on-surface">Admin</span>
                        </Link>
                      )}
                      <div className="border-t border-outline-variant my-1"></div>
                      <button
                        onClick={() => { setProfileOpen(false); logout(); navigate('/'); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-error-container transition-colors bg-transparent border-none cursor-pointer text-left"
                      >
                        <span className="material-symbols-outlined text-error text-[20px]">logout</span>
                        <span className="font-label-sm text-label-sm text-error">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
                <Link to="/ads/new" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md font-bold hover:bg-opacity-90 active:scale-95 transition-all no-underline">
                  Post Listing
                </Link>
              </>
            ) : (
              <>
                <button onClick={toggle} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer" title={dark ? 'Light mode' : 'Dark mode'}>
                  {dark ? 'light_mode' : 'dark_mode'}
                </button>
                <div className="h-10 w-px bg-outline-variant mx-1"></div>
                <Link to="/login" className="text-on-surface font-label-md text-label-md font-semibold hover:text-secondary transition-colors no-underline hidden lg:block">Sign In</Link>
                <Link to="/ads/new" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md font-bold hover:bg-opacity-90 active:scale-95 transition-all no-underline">Post Listing</Link>
              </>
            )}
            <button className="md:hidden material-symbols-outlined text-on-surface-variant bg-transparent border-none cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? 'close' : 'menu'}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div ref={menuRef} className="md:hidden bg-surface-container-lowest border-t border-outline-variant p-4 space-y-2 shadow-lg">
          <Link to="/browse" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">Browse</Link>
          <Link to="/browse?tab=categories" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">Categories</Link>
          <Link to="/browse?tab=sellers" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">Sellers</Link>
          <Link to="/about" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">Help</Link>
          <div className="border-t border-outline-variant my-2"></div>
          {user ? (
            <>
              <Link to="/profile" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">My Profile</Link>
              <Link to="/settings" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">Settings</Link>
              <Link to="/seller-dashboard" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">Seller Dashboard</Link>
              <Link to="/messages" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">
                Messages {unread > 0 && <span className="ml-2 bg-error text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{unread}</span>}
              </Link>
              <Link to="/favorites" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">Favorites</Link>
              {user.is_admin && <Link to="/admin" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">Admin</Link>}
              <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-4 py-3 rounded-lg font-label-md text-label-md text-error hover:bg-error-container transition-colors bg-transparent border-none cursor-pointer">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">Sign In</Link>
              <Link to="/register" className="block px-4 py-3 rounded-lg font-label-md text-label-md bg-primary text-on-primary text-center font-bold no-underline">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
