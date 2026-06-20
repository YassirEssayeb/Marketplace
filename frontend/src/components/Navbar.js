import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!user) { setUnread(0); return; }
    api.get('/messages/unread-count').then(r => setUnread(r.data.count)).catch(() => {});
    const interval = setInterval(() => {
      api.get('/messages/unread-count').then(r => setUnread(r.data.count)).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Marché aux Annonces</Link>
      <div className="navbar-links">
        <button onClick={toggle} className="nav-link" title={dark ? 'Mode clair' : 'Mode sombre'} style={{ fontSize: '1.15rem', lineHeight: 1, border: 'none', background: 'none', cursor: 'pointer' }}>
          {dark ? '☀️' : '🌙'}
        </button>
        <Link to="/" className={`nav-link ${isActive('/')}`}>Accueil</Link>
        <Link to="/ads/new" className={`nav-link ${isActive('/ads/new')}`}>Déposer une annonce</Link>
        {user ? (
          <>
            <Link to="/my-ads" className={`nav-link ${isActive('/my-ads')}`}>Mes annonces</Link>
            <Link to="/favorites" className={`nav-link ${isActive('/favorites')}`}>Favoris</Link>
            {user.is_admin && <Link to="/admin" className="nav-link nav-link-admin">Admin</Link>}
            <Link to="/messages" className={`nav-link ${isActive('/messages')}`}>
              Messages{unread > 0 && <span className="badge" style={{ marginLeft: '0.3rem' }}>{unread}</span>}
            </Link>
            <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>{user.name}</Link>
            <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline btn-sm">Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login" className={`nav-link ${isActive('/login')}`}>Connexion</Link>
            <Link to="/register" className={`nav-link ${isActive('/register')}`}>Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
