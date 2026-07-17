import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const AccountSettings = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { t, lang, setLang, setCurrency } = useLanguage();
  const [activeNav, setActiveNav] = useState('profile');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', headline: '', bio: '' });
  const [originalForm, setOriginalForm] = useState(null);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');
  const [role, setRole] = useState('buyer');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [notifPrefs, setNotifPrefs] = useState({
    email_messages: true, email_favorites: true, email_promos: false,
    push_messages: true, push_favorites: true, push_promos: false,
  });
  const [prefPrefs, setPrefPrefs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('user_preferences'));
      return saved || { language: 'en', currency: 'MAD', theme: 'system' };
    } catch { return { language: 'en', currency: 'MAD', theme: 'system' }; }
  });
  const [notifSaved, setNotifSaved] = useState(false);
  const [prefSaved, setPrefSaved] = useState(false);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/auth/me').then(r => {
      const nameParts = (r.data.name || '').split(' ');
      const f = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: r.data.email || '',
        headline: r.data.headline || '',
        bio: r.data.bio || '',
      };
      setForm(f);
      setOriginalForm(f);
    }).catch(() => {});
    api.get('/notifications/preferences').then(r => {
      setNotifPrefs({
        email_messages: !!r.data.email_messages,
        email_favorites: !!r.data.email_favorites,
        email_promos: !!r.data.email_promos,
        push_messages: !!r.data.push_messages,
        push_favorites: !!r.data.push_favorites,
        push_promos: !!r.data.push_promos,
      });
    }).catch(() => {});
  }, [user, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/me', {
        name: (form.firstName + ' ' + form.lastName).trim(),
        headline: form.headline,
        bio: form.bio,
      });
      setOriginalForm({ ...form });
      setSaved(true);
      if (refreshUser) refreshUser();
      setTimeout(() => setSaved(false), 3000);
    } catch { alert(t('settings_err_profile')); }
  };

  const handleCancel = () => {
    if (originalForm) setForm({ ...originalForm });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwError(t('settings_pw_no_match'));
    try {
      await api.put('/auth/me/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwSaved(true);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSaved(false), 3000);
    } catch (err) {
      setPwError(err.response?.data?.error || t('error'));
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('images', file);
      const uploadRes = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const avatarUrl = uploadRes.data.urls[0];
      await api.put('/auth/me', {
        name: form.firstName + ' ' + form.lastName,
        phone: '', city: '', headline: form.headline, bio: form.bio, avatar_url: avatarUrl,
      });
      setOriginalForm({ ...form });
      if (refreshUser) refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { alert(t('settings_err_avatar')); }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteAvatar = async () => {
    try {
      await api.delete('/auth/me/avatar');
      if (refreshUser) refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { alert(t('settings_err_avatar_del')); }
  };

  const handleNotifSave = async () => {
    try {
      await api.put('/notifications/preferences', notifPrefs);
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 3000);
    } catch {
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 3000);
    }
  };

  const handlePrefSave = async () => {
    localStorage.setItem('user_preferences', JSON.stringify(prefPrefs));
    setTheme(prefPrefs.theme);
    setLang(prefPrefs.language);
    setCurrency(prefPrefs.currency);
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  };

  const navItems = [
    { key: 'profile', icon: 'person', label: t('nav_my_profile') },
    { key: 'security', icon: 'security', label: t('settings_security') },
    { key: 'notifications', icon: 'notifications', label: t('settings_notif_title') },
    { key: 'preferences', icon: 'tune', label: t('settings_prefs_title') },
    { key: 'billing', icon: 'payments', label: t('settings_billing_title') },
  ];

  return (
    <div className="flex pt-20 min-h-screen">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-20 bg-surface-container-low border-r border-outline-variant hidden md:flex flex-col p-4 gap-2">
        <div className="mb-6 px-2">
          <h2 className="font-headline-sm text-headline-sm font-bold text-primary">{t('settings_title')}</h2>
          <p className="text-on-surface-variant font-body-sm text-body-sm">{t('settings_subtitle')}</p>
        </div>
        <nav className="space-y-1">
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
              <span className="font-label-md text-label-md">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-outline-variant pt-4 space-y-1">
          <Link to="/contact" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all w-full no-underline">
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-md text-label-md">{t('settings_support')}</span>
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container rounded-lg transition-all w-full text-left bg-transparent border-none cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">{t('nav_log_out')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop bg-surface">
        <div className="max-w-4xl mx-auto">

          {/* ============ PROFILE TAB ============ */}
          {activeNav === 'profile' && (
            <div className="space-y-stack-lg">
              <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-primary">{t('nav_my_profile')}</h1>
                <p className="text-on-surface-variant font-body-md text-body-md mt-2">{t('settings_subtitle')}</p>
              </div>

              {/* Profile Photo */}
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-outline-variant bg-surface-container-high flex items-center justify-center">
                        {user?.avatar_url ? (
                          <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-on-surface-variant">{user?.name?.charAt(0) || 'U'}</span>
                        )}
                      </div>
                      <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center border-none cursor-pointer">
                        {uploading ? (
                          <div className="w-[18px] h-[18px] border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        )}
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept=".jpg,.jpeg,.png,.gif,.webp" />
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-primary">{t('settings_photo_title')}</h3>
                      <p className="text-on-surface-variant font-body-sm text-body-sm mt-1">{t('settings_photo_desc')}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-4 py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-variant transition-colors bg-transparent cursor-pointer">{t('settings_upload')}</button>
                    <button onClick={handleDeleteAvatar} className="px-4 py-2 text-error font-label-md text-label-md hover:bg-error-container rounded-lg transition-colors bg-transparent border-none cursor-pointer">{t('settings_delete')}</button>
                  </div>
                </div>
              </div>

              {/* General Info */}
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">{t('settings_general')}</h3>
                <form onSubmit={handleSave}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <div className="space-y-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block">{t('settings_first_name')}</label>
                      <input className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all" type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block">{t('settings_last_name')}</label>
                      <input className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all" type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block">{t('settings_email')}</label>
                      <div className="relative">
                        <input className="w-full h-12 px-4 pl-12 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all" type="email" value={form.email} disabled />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block">{t('settings_headline')}</label>
                      <input className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all" placeholder={t('settings_headline_ph')} type="text" value={form.headline} onChange={e => setForm({...form, headline: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block">{t('settings_bio')}</label>
                      <textarea className="w-full p-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none" placeholder={t('settings_bio_ph')} rows="4" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} maxLength={500} />
                      <p className="text-on-surface-variant font-label-sm text-label-sm text-right">{form.bio.length}{t('settings_chars')}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="mt-stack-lg">
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">{t('settings_role')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`relative flex p-4 cursor-pointer rounded-lg border-2 transition-all ${role === 'buyer' ? 'border-secondary bg-secondary-fixed/30' : 'border-outline-variant bg-surface hover:bg-surface-variant'}`}>
                        <input type="radio" name="role" className="sr-only" checked={role === 'buyer'} onChange={() => setRole('buyer')} />
                        <div className="flex gap-4">
                          <div className={`h-10 w-10 flex items-center justify-center rounded-full ${role === 'buyer' ? 'bg-secondary text-on-secondary' : 'bg-surface-variant text-on-surface-variant'}`}>
                            <span className="material-symbols-outlined" style={role === 'buyer' ? { fontVariationSettings: "'FILL' 1" } : {}}>shopping_bag</span>
                          </div>
                          <div>
                            <p className="font-label-md text-label-md text-primary">{t('settings_buyer')}</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t('settings_buyer_desc')}</p>
                          </div>
                        </div>
                        {role === 'buyer' && <div className="absolute top-4 right-4 text-secondary"><span className="material-symbols-outlined">check_circle</span></div>}
                      </label>
                      <label className={`relative flex p-4 cursor-pointer rounded-lg border-2 transition-all ${role === 'seller' ? 'border-secondary bg-secondary-fixed/30' : 'border-outline-variant bg-surface hover:bg-surface-variant'}`}>
                        <input type="radio" name="role" className="sr-only" checked={role === 'seller'} onChange={() => setRole('seller')} />
                        <div className="flex gap-4">
                          <div className={`h-10 w-10 flex items-center justify-center rounded-full ${role === 'seller' ? 'bg-secondary text-on-secondary' : 'bg-surface-variant text-on-surface-variant'}`}>
                            <span className="material-symbols-outlined" style={role === 'seller' ? { fontVariationSettings: "'FILL' 1" } : {}}>storefront</span>
                          </div>
                          <div>
                            <p className="font-label-md text-label-md text-primary">{t('settings_seller')}</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t('settings_seller_desc')}</p>
                          </div>
                        </div>
                        {role === 'seller' && <div className="absolute top-4 right-4 text-secondary"><span className="material-symbols-outlined">check_circle</span></div>}
                      </label>
                    </div>
                  </div>

                  {saved && (
                    <div className="mt-4 bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 font-body-sm">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span> {t('settings_profile_saved')}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-4 py-stack-lg">
                    <button type="button" onClick={handleCancel} className="px-6 py-3 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer">{t('settings_cancel')}</button>
                    <button type="submit" className="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 hover:scale-[0.98] transition-all border-none cursor-pointer">{t('settings_save')}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ============ SECURITY TAB ============ */}
          {activeNav === 'security' && (
            <div className="space-y-stack-lg">
              <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-primary">{t('settings_security')}</h1>
                <p className="text-on-surface-variant font-body-md text-body-md mt-2">{t('settings_security_desc')}</p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">{t('settings_change_pw')}</h3>
                {pwSaved && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2 font-body-sm">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span> {t('settings_pw_changed')}
                  </div>
                )}
                {pwError && (
                  <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 flex items-center gap-2 font-body-sm">
                    <span className="material-symbols-outlined text-[18px]">error</span> {pwError}
                  </div>
                )}
                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2">{t('settings_current_pw')}</label>
                    <input type="password" placeholder="••••••••" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none" />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2">{t('settings_new_pw')}</label>
                    <input type="password" placeholder="••••••••" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required minLength={6} className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none" />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2">{t('settings_confirm_pw')}</label>
                    <input type="password" placeholder="••••••••" value={pwForm.confirmPassword} onChange={e => setPwForm({...pwForm, confirmPassword: e.target.value})} required minLength={6} className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-surface-container-high text-primary py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:bg-surface-container transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">lock_reset</span> {t('settings_change_pw')}
                  </button>
                </form>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">{t('settings_account')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div>
                      <p className="font-label-md text-label-md text-primary">{t('settings_delete_account')}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{t('settings_delete_account_desc')}</p>
                    </div>
                    <button className="px-4 py-2 border border-error text-error font-label-sm text-label-sm rounded-lg hover:bg-error-container transition-colors bg-transparent cursor-pointer">{t('settings_delete')}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ NOTIFICATIONS TAB ============ */}
          {activeNav === 'notifications' && (
            <div className="space-y-stack-lg">
              <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-primary">{t('settings_notif_title')}</h1>
                <p className="text-on-surface-variant font-body-md text-body-md mt-2">{t('settings_notif_desc')}</p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">{t('settings_notif_email')}</h3>
                <div className="space-y-4">
                  {[
                    { key: 'email_messages', label: t('settings_notif_new_msgs'), desc: t('settings_notif_new_msgs_desc') },
                    { key: 'email_favorites', label: t('settings_notif_favs'), desc: t('settings_notif_favs_desc') },
                    { key: 'email_promos', label: t('settings_notif_promos'), desc: t('settings_notif_promos_desc') },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <div>
                        <p className="font-label-md text-label-md text-primary">{item.label}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key] })}
                        className={`relative w-12 h-7 rounded-full transition-colors border-none cursor-pointer ${notifPrefs[item.key] ? 'bg-secondary' : 'bg-outline-variant'}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifPrefs[item.key] ? 'left-6' : 'left-1'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">{t('settings_notif_push')}</h3>
                <div className="space-y-4">
                  {[
                    { key: 'push_messages', label: t('settings_notif_new_msgs'), desc: t('settings_notif_push_msgs_desc') },
                    { key: 'push_favorites', label: t('settings_notif_favs'), desc: t('settings_notif_push_favs_desc') },
                    { key: 'push_promos', label: t('settings_notif_promos'), desc: t('settings_notif_push_promos_desc') },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <div>
                        <p className="font-label-md text-label-md text-primary">{item.label}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key] })}
                        className={`relative w-12 h-7 rounded-full transition-colors border-none cursor-pointer ${notifPrefs[item.key] ? 'bg-secondary' : 'bg-outline-variant'}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifPrefs[item.key] ? 'left-6' : 'left-1'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {notifSaved && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 font-body-sm">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span> {t('settings_notif_saved')}
                </div>
              )}
              <div className="flex justify-end py-stack-lg">
                <button onClick={handleNotifSave} className="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 hover:scale-[0.98] transition-all border-none cursor-pointer">{t('settings_save')}</button>
              </div>
            </div>
          )}

          {/* ============ PREFERENCES TAB ============ */}
          {activeNav === 'preferences' && (
            <div className="space-y-stack-lg">
              <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-primary">{t('settings_prefs_title')}</h1>
                <p className="text-on-surface-variant font-body-md text-body-md mt-2">{t('settings_prefs_desc')}</p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">{t('settings_lang_region')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2">{t('settings_language')}</label>
                    <select value={prefPrefs.language} onChange={e => { setPrefPrefs({...prefPrefs, language: e.target.value}); setLang(e.target.value); }} className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none">
                      <option value="en">{t('lang_en')}</option>
                      <option value="fr">{t('lang_fr')}</option>
                      <option value="ar">{t('lang_ar')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2">{t('settings_currency')}</label>
                    <select value={prefPrefs.currency} onChange={e => setPrefPrefs({...prefPrefs, currency: e.target.value})} className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none">
                      <option value="MAD">{t('currency_mad')}</option>
                      <option value="EUR">{t('currency_eur')}</option>
                      <option value="USD">{t('currency_usd')}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">{t('settings_appearance')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'light', icon: 'light_mode', label: t('settings_light') },
                    { key: 'system', icon: 'settings_brightness', label: t('settings_system') },
                    { key: 'dark', icon: 'dark_mode', label: t('settings_dark') },
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => setPrefPrefs({...prefPrefs, theme: item.key})}
                      className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all cursor-pointer ${
                        prefPrefs.theme === item.key
                          ? 'border-secondary bg-secondary-fixed/30'
                          : 'border-outline-variant bg-surface hover:bg-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[32px]" style={prefPrefs.theme === item.key ? { color: 'var(--color-secondary)' } : {}}>{item.icon}</span>
                      <span className="font-label-md text-label-md">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {prefSaved && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 font-body-sm">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span> {t('settings_prefs_saved')}
                </div>
              )}
              <div className="flex justify-end py-stack-lg">
                <button onClick={handlePrefSave} className="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 hover:scale-[0.98] transition-all border-none cursor-pointer">{t('settings_save')}</button>
              </div>
            </div>
          )}

          {/* ============ BILLING TAB ============ */}
          {activeNav === 'billing' && (
            <div className="space-y-stack-lg">
              <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-primary">{t('settings_billing_title')}</h1>
                <p className="text-on-surface-variant font-body-md text-body-md mt-2">{t('settings_billing_desc')}</p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">{t('settings_pay_methods')}</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-5xl text-outline mb-4">credit_card</span>
                  <p className="font-body-md text-on-surface-variant mb-4">{t('settings_no_pay_methods')}</p>
                  <button className="bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 transition-all border-none cursor-pointer">{t('settings_add_pay_method')}</button>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">{t('settings_billing_history')}</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-5xl text-outline mb-4">receipt_long</span>
                  <p className="font-body-md text-on-surface-variant">{t('settings_no_billing')}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AccountSettings;
