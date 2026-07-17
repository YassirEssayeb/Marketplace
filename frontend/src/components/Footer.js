import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
  <footer className="bg-surface-container-highest border-t border-outline-variant">
    <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
        <div className="max-w-sm">
          <Link to="/" className="block mb-6 no-underline"><img src="/logo.png" alt="ProMarket" className="h-10 w-auto" /></Link>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t('footer_tagline')}</p>
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
            <h4 className="font-label-md text-label-md font-bold text-primary mb-6">{t('footer_marketplace')}</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><Link to="/browse" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_browse_all')}</Link></li>
              <li><Link to="/browse?tab=sellers" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_premium_sellers')}</Link></li>
              <li><Link to="/browse?sort=trending" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_trending')}</Link></li>
              <li><Link to="/browse?sort=newest" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_new_arrivals')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-primary mb-6">{t('footer_resources')}</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_help_center')}</a></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_sourcing_guide')}</a></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_partner_program')}</a></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_trust_safety')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-primary mb-6">{t('footer_company')}</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><Link to="/about" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_about')}</Link></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_careers')}</a></li>
              <li><a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_press')}</a></li>
              <li><Link to="/contact" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_contact')}</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant gap-4">
        <p className="font-label-sm text-label-sm text-on-surface-variant">{t('footer_copyright').replace('{year}', new Date().getFullYear())}</p>
        <div className="flex gap-8">
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_privacy')}</a>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_terms')}</a>
          <a href="#" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_trust_safety')}</a>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
