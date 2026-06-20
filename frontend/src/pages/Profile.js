import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', city: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/auth/me').then(r => {
      setForm({ name: r.data.name, phone: r.data.phone || '', city: r.data.city || '' });
    }).catch(() => {});
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/me', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { alert('Erreur'); }
  };

  return (
    <div className="page-container" style={{ maxWidth: '520px' }}>
      <div className="card-lg" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Mon profil</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Gérez vos informations personnelles.</p>
        {saved && <div className="toast toast-success" style={{ marginBottom: '1rem', animation: 'none' }}>Profil mis à jour !</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <input name="name" placeholder="Nom complet" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input placeholder="Email" value={user?.email || ''} disabled className="form-input" style={{ background: 'var(--gray-100)', cursor: 'not-allowed' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input name="phone" placeholder="Téléphone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Ville</label>
              <input name="city" placeholder="Ville" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="form-input" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Enregistrer</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
