import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { Sun, Moon, Heart, MessageCircle, LogOut, LogIn, Plus, Menu, X, User, Logo } from '../utils/icons';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!user) { setUnread(0); return; }
    const fetchUnread = () => api.get('/messages/unread-count').then(r => setUnread(r.data.count)).catch(() => {});
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [mobileOpen]);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <Logo size={28} />
        </Link>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div ref={menuRef} className={`navbar-center${mobileOpen ? ' open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`}>Accueil</Link>
          <Link to="/browse" className={`nav-link ${isActive('/browse')}`}>Parcourir</Link>
          <Link to="/ads/new" className={`nav-link ${isActive('/ads/new')}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Plus size={16} /> Déposer
          </Link>
        </div>

        <div className={`navbar-right${mobileOpen ? ' open' : ''}`}>
          <button onClick={toggle} className="nav-link" title={dark ? 'Mode clair' : 'Mode sombre'} style={{ fontSize: '1.15rem', lineHeight: 1, border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', padding: '0.5rem' }}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <>
              <Link to="/favorites" className={`nav-link ${isActive('/favorites')}`}>
                <Heart size={16} style={{ verticalAlign: 'text-bottom', marginRight: '0.15rem' }} /> Favoris
              </Link>
              {user.is_admin && <Link to="/admin" className="nav-link nav-link-admin">Admin</Link>}
              <Link to="/messages" className={`nav-link ${isActive('/messages')}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                <MessageCircle size={16} /> Messages{unread > 0 && <span className="badge" style={{ marginLeft: '0.2rem' }}>{unread}</span>}
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.25rem' }}>
                <Link to="/profile" className={`nav-link ${isActive('/profile')}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <div className="avatar avatar-sm"><User size={14} /></div>
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
                </Link>
                <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <LogOut size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login')}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <LogIn size={16} /> Connexion
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
