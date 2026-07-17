import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const PublicProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, formatPrice, currency } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/auth/user/' + id).then(r => {
      setProfile(r.data);
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin mb-4"></div>
      <p className="text-on-surface-variant font-body-md">{t('pubprofile_loading')}</p>
    </main>
  );

  if (error || !profile) return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen flex flex-col items-center justify-center">
      <span className="material-symbols-outlined text-6xl text-outline mb-4">person_off</span>
      <p className="text-on-surface-variant font-body-md">{t('pubprofile_not_found')}</p>
      <Link to="/" className="mt-4 text-secondary font-bold hover:underline no-underline">{t('pubprofile_back')}</Link>
    </main>
  );

  return (
    <main className="mt-20">
      <section className="bg-surface-container-lowest border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full border-4 border-surface-container-high overflow-hidden bg-surface-container-high flex items-center justify-center ambient-shadow">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-on-surface-variant">{profile.name?.charAt(0) || 'U'}</span>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="font-headline-lg text-headline-lg text-primary">{profile.name || t('pubprofile_user')}</h1>
                  {profile.headline && (
                    <p className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider mt-1">{profile.headline}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {user && user.id !== profile.id && (
                    <Link
                      to={`/messages?user=${profile.id}`}
                      className="flex items-center gap-2 px-8 py-3 bg-secondary text-on-secondary font-label-md text-label-md rounded-lg shadow-sm hover:opacity-90 transition-all active:scale-95 no-underline"
                    >
                      <span className="material-symbols-outlined text-[20px]">chat</span>
                      <span>{t('pubprofile_contact')}</span>
                    </Link>
                  )}
                </div>
              </div>
              {profile.bio && (
                <p className="font-body-lg text-body-lg text-on-surface max-w-3xl leading-relaxed">{profile.bio}</p>
              )}
              <div className="flex flex-wrap gap-8 pt-2">
                {profile.city && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[20px]">location_on</span>
                    <span className="font-label-md text-label-md text-primary">{profile.city}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">calendar_today</span>
                  <span className="font-label-md text-label-md text-primary">{t('pubprofile_joined')} {new Date(profile.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">inventory_2</span>
                  <span className="font-label-md text-label-md text-primary">{profile.totalListings || 0} {t('pubprofile_listings')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {profile.listings && profile.listings.length > 0 && (
          <section className="max-w-container-max mx-auto px-margin-desktop py-16">
            <h3 className="font-headline-sm text-headline-sm mb-6">{t('pubprofile_listings_by')} {profile.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {profile.listings.map(item => (
                <Link
                  key={item.id}
                  to={'/ads/' + item.id}
                  className="group bg-white border border-outline-variant rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 no-underline"
                >
                  <div className="relative h-48 overflow-hidden">
                    {item.images && item.images[0] ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src={getImageUrl(item.images[0])}
                        alt={item.title}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                        <span className="material-symbols-outlined text-4xl text-outline">image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-primary mb-2 truncate">{item.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {item.price ? formatPrice(item.price, currency) : t('price_na')}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.status === 'active' ? 'bg-green-50 text-green-700' :
                        item.status === 'sold' ? 'bg-red-50 text-red-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
};

export default PublicProfile;
