import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-inner">
      <div>
        <h4 className="footer-title">Marché aux Annonces</h4>
        <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>Votre plateforme de petites annonces en ligne.</p>
      </div>
      <div>
        <h4 className="footer-title">Liens</h4>
        <Link to="/" className="footer-link">Accueil</Link>
        <Link to="/ads/new" className="footer-link">Déposer une annonce</Link>
        <Link to="/about" className="footer-link">À propos</Link>
        <Link to="/contact" className="footer-link">Contact</Link>
      </div>
      <div>
        <h4 className="footer-title">Compte</h4>
        <Link to="/login" className="footer-link">Connexion</Link>
        <Link to="/register" className="footer-link">Inscription</Link>
      </div>
      <div>
        <h4 className="footer-title">Contact</h4>
        <p style={{ fontSize: '0.85rem' }}>contact@marche-annonces.fr</p>
        <p style={{ fontSize: '0.85rem' }}>01 23 45 67 89</p>
      </div>
    </div>
    <div className="footer-bottom">
      &copy; {new Date().getFullYear()} Marché aux Annonces. Tous droits réservés.
    </div>
  </footer>
);

export default Footer;
