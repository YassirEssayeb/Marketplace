import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) return (
    <div className="page-container" style={{ maxWidth: '520px' }}>
      <div className="card-lg" style={{ textAlign: 'center', padding: '4rem', marginTop: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Message envoyé !</h2>
        <p style={{ color: 'var(--gray-500)' }}>Nous vous répondrons dans les plus brefs délais.</p>
      </div>
    </div>
  );

  return (
    <div className="page-container" style={{ maxWidth: '560px' }}>
      <div className="card-lg" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Contact</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Une question ? Écrivez-nous.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom</label>
            <input placeholder="Votre nom" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" placeholder="vous@exemple.fr" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea placeholder="Votre message..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows="5" required className="form-input" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Envoyer</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
