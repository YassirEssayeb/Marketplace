import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Logo, Heart } from '../utils/icons';

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-inner">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Logo size={28} />
          <span className="footer-brand">Marché aux Annonces</span>
        </div>
        <p className="footer-desc">
          Votre plateforme de référence pour acheter et vendre des biens d'occasion près de chez vous. Simple, rapide et gratuit.
        </p>
      </div>
      <div>
        <h4 className="footer-title">Navigation</h4>
        <Link to="/" className="footer-link">Accueil</Link>
        <Link to="/browse" className="footer-link">Parcourir</Link>
        <Link to="/ads/new" className="footer-link">Déposer une annonce</Link>
        <Link to="/about" className="footer-link">À propos</Link>
      </div>
      <div>
        <h4 className="footer-title">Compte</h4>
        <Link to="/login" className="footer-link">Connexion</Link>
        <Link to="/register" className="footer-link">Inscription</Link>
        <Link to="/profile" className="footer-link">Mon profil</Link>
        <Link to="/contact" className="footer-link">Contact</Link>
      </div>
      <div>
        <h4 className="footer-title">Contact</h4>
        <div className="footer-contact-item">
          <Mail size={14} /> contact@marche-annonces.fr
        </div>
        <div className="footer-contact-item">
          <Phone size={14} /> 01 23 45 67 89
        </div>
        <div className="footer-contact-item">
          <MapPin size={14} /> Paris, France
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      &copy; {new Date().getFullYear()} Marché aux Annonces. Tous droits réservés. Fait avec <Heart size={12} style={{ display: 'inline', verticalAlign: 'middle', color: '#EF4444' }} />
    </div>
  </footer>
);

export default Footer;
