import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '440px' }}>
      <div className="card-lg" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Connexion</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Connectez-vous à votre compte.</p>
        {error && <div className="toast toast-error" style={{ marginBottom: '1rem', animation: 'none' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" placeholder="vous@exemple.fr" value={email} onChange={e => setEmail(e.target.value)} required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Se connecter</button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.9rem' }}>
          Pas de compte ? <Link to="/register" style={{ fontWeight: 600 }}>Inscrivez-vous</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
