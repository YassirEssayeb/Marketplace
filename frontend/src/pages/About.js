import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">{t('about_title')}</h1>
        <p className="font-body-md text-on-surface-variant mb-8">{t('about_who')}</p>

        <div className="bg-white p-8 rounded-xl border border-outline-variant space-y-6">
          <p className="font-body-md text-on-surface leading-relaxed">
            {t('about_desc')}
          </p>
          <p className="font-body-md text-on-surface leading-relaxed">
            {t('about_mission')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-outline-variant">
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-secondary mb-3 block">verified</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{t('about_verified_title')}</h3>
              <p className="font-body-sm text-on-surface-variant">{t('about_verified_desc')}</p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-secondary mb-3 block">shield</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{t('about_safe_title')}</h3>
              <p className="font-body-sm text-on-surface-variant">{t('about_safe_desc')}</p>
            </div>
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-secondary mb-3 block">public</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{t('about_free_title')}</h3>
              <p className="font-body-sm text-on-surface-variant">{t('about_free_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
