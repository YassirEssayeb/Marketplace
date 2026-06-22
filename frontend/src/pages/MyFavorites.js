import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { Heart, Image, Trash2 } from '../utils/icons';

const MyFavorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/favorites').then(r => setAds(r.data)).catch(() => {});
  }, [user, navigate]);

  const removeFavorite = async (adId) => {
    try {
      await api.delete('/favorites/' + adId);
      setAds(ads.filter(a => a.id !== adId));
    } catch {}
  };

  return (
    <div className="page-container">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mes favoris</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{ads.length} annonce{ads.length > 1 ? 's' : ''} sauvegardée{ads.length > 1 ? 's' : ''}.</p>
      {ads.length === 0 ? (
        <div className="card-lg" style={{ textAlign: 'center', padding: '4rem' }}>
          <Heart size={48} style={{ color: 'var(--gray-300)', marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Aucun favori</p>
          <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>Parcourez les annonces pour ajouter des favoris.</p>
          <Link to="/" className="btn btn-primary">Parcourir les annonces</Link>
        </div>
      ) : (
        <div className="ad-grid fade-in">
          {ads.map(ad => (
            <div key={ad.id} className="ad-card">
              <Link to={'/ads/' + ad.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="ad-card-image">
                  {ad.images && ad.images.length > 0 ? (
                    <img src={getImageUrl(ad.images[0])} alt={ad.title} />
                  ) : (
                    <Image size={40} style={{ color: 'var(--gray-400)' }} />
                  )}
                </div>
                <div className="ad-card-body">
                  <h3 className="ad-card-title">{ad.title}</h3>
                  <div className="ad-card-price">{ad.price ? ad.price.toLocaleString('fr-FR') + ' €' : 'Prix non spécifié'}</div>
                </div>
              </Link>
              <div style={{ padding: '0 1.25rem 1.25rem' }}>
                <button onClick={() => removeFavorite(ad.id)} className="btn btn-danger btn-sm" style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Trash2 size={14} /> Retirer des favoris
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
