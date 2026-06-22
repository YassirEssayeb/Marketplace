import React, { useState } from 'react';
import api from '../services/api';
import { Mail, Phone, MapPin, Send } from '../utils/icons';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/contact', form);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '640px' }}>
      <div className="card-lg" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Contact</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Une question ? Écrivez-nous.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
            <Mail size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Email</p>
              <a href="mailto:contact@marche-annonces.fr" style={{ color: 'var(--primary)' }}>contact@marche-annonces.fr</a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
            <Phone size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Téléphone</p>
              <p style={{ color: 'var(--gray-600)' }}>01 23 45 67 89</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
            <MapPin size={24} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Adresse</p>
              <p style={{ color: 'var(--gray-600)' }}>Paris, France</p>
            </div>
          </div>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--success-light)', borderRadius: 'var(--radius-sm)' }}>
            <CheckCircleIcon size={40} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Message envoyé !</p>
            <p style={{ color: 'var(--gray-500)' }}>Nous vous répondrons dans les plus brefs délais.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="toast toast-error" style={{ marginBottom: '1rem', animation: 'none' }}>{error}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input name="name" placeholder="Votre nom" value={form.name} onChange={handleChange} required className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input name="email" type="email" placeholder="votre@email.fr" value={form.email} onChange={handleChange} required className="form-input" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Sujet *</label>
              <input name="subject" placeholder="Sujet de votre message" value={form.subject} onChange={handleChange} required className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea name="message" placeholder="Votre message..." value={form.message} onChange={handleChange} rows="5" required className="form-input" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={18} /> Envoyer le message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const CheckCircleIcon = ({ size = 40, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default Contact;
