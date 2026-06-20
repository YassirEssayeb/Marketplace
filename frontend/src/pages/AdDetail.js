import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const AdDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [msg, setMsg] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    api.get('/ads/' + id).then(r => setAd(r.data)).catch(() => navigate('/'));
  }, [id, navigate]);

  useEffect(() => {
    if (!user) return;
    api.get('/favorites/check/' + id).then(r => setFavorited(r.data.favorited)).catch(() => {});
  }, [id, user]);

  const sendMessage = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post('/messages', { receiver_id: ad.user_id, content: msg, ad_id: ad.id });
      alert('Message envoyé !');
      setMsg('');
      navigate('/messages');
    } catch { alert('Erreur'); }
  };

  const toggleFavorite = async () => {
    if (!user) return navigate('/login');
    try {
      if (favorited) {
        await api.delete('/favorites/' + id);
        setFavorited(false);
      } else {
        await api.post('/favorites/' + id);
        setFavorited(true);
      }
    } catch { alert('Erreur'); }
  };

  const reportAd = async () => {
    const reason = prompt('Motif du signalement :');
    if (!reason) return;
    try {
      await api.post('/ads/' + id + '/report', { reason });
      alert('Annonce signalée');
    } catch { alert('Erreur'); }
  };

  if (!ad) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-400)' }}>
      ⏳ Chargement...
    </div>
  );

  return (
    <div className="page-container fade-in">
      <Link to="/" style={{ color: 'var(--primary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1rem' }}>
        ← Retour aux annonces
      </Link>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
        <div>
          {ad.images && ad.images.length > 0 ? (
            <div>
              <div className="gallery-main">
                <img src={getImageUrl(ad.images[currentImage])} alt={ad.title} />
              </div>
              {ad.images.length > 1 && (
                <div className="gallery-thumbs">
                  {ad.images.map((img, i) => (
                    <div key={i} className={`gallery-thumb ${i === currentImage ? 'active' : ''}`} onClick={() => setCurrentImage(i)}>
                      <img src={getImageUrl(img)} alt="" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="gallery-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '3rem', color: 'var(--gray-300)' }}>📷</span>
            </div>
          )}
        </div>
        <div>
          <span className="status-badge status-active" style={{ marginBottom: '0.75rem' }}>{ad.status === 'active' ? 'Active' : ad.status}</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.3, marginBottom: '0.75rem' }}>{ad.title}</h1>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.5rem' }}>
            {ad.price ? ad.price.toLocaleString('fr-FR') + ' €' : 'Prix non spécifié'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', padding: '1.25rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Catégorie</span>
              <span style={{ fontWeight: 500 }}>{ad.category_name || 'Non spécifiée'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Localisation</span>
              <span style={{ fontWeight: 500 }}>{ad.location || 'Non spécifiée'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Vendeur</span>
              <span style={{ fontWeight: 500 }}>{ad.user_name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Téléphone</span>
              <span style={{ fontWeight: 500 }}>{ad.user_phone || 'Non communiqué'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Publiée le</span>
              <span style={{ fontWeight: 500 }}>{new Date(ad.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
          <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Description</h3>
          <p style={{ whiteSpace: 'pre-wrap', color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {ad.description || 'Aucune description fournie.'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {user && user.id !== ad.user_id && (
              <div style={{ width: '100%', marginBottom: '0.75rem' }}>
                <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Votre message..." rows="3" className="form-input" style={{ marginBottom: '0.5rem' }} />
                <button onClick={sendMessage} className="btn btn-primary">Envoyer un message</button>
              </div>
            )}
            {user && (
              <button onClick={toggleFavorite} className={`btn ${favorited ? 'btn-danger' : 'btn-outline'}`}>
                {favorited ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
              </button>
            )}
            {user && (
              <button onClick={reportAd} className="btn btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                ⚠️ Signaler
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetail;
