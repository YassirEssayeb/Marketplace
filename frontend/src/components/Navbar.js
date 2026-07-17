import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const TYPE_ICONS = {
  message: 'chat',
  favorite: 'favorite',
  ad_status: 'sell',
  system: 'info',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [notifUnread, setNotifUnread] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    if (!user) { setUnread(0); setNotifUnread(0); return; }
    const fetchUnread = () => api.get('/messages/unread-count').then(r => setUnread(r.data.count)).catch(() => {});
    const fetchNotifUnread = () => api.get('/notifications/unread-count').then(r => setNotifUnread(r.data.count)).catch(() => {});
    fetchUnread();
    fetchNotifUnread();
    const interval = setInterval(() => { fetchUnread(); fetchNotifUnread(); }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); setNotifOpen(false); }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileOpen(false);
      if (!e.target.closest('.profile-dropdown')) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleNotif = async () => {
    if (!notifOpen) {
      try {
        const res = await api.get('/notifications/recent');
        setRecentNotifs(res.data);
      } catch {}
    }
    setNotifOpen(!notifOpen);
  };

  const markNotifRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.put('/notifications/' + id + '/read');
      setRecentNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      setNotifUnread(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const timeAgo = (dateStr) => {
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h';
    return Math.floor(diff / 86400) + 'd';
  };

  const isActive = (path) => {
    if (path === '/browse') return location.pathname === '/browse' && !location.search.includes('tab=');
    if (path === '/categories') return location.pathname === '/browse' && location.search.includes('tab=categories');
    if (path === '/sellers') return location.pathname === '/browse' && location.search.includes('tab=sellers');
    return location.pathname === path;
  };

  return (
    <nav className={`bg-surface-container-lowest fixed top-0 w-full z-50 border-b border-outline-variant transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="w-full pl-4 pr-6 flex justify-between items-center h-20">
        <div className="flex items-center gap-12 h-full">
          <Link to="/" className="flex items-center no-underline">
            <img src="/logo.png" alt="ProMarket" className="h-12 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-stack-lg">
            <Link to="/browse" className={`font-label-md text-label-md transition-colors duration-200 no-underline ${isActive('/browse') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant font-medium hover:text-secondary'}`}>{t('nav_browse')}</Link>
            <Link to="/browse?tab=categories" className={`font-label-md text-label-md transition-colors duration-200 no-underline ${isActive('/categories') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant font-medium hover:text-secondary'}`}>{t('nav_categories')}</Link>
            <Link to="/browse?tab=sellers" className={`font-label-md text-label-md transition-colors duration-200 no-underline ${isActive('/sellers') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant font-medium hover:text-secondary'}`}>{t('nav_sellers')}</Link>
            <Link to="/about" className={`font-label-md text-label-md transition-colors duration-200 no-underline ${isActive('/about') ? 'text-secondary font-bold border-b-2 border-secondary pb-1' : 'text-on-surface-variant font-medium hover:text-secondary'}`}>{t('nav_help')}</Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/browse" className="hidden lg:flex items-center bg-surface-container-high/60 hover:bg-surface-container-high rounded-2xl px-4 py-2.5 gap-3 border border-outline-variant/40 hover:border-outline-variant w-72 transition-all no-underline group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary transition-colors" style={{ fontSize: '20px' }}>search</span>
            <span className="text-body-md text-outline font-body-md flex-1 text-left">{t('nav_search')}</span>
            <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-surface-container-lowest border border-outline-variant/60 text-outline text-[11px] font-mono">/</kbd>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/messages" className={`relative material-symbols-outlined transition-colors no-underline ${isActive('/messages') ? 'text-secondary' : 'text-on-surface-variant hover:text-primary'}`}>
                  chat
                  {unread > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>}
                </Link>
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={toggleNotif}
                    className={`relative material-symbols-outlined transition-colors bg-transparent border-none cursor-pointer ${notifOpen ? 'text-secondary' : 'text-on-surface-variant hover:text-primary'}`}
                  >
                    notifications
                    {notifUnread > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">{notifUnread > 99 ? '99+' : notifUnread}</span>}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-12 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg w-80 z-50 max-h-[420px] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
                        <h3 className="font-label-md text-label-md text-on-surface font-bold">{t('notif_title')}</h3>
                        {notifUnread > 0 && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await api.put('/notifications/read-all');
                                setRecentNotifs(prev => prev.map(n => ({ ...n, is_read: 1 })));
                                setNotifUnread(0);
                              } catch {}
                            }}
                            className="text-secondary text-body-xs font-body-xs bg-transparent border-none cursor-pointer hover:underline"
                          >
                            {t('notif_mark_all_read')}
                          </button>
                        )}
                      </div>
                      <div className="overflow-y-auto max-h-[340px]">
                        {recentNotifs.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <span className="material-symbols-outlined text-outline text-[32px]">notifications_none</span>
                            <p className="text-on-surface-variant text-body-sm mt-2">{t('notif_empty')}</p>
                          </div>
                        ) : (
                          recentNotifs.map(n => (
                            <button
                              key={n.id}
                              onClick={() => { setNotifOpen(false); if (n.link) navigate(n.link); }}
                              className={`w-full flex items-start gap-3 px-4 py-3 text-left border-none cursor-pointer transition-colors ${n.is_read ? 'bg-transparent hover:bg-surface-variant' : 'bg-secondary-fixed-dim/30 hover:bg-secondary-fixed-dim/50'}`}
                            >
                              <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontSize: '20px' }}>
                                {TYPE_ICONS[n.type] || 'notifications'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className={`text-body-sm font-body-sm ${n.is_read ? 'text-on-surface-variant' : 'text-on-surface font-medium'}`}>{n.title}</p>
                                <p className="text-body-xs text-on-surface-variant truncate mt-0.5">{n.message}</p>
                                <p className="text-body-xs text-outline mt-1">{timeAgo(n.created_at)}</p>
                              </div>
                              {!n.is_read && (
                                <button
                                  onClick={(e) => markNotifRead(n.id, e)}
                                  className="text-secondary bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-secondary/10 flex-shrink-0"
                                  title={t('notif_mark_read')}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>
                                </button>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                      {recentNotifs.length > 0 && (
                        <div className="border-t border-outline-variant px-4 py-2.5">
                          <Link
                            to="/notifications"
                            onClick={() => setNotifOpen(false)}
                            className="text-secondary text-body-sm font-body-sm font-medium hover:underline no-underline text-center block"
                          >
                            {t('notif_go_to')} {t('notif_title').toLowerCase()}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Link to="/favorites" className={`material-symbols-outlined transition-colors no-underline ${isActive('/favorites') ? 'text-secondary' : 'text-on-surface-variant hover:text-primary'}`}>
                  favorite
                </Link>
                <button onClick={toggle} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer" title={dark ? t('nav_light_mode') : t('nav_dark_mode')}>
                  {dark ? 'light_mode' : 'dark_mode'}
                </button>
                <div className="h-10 w-px bg-outline-variant mx-1"></div>
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="hidden md:flex items-center gap-3 bg-transparent border-none cursor-pointer p-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant overflow-hidden">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
                      )}
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
                        <span className="font-label-sm text-label-sm text-on-surface">{t('nav_my_profile')}</span>
                      </Link>
                      <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-high transition-colors no-underline">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">settings</span>
                        <span className="font-label-sm text-label-sm text-on-surface">{t('nav_settings')}</span>
                      </Link>
                      <Link to="/seller-dashboard" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-high transition-colors no-underline">
                        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">storefront</span>
                        <span className="font-label-sm text-label-sm text-on-surface">{t('nav_seller_dashboard')}</span>
                      </Link>
                      {!!user.is_admin && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-high transition-colors no-underline">
                          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">admin_panel_settings</span>
                          <span className="font-label-sm text-label-sm text-on-surface">{t('nav_admin')}</span>
                        </Link>
                      )}
                      <div className="border-t border-outline-variant my-1"></div>
                      <button
                        onClick={() => { setProfileOpen(false); logout(); navigate('/'); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-error-container transition-colors bg-transparent border-none cursor-pointer text-left"
                      >
                        <span className="material-symbols-outlined text-error text-[20px]">logout</span>
                        <span className="font-label-sm text-label-sm text-error">{t('nav_sign_out')}</span>
                      </button>
                    </div>
                  )}
                </div>
                <Link to="/ads/new" className="bg-secondary text-on-secondary px-5 py-2.5 rounded-2xl font-label-lg text-label-lg font-bold hover:shadow-lg hover:shadow-secondary/20 hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 transition-all no-underline inline-flex items-center gap-2">
                  <span className="material-symbols-outlined bg-on-secondary/20 rounded-full w-6 h-6 flex items-center justify-center" style={{ fontSize: '16px' }}>add</span>
                  {t('nav_post_listing')}
                </Link>
              </>
            ) : (
              <>
                <button onClick={toggle} className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer" title={dark ? t('nav_light_mode') : t('nav_dark_mode')}>
                  {dark ? 'light_mode' : 'dark_mode'}
                </button>
                <div className="h-10 w-px bg-outline-variant mx-1"></div>
                <Link to="/login" className="text-on-surface font-label-md text-label-md font-semibold hover:text-secondary transition-colors no-underline hidden lg:block">{t('nav_sign_in')}</Link>
                <Link to="/ads/new" className="bg-secondary text-on-secondary px-5 py-2.5 rounded-2xl font-label-lg text-label-lg font-bold hover:shadow-lg hover:shadow-secondary/20 hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 transition-all no-underline inline-flex items-center gap-2">
                  <span className="material-symbols-outlined bg-on-secondary/20 rounded-full w-6 h-6 flex items-center justify-center" style={{ fontSize: '16px' }}>add</span>
                  {t('nav_post_listing')}
                </Link>
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
          <Link to="/browse" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">{t('nav_browse')}</Link>
          <Link to="/browse?tab=categories" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">{t('nav_categories')}</Link>
          <Link to="/browse?tab=sellers" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">{t('nav_sellers')}</Link>
          <Link to="/about" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">{t('nav_help')}</Link>
          <div className="border-t border-outline-variant my-2"></div>
          {user ? (
            <>
              <Link to="/profile" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">{t('nav_my_profile')}</Link>
              <Link to="/settings" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">{t('nav_settings')}</Link>
              <Link to="/seller-dashboard" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">{t('nav_seller_dashboard')}</Link>
              <Link to="/messages" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">
                {t('nav_messages')} {unread > 0 && <span className="ml-2 bg-error text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{unread}</span>}
              </Link>
              <Link to="/notifications" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">
                {t('notif_title')} {notifUnread > 0 && <span className="ml-2 bg-error text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{notifUnread}</span>}
              </Link>
              <Link to="/favorites" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">{t('nav_favorites')}</Link>
              {user.is_admin && <Link to="/admin" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">{t('nav_admin')}</Link>}
              <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-4 py-3 rounded-lg font-label-md text-label-md text-error hover:bg-error-container transition-colors bg-transparent border-none cursor-pointer">{t('nav_log_out')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-4 py-3 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-variant transition-colors no-underline">{t('nav_sign_in')}</Link>
              <Link to="/register" className="block px-4 py-3 rounded-lg font-label-md text-label-md bg-primary text-on-primary text-center font-bold no-underline">{t('nav_sign_up')}</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
