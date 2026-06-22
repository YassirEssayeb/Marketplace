import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft } from '../utils/icons';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError('Les mots de passe ne correspondent pas');
    setError('');
    try {
      await api.post('/auth/reset-password', { token: searchParams.get('token'), password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '440px' }}>
      <div className="card-lg" style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Nouveau mot de passe</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Choisissez un nouveau mot de passe.
        </p>
        <form onSubmit={handleSubmit}>
          {error && <div className="toast toast-error" style={{ marginBottom: '1rem', animation: 'none' }}>{error}</div>}
          <div className="form-group">
            <label className="form-label">Nouveau mot de passe</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="form-input" minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} required className="form-input" minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Réinitialiser</button>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/login" style={{ fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <ArrowLeft size={14} /> Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
