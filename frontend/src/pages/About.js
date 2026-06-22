import React from 'react';
import { Info } from '../utils/icons';

const About = () => (
  <div className="page-container" style={{ maxWidth: '720px' }}>
    <div className="card-lg" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <Info size={20} style={{ color: 'var(--primary)' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>À propos</h2>
      </div>
      <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Qui sommes-nous ?</p>
      <p style={{ lineHeight: 1.8, color: 'var(--gray-600)' }}>
        Marché aux Annonces est une plateforme de petites annonces en ligne qui permet aux utilisateurs de publier, rechercher et échanger autour d'annonces variées : emploi, immobilier, véhicules, mode, maison, multimédia, loisirs et services.
      </p>
      <p style={{ lineHeight: 1.8, color: 'var(--gray-600)', marginTop: '1rem' }}>
        Notre mission est de faciliter les échanges entre particuliers et professionnels dans un environnement simple, rapide et sécurisé.
      </p>
    </div>
  </div>
);

export default About;
