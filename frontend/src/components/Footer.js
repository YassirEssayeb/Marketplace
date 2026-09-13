import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
  <footer className="bg-surface-container-highest border-t border-outline-variant">
    <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-margin-desktop py-12 sm:py-16 lg:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
        <div className="max-w-sm">
          <Link to="/" className="block mb-6 no-underline"><img src="/logo.png" alt="ProMarket" className="h-10 w-auto" /></Link>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t('footer_tagline')}</p>
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
            <h4 className="font-label-md text-label-md font-bold text-primary mb-6">{t('footer_company')}</h4>
            <ul className="space-y-4 list-none p-0 m-0">
              <li><Link to="/about" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_about')}</Link></li>
              <li><Link to="/contact" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors no-underline">{t('footer_contact')}</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant gap-4">
        <p className="font-label-sm text-label-sm text-on-surface-variant">{t('footer_copyright').replace('{year}', new Date().getFullYear())}</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
