import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const MyAds = () => {
  const { user } = useAuth();
  const { t, formatPrice, currency } = useLanguage();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/ads/my').then(r => setAds(r.data)).catch(() => {});
  }, [user, navigate]);

  const deleteAd = async (id) => {
    if (!window.confirm(t('myads_confirm_delete'))) return;
    try {
      await api.delete('/ads/' + id);
      setAds(ads.filter(a => a.id !== id));
    } catch { alert('Error'); }
  };

  const markAsSold = async (id) => {
    try {
      await api.put('/ads/' + id, { status: 'sold' });
      setAds(ads.map(a => a.id === id ? { ...a, status: 'sold' } : a));
    } catch { alert('Error'); }
  };

  const statusBadge = (s) => {
    const styles = {
      active: 'bg-green-50 text-green-700 border-green-200',
      sold: 'bg-blue-50 text-blue-700 border-blue-200',
      archived: 'bg-gray-50 text-gray-500 border-gray-200',
    };
    const labels = { active: t('myads_active'), sold: t('myads_sold'), archived: t('myads_archived') };
    return (
      <span className={`px-3 py-1 rounded-full text-label-sm font-label-sm border ${styles[s] || styles.active}`}>
        {labels[s] || s}
      </span>
    );
  };

  return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">{t('myads_title')}</h1>
          <p className="font-body-md text-on-surface-variant">{ads.length} {ads.length === 1 ? t('myads_listing') : t('myads_listings')}</p>
        </div>
        <Link
          to="/ads/new"
          className="bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 no-underline"
        >
          <span className="material-symbols-outlined text-[18px]">add</span> {t('myads_new')}
        </Link>
      </div>

      {ads.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-outline-variant text-center">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">inventory_2</span>
          <p className="font-headline-sm text-headline-sm text-primary mb-2">{t('myads_empty')}</p>
          <p className="font-body-md text-on-surface-variant mb-6">{t('myads_empty_desc')}</p>
          <Link to="/ads/new" className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-md text-label-md font-bold no-underline">
            <span className="material-symbols-outlined text-[18px]">add</span> {t('myads_post')}
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{t('myads_col_title')}</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{t('myads_col_price')}</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{t('myads_col_status')}</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{t('myads_col_date')}</th>
                <th className="text-right p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{t('myads_col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {ads.map(ad => {
                return (
                  <tr key={ad.id} className="border-b border-outline-variant/30 hover:bg-surface-bright transition-colors">
                    <td className="p-4">
                      <Link to={'/ads/' + ad.id} className="font-body-md font-semibold text-primary hover:text-secondary transition-colors no-underline">{ad.title}</Link>
                    </td>
                    <td className="p-4 font-headline-sm text-headline-sm text-primary">
                      {ad.price ? formatPrice(ad.price, currency) : '-'}
                    </td>
                    <td className="p-4">{statusBadge(ad.status)}</td>
                    <td className="p-4 text-body-sm text-on-surface-variant">{new Date(ad.created_at).toLocaleDateString('en-US')}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ad.status === 'active' && (
                          <button
                            onClick={() => markAsSold(ad.id)}
                            className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg font-label-sm text-label-sm hover:bg-green-100 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">check_circle</span> {t('myads_sold')}
                          </button>
                        )}
                        <Link
                          to={'/ads/' + ad.id + '/edit'}
                          className="bg-surface-container-high text-primary border border-outline-variant px-3 py-1.5 rounded-lg font-label-sm text-label-sm hover:bg-surface-container transition-colors flex items-center gap-1 no-underline"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span> {t('myads_edit')}
                        </Link>
                        <button
                          onClick={() => deleteAd(ad.id)}
                          className="bg-error-container text-on-error-container border-none px-3 py-1.5 rounded-lg font-label-sm text-label-sm hover:opacity-80 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default MyAds;
