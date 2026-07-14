import React from 'react';

const About = () => (
  <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen">
    <div className="max-w-3xl mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-primary mb-2">À propos</h1>
      <p className="font-body-md text-on-surface-variant mb-8">Qui sommes-nous ?</p>

      <div className="bg-white p-8 rounded-xl border border-outline-variant space-y-6">
        <p className="font-body-md text-on-surface leading-relaxed">
          ProMarket est une plateforme de petites annonces en ligne qui permet aux utilisateurs de publier, rechercher et échanger autour d'annonces variées : emploi, immobilier, véhicules, mode, maison, multimédia, loisirs et services.
        </p>
        <p className="font-body-md text-on-surface leading-relaxed">
          Notre mission est de faciliter les échanges entre particuliers et professionnels dans un environnement simple, rapide et sécurisé.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-outline-variant">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-secondary mb-3 block">verified</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Vendeurs vérifiés</h3>
            <p className="font-body-sm text-on-surface-variant">Chaque vendeur est certifié pour garantir la qualité.</p>
          </div>
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-secondary mb-3 block">shield</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Transactions sûres</h3>
            <p className="font-body-sm text-on-surface-variant">Échangez en toute confiance grâce à notre système sécurisé.</p>
          </div>
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-secondary mb-3 block">public</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">100% gratuit</h3>
            <p className="font-body-sm text-on-surface-variant">Publiez vos annonces gratuitement, sans frais cachés.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
);

export default About;
