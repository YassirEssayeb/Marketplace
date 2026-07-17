import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const AdDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, formatPrice, currency } = useLanguage();
  const [ad, setAd] = useState(null);
  const [msg, setMsg] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedAds, setRelatedAds] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/ads/' + id).then(r => {
      setAd(r.data);
      if (r.data.category_id) {
        api.get('/ads?category=' + r.data.category_id + '&limit=4').then(r2 => {
          setRelatedAds(r2.data.ads.filter(a => a.id !== parseInt(id)).slice(0, 4));
        }).catch(() => {});
      }
    }).catch(() => navigate('/'));
  }, [id, navigate]);

  useEffect(() => {
    if (!user) return;
    api.get('/favorites/check/' + id).then(r => setFavorited(r.data.favorited)).catch(() => {});
  }, [id, user]);

  const sendMessage = async () => {
    if (!user) return navigate('/login');
    if (!msg.trim()) return;
    try {
      await api.post('/messages', { receiver_id: ad.user_id, content: msg, ad_id: ad.id });
      setMsg('');
      navigate('/messages');
    } catch { alert(t('detail_err_send')); }
  };

  const toggleFavorite = async () => {
    if (!user) return navigate('/login');
    try {
      if (favorited) {
        await api.delete('/favorites/' + id);
        setFavorited(false);
      } else {
        await api.post('/favorites/' + id);
        setFavorited(true);
      }
    } catch { alert('Error'); }
  };

  const deleteAd = async () => {
    if (!window.confirm(t('detail_confirm_delete'))) return;
    try {
      await api.delete('/ads/' + id);
      navigate('/my-ads');
    } catch { alert('Error'); }
  };

  const reportAd = async () => {
    const reason = prompt(t('detail_report_reason'));
    if (!reason) return;
    try {
      await api.post('/ads/' + id + '/report', { reason });
      alert(t('detail_reported'));
    } catch { alert('Error'); }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + t('detail_min_ago');
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + t('detail_h_ago');
    const days = Math.floor(hours / 24);
    if (days < 30) return days + t('detail_d_ago');
    const months = Math.floor(days / 30);
    return months + (months > 1 ? t('detail_months_ago') : t('detail_month_ago'));
  };

  if (!ad) return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin mb-4"></div>
      <p className="text-on-surface-variant font-body-md">Loading...</p>
    </main>
  );

  const images = ad.images && ad.images.length > 0 ? ad.images : [];
  const specs = [
    { label: t('detail_category'), value: ad.category_name || 'N/A', icon: 'category' },
    { label: t('detail_condition'), value: ad.status === 'active' ? t('detail_available') : ad.status === 'sold' ? t('detail_sold') : t('detail_archived'), icon: 'check_circle' },
    { label: t('detail_location'), value: ad.location || 'N/A', icon: 'location_on' },
    { label: t('detail_posted'), value: timeAgo(ad.created_at), icon: 'schedule' },
    { label: t('detail_updated'), value: timeAgo(ad.updated_at), icon: 'update' },
    { label: t('detail_seller'), value: ad.user_name || t('detail_unknown'), icon: 'person' },
  ];

  return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
        <Link to="/" className="hover:text-primary no-underline text-on-surface-variant">{t('detail_home')}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link to="/browse" className="hover:text-primary no-underline text-on-surface-variant">{t('detail_browse')}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        {ad.category_name && (
          <>
            <Link to={'/browse?category=' + ad.category_id} className="hover:text-primary no-underline text-on-surface-variant">{ad.category_name}</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </>
        )}
        <span className="text-primary font-medium truncate max-w-[200px]">{ad.title}</span>
      </nav>

      {/* Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl overflow-hidden border border-outline-variant bg-white group cursor-zoom-in h-[500px]">
            {images.length > 0 ? (
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={getImageUrl(images[currentImage])}
                alt={ad.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-8xl text-outline">image</span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    i === currentImage ? 'border-secondary shadow-md scale-105' : 'border-outline-variant hover:border-secondary/50'
                  }`}
                >
                  <img className="w-full h-full object-cover" src={getImageUrl(img)} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          {/* Title & Status */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-surface-container px-3 py-1 rounded-full text-label-sm font-label-sm text-on-surface-variant border border-outline-variant">
                {ad.category_name || t('detail_listing')}
              </span>
              <span className={`px-3 py-1 rounded-full text-label-sm font-label-sm font-bold ${
                ad.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' :
                ad.status === 'sold' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {ad.status === 'active' ? t('detail_available') : ad.status === 'sold' ? t('detail_sold') : t('detail_archived')}
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-3">{ad.title}</h1>
            <div className="flex items-center gap-4 text-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                {timeAgo(ad.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {ad.location || t('detail_location_fallback')}
              </span>
            </div>
          </div>

          {/* Price Card */}
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-display-lg font-display-lg text-primary">
                {ad.price ? formatPrice(ad.price, currency) : t('price_na')}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {user && user.id !== ad.user_id ? (
                <>
                  <button
                    onClick={sendMessage}
                    className="w-full bg-secondary text-white py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border-none"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span> {t('detail_send_message')}
                  </button>
                  <textarea
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    placeholder={t('detail_message_placeholder')}
                    rows="3"
                    className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none resize-none"
                  />
                </>
              ) : !user ? (
                <Link
                  to="/login"
                  className="w-full bg-secondary text-white py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 no-underline text-center"
                >
                  <span className="material-symbols-outlined text-[20px]">login</span> {t('detail_login_contact')}
                </Link>
              ) : null}
            </div>

            {/* Quick Info */}
            <div className="mt-6 pt-6 border-t border-outline-variant grid gap-4">
              {ad.location && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <p className="text-label-sm font-bold">{t('detail_location')}</p>
                    <p className="text-xs text-on-surface-variant">{ad.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">calendar_today</span>
                </div>
                <div>
                  <p className="text-label-sm font-bold">{t('detail_posted_on')}</p>
                  <p className="text-xs text-on-surface-variant">{new Date(ad.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <Link to={`/user/${ad.user_id}`} className="flex items-center gap-3 no-underline">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary overflow-hidden">
                  {ad.user_avatar_url ? (
                    <img src={ad.user_avatar_url} alt={ad.user_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined">person</span>
                  )}
                </div>
                <div>
                  <p className="text-label-sm font-bold">{t('detail_seller')}</p>
                  <p className="text-xs text-on-surface-variant">{ad.user_name}</p>
                </div>
              </Link>
              {ad.user_phone && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">phone</span>
                  </div>
                  <div>
                    <p className="text-label-sm font-bold">{t('detail_phone')}</p>
                    <p className="text-xs text-on-surface-variant">{ad.user_phone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Owner actions */}
            {user && user.id === ad.user_id && (
              <div className="mt-6 pt-6 border-t border-outline-variant flex gap-3">
                <Link
                  to={'/ads/' + ad.id + '/edit'}
                  className="flex-1 bg-surface-container border border-outline-variant text-primary py-3 rounded-lg font-label-md text-label-md font-bold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 no-underline text-center"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span> {t('detail_edit')}
                </Link>
                <button
                  onClick={deleteAd}
                  className="flex-1 bg-error-container border border-error-container text-on-error-container py-3 rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span> {t('detail_delete')}
                </button>
              </div>
            )}

            {/* Favorite & Report */}
            <div className="mt-4 flex gap-3">
              {user && (
                <button
                  onClick={toggleFavorite}
                  className={`flex-1 border py-3 rounded-lg font-label-md text-label-md font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    favorited
                      ? 'bg-error-container border-error-container text-on-error-container'
                      : 'bg-white border-outline-variant text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]" style={favorited ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {favorited ? 'favorite' : 'favorite_border'}
                  </span>
                  {favorited ? t('detail_favorited') : t('detail_add_fav')}
                </button>
              )}
              {user && user.id !== ad.user_id && (
                <button
                  onClick={reportAd}
                  className="border border-outline-variant py-3 px-4 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
                >
                  <span className="material-symbols-outlined text-[18px]">flag</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-20">
        <div className="flex gap-10 border-b border-outline-variant mb-8">
          {['description', 'specifications', 'seller'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 border-b-2 font-headline-sm transition-colors bg-transparent border-x-0 border-t-0 cursor-pointer ${
                activeTab === tab
                  ? 'border-secondary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab === 'description' && t('detail_description')}
              {tab === 'specifications' && t('detail_specs')}
              {tab === 'seller' && t('detail_about_seller')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="text-on-surface-variant font-body-md text-body-md leading-relaxed whitespace-pre-wrap">
                {ad.description || t('detail_no_desc')}
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specs.map((s, i) => (
                  <div key={i} className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">{s.icon}</span>
                      <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">{s.label}</p>
                    </div>
                    <p className="font-bold text-primary">{s.value}</p>
                  </div>
                ))}
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">tag</span>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">{t('detail_listing_id')}</p>
                  </div>
                  <p className="font-bold text-primary">#{ad.id}</p>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">sell</span>
                    <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">{t('detail_price')}</p>
                  </div>
                  <p className="font-bold text-primary">{ad.price ? formatPrice(ad.price, currency) : t('price_na')}</p>
                </div>
              </div>
            )}

            {/* Seller Tab */}
            {activeTab === 'seller' && (
              <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant">
                <div className="flex items-center gap-6 mb-6">
                  <Link to={`/user/${ad.user_id}`} className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center border-2 border-secondary overflow-hidden no-underline">
                    {ad.user_avatar_url ? (
                      <img src={ad.user_avatar_url} alt={ad.user_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
                    )}
                  </Link>
                  <div>
                    <Link to={`/user/${ad.user_id}`} className="font-headline-md text-headline-md text-primary no-underline hover:underline">{ad.user_name}</Link>
                    <p className="text-sm text-on-surface-variant">{t('detail_member_since')} {new Date(ad.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                    {ad.user_city && (
                      <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {ad.user_city}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                  {t('detail_verified_text')}
                </p>
                {user && user.id !== ad.user_id && (
                  <Link
                    to={`/messages?user=${ad.user_id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-secondary text-secondary rounded-lg font-bold text-sm hover:bg-secondary hover:text-white transition-all no-underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span> {t('detail_contact_seller')}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedAds.length > 0 && (
        <div className="mt-24">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-2">{t('detail_related')}</h2>
              <p className="text-on-surface-variant font-body-md">{t('detail_more_from')} {ad.category_name || t('detail_this_category')}</p>
            </div>
            <Link to={'/browse?category=' + ad.category_id} className="text-secondary font-bold hover:underline flex items-center gap-1 no-underline">
              {t('detail_view_all')} <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedAds.map((item) => (
              <Link
                key={item.id}
                to={'/ads/' + item.id}
                className="group bg-white border border-outline-variant rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 no-underline"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={item.images && item.images[0] ? getImageUrl(item.images[0]) : ''}
                    alt={item.title}
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1">{item.category_name}</p>
                  <h4 className="font-bold text-primary mb-2 truncate">{item.title}</h4>
                  <span className="text-lg font-bold text-primary">
                    {item.price ? formatPrice(item.price, currency) : t('price_na')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default AdDetail;
