import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from '../utils/icons';

const Register = () => {
  const [data, setData] = useState({ name: '', email: '', password: '', phone: '', city: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(data.name, data.email, data.password, data.phone, data.city);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || "Erreur d'inscription");
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '480px' }}>
      <div className="card-lg" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Inscription</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Créez votre compte gratuitement.</p>
        {error && <div className="toast toast-error" style={{ marginBottom: '1rem', animation: 'none' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom complet *</label>
            <input name="name" placeholder="Votre nom" value={data.name} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input name="email" type="email" placeholder="votre@email.fr" value={data.email} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe *</label>
            <input name="password" type="password" placeholder="••••••••" value={data.password} onChange={handleChange} required className="form-input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input name="phone" placeholder="Téléphone" value={data.phone} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Ville</label>
              <input name="city" placeholder="Ville" value={data.city} onChange={handleChange} className="form-input" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <User size={18} /> S'inscrire
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.9rem' }}>
          Déjà un compte ? <Link to="/login" style={{ fontWeight: 600 }}>Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
