import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const statusColors = {
  active: 'bg-green-50 text-green-700 border border-green-200',
  sold: 'bg-red-50 text-red-700 border border-red-200',
  archived: 'bg-surface-variant text-on-surface-variant border border-outline-variant',
};

const SellerDashboard = () => {
  const { user, logout } = useAuth();
  const { t, formatPrice, currency } = useLanguage();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingAd, setUpdatingAd] = useState(null);
  const [listingsFilter, setListingsFilter] = useState('all');

  const statusLabels = { active: t('seller_dashboard_active'), sold: t('seller_dashboard_sold'), archived: t('seller_dashboard_archived') };

  const filteredListings = listingsFilter === 'all' ? listings : listings.filter(a => a.status === listingsFilter);

  useEffect(() => {
    if (!user) return navigate('/login');
    Promise.all([
      api.get('/ads/seller/stats').catch(() => ({ data: {} })),
      api.get('/ads/my').catch(() => ({ data: [] })),
    ]).then(([statsRes, listingsRes]) => {
      setStats(statsRes.data);
      setListings(Array.isArray(listingsRes.data) ? listingsRes.data : []);
      setLoading(false);
    });
  }, [user, navigate]);

  const updateAdStatus = async (adId, newStatus) => {
    setUpdatingAd(adId);
    try {
      const ad = listings.find(a => a.id === adId);
      await api.put('/ads/' + adId, { ...ad, status: newStatus });
      setListings(listings.map(a => a.id === adId ? { ...a, status: newStatus } : a));
      const res = await api.get('/ads/seller/stats');
      setStats(res.data);
    } catch { alert(t('seller_dashboard_err_update')); }
    setUpdatingAd(null);
  };

  const deleteAd = async (adId) => {
    if (!window.confirm(t('seller_dashboard_confirm_delete'))) return;
    try {
      await api.delete('/ads/' + adId);
      setListings(listings.filter(a => a.id !== adId));
      const res = await api.get('/ads/seller/stats');
      setStats(res.data);
    } catch { alert(t('seller_dashboard_err_delete')); }
  };

  const navItems = [
    { key: 'dashboard', icon: 'dashboard', label: t('seller_dashboard_tab') },
    { key: 'listings', icon: 'list_alt', label: t('seller_dashboard_listings') },
    { key: 'messages', icon: 'chat', label: t('seller_dashboard_messages') },
    { key: 'settings', icon: 'settings', label: t('seller_dashboard_settings') },
  ];

  const headers = { dashboard: t('seller_dashboard_overview'), listings: t('seller_dashboard_listings'), messages: t('seller_dashboard_messages'), settings: t('seller_dashboard_settings') };

  if (loading) return (
    <div className="flex min-h-screen">
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant z-50 flex flex-col p-4">
        <div className="px-2 py-6 mb-4">
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary">{t('seller_dashboard_studio')}</h1>
        </div>
      </aside>
      <main className="ml-64 flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin"></div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant z-50 flex flex-col p-4 gap-2">
        <div className="px-2 py-6 mb-4">
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary">{t('seller_dashboard_studio')}</h1>
          <p className="text-on-surface-variant font-label-md text-label-md mt-1">{t('seller_dashboard_portal')}</p>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full text-left border-none cursor-pointer ${
                activeNav === item.key
                  ? 'bg-secondary-fixed text-on-secondary-fixed font-bold'
                  : 'text-on-surface-variant hover:bg-surface-variant bg-transparent'
              }`}
            >
              <span className="material-symbols-outlined" style={activeNav === item.key ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              <span className="font-label-md">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-outline-variant flex flex-col gap-1">
          <Link to="/ads/new" className="w-full bg-secondary text-on-secondary py-3 rounded-lg font-bold flex items-center justify-center gap-2 mb-4 hover:opacity-90 active:scale-95 transition-all no-underline text-center">
            <span className="material-symbols-outlined">add</span>
            {t('seller_dashboard_new')}
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all w-full no-underline">
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-md">{t('seller_dashboard_support')}</span>
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all w-full text-left bg-transparent border-none cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md">{t('seller_dashboard_logout')}</span>
          </button>
        </div>
      </aside>

      <main className="ml-64 min-h-screen">
        <header className="h-20 bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-12 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-headline-md font-bold text-primary">{headers[activeNav]}</h2>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/messages" className="relative material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors no-underline">
              chat
              {stats?.unreadMessages > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>}
            </Link>
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant">
              <div className="text-right">
                <p className="font-label-md text-label-md text-primary">{user?.name || 'Seller'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant flex items-center justify-center">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-primary">{user?.name?.charAt(0) || 'V'}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-12 max-w-[1400px] mx-auto">
          {activeNav === 'dashboard' && stats && (
            <>
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                  { label: t('seller_dashboard_total'), value: stats.totalAds, icon: 'inventory_2', bg: 'bg-secondary-fixed', color: 'text-on-secondary-fixed' },
                  { label: t('seller_dashboard_active_count'), value: stats.activeAds, icon: 'check_circle', bg: 'bg-green-50', color: 'text-green-700' },
                  { label: t('seller_dashboard_favs'), value: stats.totalFavorites, icon: 'favorite', bg: 'bg-red-50', color: 'text-red-600' },
                  { label: t('seller_dashboard_msgs'), value: stats.totalMessages, icon: 'mail', bg: 'bg-primary-fixed', color: 'text-on-primary-fixed' },
                ].map(metric => (
                  <div key={metric.label} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
                    <div className={`p-3 ${metric.bg} rounded-lg ${metric.color} w-fit mb-4`}>
                      <span className="material-symbols-outlined">{metric.icon}</span>
                    </div>
                    <p className="text-on-surface-variant font-label-md mb-1 uppercase tracking-wider">{metric.label}</p>
                    <h3 className="font-headline-lg text-headline-lg">{metric.value}</h3>
                  </div>
                ))}
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-headline-sm text-headline-sm">{t('seller_dashboard_recent')}</h4>
                    <button onClick={() => setActiveNav('listings')} className="text-secondary font-label-md hover:underline bg-transparent border-none cursor-pointer">{t('seller_dashboard_view_all')}</button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {listings.slice(0, 5).map(ad => (
                      <div key={ad.id} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                          {ad.images && ad.images[0] ? (
                            <img src={getImageUrl(ad.images[0])} alt={ad.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-outline">inventory_2</span></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-label-md text-primary truncate">{ad.title}</h5>
                          <p className="text-on-surface-variant text-body-sm">{ad.price ? formatPrice(ad.price, currency) : t('price_na')}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColors[ad.status]}`}>
                            {statusLabels[ad.status]}
                          </span>
                        </div>
                        <Link to={'/ads/' + ad.id} className="material-symbols-outlined text-on-surface-variant no-underline">visibility</Link>
                      </div>
                    ))}
                    {listings.length === 0 && <p className="text-on-surface-variant text-center py-8">{t('seller_dashboard_no_listings')} <Link to="/ads/new" className="text-secondary">{t('seller_dashboard_create')}</Link></p>}
                  </div>
                </section>

                <section className="flex flex-col gap-6">
                  <h4 className="font-headline-sm text-headline-sm">{t('seller_dashboard_msgs')}</h4>
                  <div className="flex flex-col gap-4">
                    {stats.recentMessages && stats.recentMessages.length > 0 ? stats.recentMessages.map(m => (
                      <Link key={m.id} to="/messages" className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center gap-4 hover:shadow-md transition-shadow no-underline">
                        <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {m.sender_avatar ? (
                            <img src={m.sender_avatar} alt={m.sender_name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-primary">{m.sender_name?.charAt(0) || 'U'}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <h5 className="font-label-md text-primary truncate">{m.sender_name}</h5>
                            <span className="text-[11px] text-on-surface-variant">{new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-body-sm text-on-surface-variant truncate">{m.content || t('messaging_file')}</p>
                          {m.ad_title && <p className="text-[10px] text-secondary mt-1">{t('messaging_re')} {m.ad_title}</p>}
                        </div>
                      </Link>
                    )) : <p className="text-on-surface-variant text-center py-8">{t('seller_dashboard_no_msgs')}</p>}
                  </div>
                </section>
              </div>
            </>
          )}

          {activeNav === 'listings' && (
            <section>
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-3">
                  {['all', 'active', 'sold', 'archived'].map(f => (
                    <button key={f} onClick={() => setListingsFilter(f)}
                      className={`px-4 py-1.5 rounded-full text-label-sm font-label-sm transition-colors border-none cursor-pointer capitalize ${listingsFilter === f ? 'bg-secondary-fixed text-on-secondary-fixed' : 'hover:bg-surface-container-high text-on-surface-variant bg-transparent'}`}>
                      {f === 'all' ? t('messaging_all') : statusLabels[f]}
                    </button>
                  ))}
                </div>
                <Link to="/ads/new" className="bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-label-md text-label-md font-bold hover:opacity-90 active:scale-95 transition-all no-underline flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">add</span> {t('seller_dashboard_new')}
                </Link>
              </div>
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">{t('seller_dashboard_listing')}</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">{t('seller_dashboard_price')}</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">{t('seller_dashboard_status')}</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">{t('seller_dashboard_date')}</th>
                      <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right">{t('seller_dashboard_actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filteredListings.map(ad => (
                      <tr key={ad.id} className="hover:bg-surface-container transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                              {ad.images && ad.images[0] ? (
                                <img src={getImageUrl(ad.images[0])} alt={ad.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-outline text-sm">inventory_2</span></div>
                              )}
                            </div>
                            <Link to={'/ads/' + ad.id} className="font-label-md text-primary truncate no-underline hover:underline max-w-[250px]">{ad.title}</Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-label-md text-primary">{ad.price ? formatPrice(ad.price, currency) : t('price_na')}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${statusColors[ad.status]}`}>{statusLabels[ad.status]}</span>
                        </td>
                        <td className="px-6 py-4 text-body-sm text-on-surface-variant">{new Date(ad.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            {ad.status === 'active' && (
                              <button onClick={() => updateAdStatus(ad.id, 'sold')} disabled={updatingAd === ad.id} className="px-3 py-1 text-[11px] font-bold bg-red-50 text-red-700 rounded-full border-none cursor-pointer hover:bg-red-100 transition-colors" title={t('seller_dashboard_mark_sold')}>{t('seller_dashboard_sold')}</button>
                            )}
                            {ad.status === 'active' && (
                              <button onClick={() => updateAdStatus(ad.id, 'archived')} disabled={updatingAd === ad.id} className="px-3 py-1 text-[11px] font-bold bg-gray-50 text-gray-700 rounded-full border-none cursor-pointer hover:bg-gray-100 transition-colors" title={t('seller_dashboard_archive')}>{t('seller_dashboard_archive')}</button>
                            )}
                            {(ad.status === 'sold' || ad.status === 'archived') && (
                              <button onClick={() => updateAdStatus(ad.id, 'active')} disabled={updatingAd === ad.id} className="px-3 py-1 text-[11px] font-bold bg-green-50 text-green-700 rounded-full border-none cursor-pointer hover:bg-green-100 transition-colors" title={t('seller_dashboard_reactivate')}>{t('seller_dashboard_reactivate')}</button>
                            )}
                            <Link to={'/ads/' + ad.id + '/edit'} className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors no-underline text-on-surface-variant" title={t('seller_dashboard_edit')}><span className="material-symbols-outlined text-[16px]">edit</span></Link>
                            <button onClick={() => deleteAd(ad.id)} className="p-1.5 rounded-lg hover:bg-error-container transition-colors bg-transparent border-none cursor-pointer text-on-surface-variant" title={t('seller_dashboard_delete')}><span className="material-symbols-outlined text-[16px]">delete</span></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredListings.length === 0 && <p className="text-on-surface-variant text-center py-12">{t('seller_dashboard_no_results')}</p>}
              </div>
            </section>
          )}

          {activeNav === 'messages' && (
            <section>
              <Link to="/messages" className="text-secondary font-bold hover:underline mb-6 inline-flex items-center gap-1 no-underline">
                <span className="material-symbols-outlined text-[16px]">open_in_new</span> {t('seller_dashboard_open_msgs')}
              </Link>
              <div className="flex flex-col gap-4">
                {stats?.recentMessages && stats.recentMessages.length > 0 ? stats.recentMessages.map(m => (
                  <Link key={m.id} to="/messages" className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant flex items-center gap-4 hover:shadow-md transition-shadow no-underline">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {m.sender_avatar ? (
                        <img src={m.sender_avatar} alt={m.sender_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-primary">{m.sender_name?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h5 className="font-label-md text-primary">{m.sender_name}</h5>
                        <span className="text-[11px] text-on-surface-variant">{new Date(m.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-body-sm text-on-surface-variant truncate">{m.content || t('messaging_file')}</p>
                      {m.ad_title && <p className="text-[11px] text-secondary mt-1">{t('messaging_re')} {m.ad_title}</p>}
                    </div>
                  </Link>
                )) : <p className="text-on-surface-variant text-center py-12">{t('seller_dashboard_no_msgs')}</p>}
              </div>
            </section>
          )}

          {activeNav === 'settings' && (
            <section className="max-w-xl">
              <p className="text-on-surface-variant mb-6">{t('seller_dashboard_manage')}</p>
              <Link to="/settings" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all no-underline">
                <span className="material-symbols-outlined text-[18px]">settings</span> {t('seller_dashboard_open_settings')}
              </Link>
            </section>
          )}
        </div>

        <footer className="w-full bg-surface-container-highest border-t border-outline-variant mt-20">
          <div className="max-w-[1400px] mx-auto px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="font-headline-sm text-headline-sm font-bold text-primary">ProMarket</h3>
              <p className="text-on-surface-variant font-label-sm text-label-sm">{t('footer_copyright', { year: 2024 })}</p>
            </div>
            <div className="flex gap-8">
              {[t('seller_dashboard_privacy'), t('seller_dashboard_terms'), t('footer_trust_safety'), t('footer_contact')].map(link => (
                <button key={link} className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors bg-transparent border-none cursor-pointer">{link}</button>
              ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default SellerDashboard;
