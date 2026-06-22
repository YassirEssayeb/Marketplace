import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, ArrowLeft } from '../utils/icons';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSent(true);
      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '440px' }}>
      <div className="card-lg" style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mot de passe oublié</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Saisissez votre email pour recevoir un lien de réinitialisation.
        </p>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <Mail size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--gray-600)' }}>{msg}</p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowLeft size={16} /> Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="toast toast-error" style={{ marginBottom: '1rem', animation: 'none' }}>{error}</div>}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" placeholder="votre@email.fr" value={email} onChange={e => setEmail(e.target.value)} required className="form-input" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Envoyer</button>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ArrowLeft size={14} /> Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
