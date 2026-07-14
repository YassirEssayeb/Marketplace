import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="font-display-lg text-display-lg text-surface-container-high mb-4" style={{ fontSize: '8rem', lineHeight: 1 }}>404</div>
      <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Page introuvable</h2>
      <p className="font-body-md text-on-surface-variant mb-8">La page que vous cherchez n'existe pas ou a été déplacée.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all no-underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Retour à l'accueil
      </Link>
    </div>
  </main>
);

export default NotFound;
