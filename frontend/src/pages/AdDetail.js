import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { Heart, HeartFilled, Flag, Pencil, Trash2, MapPin, Folder, User, Phone, Clock, Send, ArrowLeft, Image } from '../utils/icons';

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

  const deleteAd = async () => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    try {
      await api.delete('/ads/' + id);
      navigate('/my-ads');
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
    <div className="empty-state" style={{ padding: '4rem' }}>
      <div className="spinner" style={{ width: 32, height: 32, border: '3px solid var(--gray-200)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 0.75rem' }} />
      <p>Chargement...</p>
    </div>
  );

  return (
    <div className="page-container animate-fade-in">
      <Link to="/browse" style={{ color: 'var(--primary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.25rem' }}>
        <ArrowLeft size={18} /> Retour aux annonces
      </Link>

      <div className="detail-layout">
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
              <Image size={48} style={{ color: '#A1A1AA' }} />
            </div>
          )}

          <div className="card-lg" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Description</h3>
            <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {ad.description || 'Aucune description fournie.'}
            </p>
          </div>
        </div>

        <div>
          <div className="card-lg" style={{ position: 'sticky', top: '88px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span className={`status-badge status-${ad.status}`}>
                {ad.status === 'active' ? 'Active' : ad.status === 'sold' ? 'Vendue' : 'Archivée'}
              </span>
              {user && (
                <button onClick={toggleFavorite} className="btn btn-ghost" style={{ color: favorited ? 'var(--danger)' : 'var(--text-muted)', padding: '0.375rem' }}>
                  {favorited ? <HeartFilled size={20} /> : <Heart size={20} />}
                </button>
              )}
            </div>

            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: '0.75rem' }}>
              {ad.title}
            </h1>

            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.5rem', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}>
              {ad.price ? ad.price.toLocaleString('fr-FR') + ' €' : 'Prix non spécifié'}
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Folder size={16} /> Catégorie
                </span>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{ad.category_name || 'Non spécifiée'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <MapPin size={16} /> Localisation
                </span>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{ad.location || 'Non spécifiée'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <User size={16} /> Vendeur
                </span>
                <span style={{ fontWeight: 500, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <div className="avatar avatar-sm"><User size={12} /></div>
                  {ad.user_name}
                </span>
              </div>
              {ad.user_phone && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <Phone size={16} /> Téléphone
                  </span>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{ad.user_phone}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <Clock size={16} /> Publiée le
                </span>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{new Date(ad.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            <div className="divider" />

            {user && user.id !== ad.user_id && (
              <div style={{ marginBottom: '1rem' }}>
                <textarea
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  placeholder="Écrivez votre message au vendeur..."
                  rows="3"
                  className="form-input"
                  style={{ marginBottom: '0.625rem', resize: 'none' }}
                />
                <button onClick={sendMessage} className="btn btn-primary btn-block" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Send size={16} /> Envoyer un message
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
              {user && user.id === ad.user_id && (
                <>
                  <Link to={'/ads/' + ad.id + '/edit'} className="btn btn-warning" style={{ color: 'white', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                    <Pencil size={16} /> Modifier
                  </Link>
                  <button onClick={deleteAd} className="btn btn-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                    <Trash2 size={16} /> Supprimer
                  </button>
                </>
              )}
              {user && user.id !== ad.user_id && (
                <button onClick={reportAd} className="btn btn-ghost" style={{ color: 'var(--text-muted)', width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Flag size={14} /> Signaler cette annonce
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetail;
