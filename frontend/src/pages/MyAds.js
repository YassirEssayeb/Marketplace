import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Pencil, Trash2, Package, CheckCircle } from '../utils/icons';

const MyAds = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/ads/my').then(r => setAds(r.data)).catch(() => {});
  }, [user, navigate]);

  const deleteAd = async (id) => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    try {
      await api.delete('/ads/' + id);
      setAds(ads.filter(a => a.id !== id));
    } catch { alert('Erreur'); }
  };

  const markAsSold = async (id) => {
    try {
      await api.put('/ads/' + id, { status: 'sold' });
      setAds(ads.map(a => a.id === id ? { ...a, status: 'sold' } : a));
    } catch { alert('Erreur'); }
  };

  const statusClass = (s) => s === 'active' ? 'status-badge status-active' : s === 'sold' ? 'status-badge status-sold' : 'status-badge status-archived';
  const statusLabel = (s) => s === 'active' ? 'Active' : s === 'sold' ? 'Vendue' : 'Archivée';

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Mes annonces</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{ads.length} annonce{ads.length > 1 ? 's' : ''}</p>
        </div>
        <Link to="/ads/new" className="btn btn-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <Plus size={18} /> Nouvelle annonce
        </Link>
      </div>
      {ads.length === 0 ? (
        <div className="card-lg" style={{ textAlign: 'center', padding: '4rem' }}>
          <Package size={48} style={{ color: 'var(--gray-300)', marginBottom: '1rem' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Aucune annonce</p>
          <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem' }}>Publiez votre première annonce dès maintenant.</p>
          <Link to="/ads/new" className="btn btn-primary">Publier une annonce</Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Titre</th><th>Prix</th><th>Statut</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map(ad => (
                <tr key={ad.id}>
                  <td><Link to={'/ads/' + ad.id} style={{ fontWeight: 600 }}>{ad.title}</Link></td>
                  <td style={{ fontWeight: 600 }}>{ad.price ? ad.price.toLocaleString('fr-FR') + ' €' : '-'}</td>
                  <td><span className={statusClass(ad.status)}>{statusLabel(ad.status)}</span></td>
                  <td style={{ color: 'var(--gray-500)' }}>{new Date(ad.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    {ad.status === 'active' && (
                      <button onClick={() => markAsSold(ad.id)} className="btn btn-success btn-sm" style={{ marginRight: '0.375rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <CheckCircle size={14} /> Vendu
                      </button>
                    )}
                    <Link to={'/ads/' + ad.id + '/edit'} className="btn btn-warning btn-sm" style={{ marginRight: '0.375rem', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Pencil size={14} /> Modifier
                    </Link>
                    <button onClick={() => deleteAd(ad.id)} className="btn btn-danger btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAds;
