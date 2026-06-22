import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, CheckCircle, AlertCircle } from '../utils/icons';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', city: '' });
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwError('Les mots de passe ne correspondent pas');
    try {
      await api.put('/auth/me/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwSaved(true);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSaved(false), 2000);
    } catch (err) {
      setPwError(err.response?.data?.error || 'Erreur');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '520px' }}>
      <div className="card-lg" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mon profil</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Gérez vos informations personnelles.</p>
        {saved && <div className="toast toast-success" style={{ marginBottom: '1rem', animation: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle size={16} /> Profil mis à jour !</div>}
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <User size={18} /> Enregistrer
          </button>
        </form>

        <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--gray-200)' }} />

        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Changer de mot de passe</h3>
        {pwSaved && <div className="toast toast-success" style={{ marginBottom: '1rem', animation: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle size={16} /> Mot de passe modifié !</div>}
        {pwError && <div className="toast toast-error" style={{ marginBottom: '1rem', animation: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><AlertCircle size={16} /> {pwError}</div>}
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label className="form-label">Mot de passe actuel</label>
            <input type="password" placeholder="••••••••" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Nouveau mot de passe</label>
            <input type="password" placeholder="••••••••" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required className="form-input" minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirmer le nouveau mot de passe</label>
            <input type="password" placeholder="••••••••" value={pwForm.confirmPassword} onChange={e => setPwForm({...pwForm, confirmPassword: e.target.value})} required className="form-input" minLength={6} />
          </div>
          <button type="submit" className="btn btn-warning" style={{ width: '100%', padding: '0.75rem', color: 'white' }}>Modifier le mot de passe</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
