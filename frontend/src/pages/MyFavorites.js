import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const MyFavorites = () => {
  const { user } = useAuth();
  const { t, formatPrice, currency } = useLanguage();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/favorites').then(r => setAds(r.data)).catch(() => {});
  }, [user, navigate]);

  const removeFavorite = async (adId) => {
    try {
      await api.delete('/favorites/' + adId);
      setAds(ads.filter(a => a.id !== adId));
    } catch {}
  };

  return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen">
      <h1 className="font-headline-lg text-headline-lg text-primary mb-2">{t('myfav_title')}</h1>
      <p className="font-body-md text-on-surface-variant mb-8">{ads.length} {ads.length === 1 ? t('myfav_count_one') : t('myfav_count_other')}</p>

      {ads.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-outline-variant text-center">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">favorite</span>
          <p className="font-headline-sm text-headline-sm text-primary mb-2">{t('myfav_empty')}</p>
          <p className="font-body-md text-on-surface-variant mb-6">{t('myfav_empty_desc')}</p>
          <Link to="/browse" className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-md text-label-md font-bold no-underline">
            <span className="material-symbols-outlined text-[18px]">search</span> {t('myfav_browse')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ads.map(ad => {
            return (
              <div key={ad.id} className="group bg-white border border-outline-variant rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <Link to={'/ads/' + ad.id} className="no-underline">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                    {ad.images && ad.images.length > 0 ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={getImageUrl(ad.images[0])}
                        alt={ad.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-outline">image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="font-headline-sm text-headline-sm text-primary mb-1 truncate group-hover:text-secondary transition-colors">{ad.title}</h4>
                    <span className="font-headline-sm text-headline-sm text-primary">
                      {ad.price ? formatPrice(ad.price, currency) : t('price_na')}
                    </span>
                  </div>
                </Link>
                <div className="px-5 pb-5">
                  <button
                    onClick={() => removeFavorite(ad.id)}
                    className="w-full bg-error-container text-on-error-container border-none py-2.5 rounded-lg font-label-md text-label-md font-bold hover:opacity-80 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span> {t('myfav_remove')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default MyFavorites;
