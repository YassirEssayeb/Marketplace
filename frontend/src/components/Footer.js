import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-surface-container-highest border-t border-outline-variant">
    <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
        <div className="max-w-sm">
          <Link to="/" className="font-headline-sm text-headline-sm font-bold text-primary block mb-6 no-underline">ProMarket</Link>
          <p className="font-body-sm text-body-sm text-on-surface-variant">La marketplace de référence pour les actifs professionnels vérifiés, les produits premium et l'approvisionnement de niveau entreprise.</p>
          <div className="flex gap-4 mt-8">
            <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all no-underline text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">language</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all no-underline text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">share</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all no-underline text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">mail</span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          <div>
            <h4 className="font-label-md text-label-md font-bold text-primary mb-6">Marketplace</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><Link to="/browse" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Parcourir tout</Link></li>
              <li><Link to="/browse?tab=sellers" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Vendeurs premium</Link></li>
              <li><Link to="/browse?sort=trending" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Tendances</Link></li>
              <li><Link to="/browse?sort=newest" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Nouveautés</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-primary mb-6">Ressources</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Centre d'aide</a></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Guide d'approvisionnement</a></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Programme partenaire</a></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Confiance & Sécurité</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-primary mb-6">Entreprise</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><Link to="/about" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">À propos</Link></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Carrières</a></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Presse</a></li>
              <li><Link to="/contact" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant gap-4">
        <p className="font-label-sm text-label-sm text-on-surface-variant">&copy; {new Date().getFullYear()} ProMarket Global. Tous droits réservés.</p>
        <div className="flex gap-8">
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Politique de confidentialité</a>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Conditions d'utilisation</a>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">Confiance & Sécurité</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
