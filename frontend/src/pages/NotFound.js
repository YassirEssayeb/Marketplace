import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page-container" style={{ textAlign: 'center' }}>
    <div style={{ marginTop: '4rem' }}>
      <div style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--gray-200)', lineHeight: 1 }}>404</div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Page introuvable</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
    </div>
  </div>
);

export default NotFound;
