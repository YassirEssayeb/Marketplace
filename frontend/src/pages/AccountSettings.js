import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AccountSettings = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
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
  const [prefPrefs, setPrefPrefs] = useState({ language: 'en', currency: 'MAD', theme: 'system' });
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
    } catch { alert('Error saving profile'); }
  };

  const handleCancel = () => {
    if (originalForm) setForm({ ...originalForm });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwError('Passwords do not match');
    try {
      await api.put('/auth/me/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwSaved(true);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSaved(false), 3000);
    } catch (err) {
      setPwError(err.response?.data?.error || 'Error');
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
    } catch { alert('Error uploading avatar'); }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteAvatar = async () => {
    try {
      await api.delete('/auth/me/avatar');
      if (refreshUser) refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { alert('Error deleting avatar'); }
  };

  const handleNotifSave = async () => {
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  };

  const handlePrefSave = async () => {
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  };

  const navItems = [
    { key: 'profile', icon: 'person', label: 'Profile' },
    { key: 'security', icon: 'security', label: 'Security' },
    { key: 'notifications', icon: 'notifications', label: 'Notifications' },
    { key: 'preferences', icon: 'tune', label: 'Preferences' },
    { key: 'billing', icon: 'payments', label: 'Billing' },
  ];

  return (
    <div className="flex pt-20 min-h-screen">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-20 bg-surface-container-low border-r border-outline-variant hidden md:flex flex-col p-4 gap-2">
        <div className="mb-6 px-2">
          <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Settings</h2>
          <p className="text-on-surface-variant font-body-sm text-body-sm">Manage your presence</p>
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
            <span className="font-label-md text-label-md">Support</span>
          </Link>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container rounded-lg transition-all w-full text-left bg-transparent border-none cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Log out</span>
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
                <h1 className="font-headline-lg text-headline-lg text-primary">Personal profile</h1>
                <p className="text-on-surface-variant font-body-md text-body-md mt-2">Update your personal information and your visibility on the platform.</p>
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
                      <h3 className="font-headline-sm text-headline-sm text-primary">Your photo</h3>
                      <p className="text-on-surface-variant font-body-sm text-body-sm mt-1">JPG, GIF or PNG accepted. Max size 5 MB.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-4 py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-variant transition-colors bg-transparent cursor-pointer">Upload</button>
                    <button onClick={handleDeleteAvatar} className="px-4 py-2 text-error font-label-md text-label-md hover:bg-error-container rounded-lg transition-colors bg-transparent border-none cursor-pointer">Delete</button>
                  </div>
                </div>
              </div>

              {/* General Info */}
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">General information</h3>
                <form onSubmit={handleSave}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    <div className="space-y-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block">First name</label>
                      <input className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all" type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block">Last name</label>
                      <input className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all" type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block">Email address</label>
                      <div className="relative">
                        <input className="w-full h-12 px-4 pl-12 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all" type="email" value={form.email} disabled />
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block">Professional headline</label>
                      <input className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all" placeholder="e.g. Senior software architect" type="text" value={form.headline} onChange={e => setForm({...form, headline: e.target.value})} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="font-label-md text-label-md text-on-surface-variant block">Bio</label>
                      <textarea className="w-full p-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none" placeholder="Tell us about your professional journey..." rows="4" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} maxLength={500} />
                      <p className="text-on-surface-variant font-label-sm text-label-sm text-right">{form.bio.length} / 500 characters</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="mt-stack-lg">
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Marketplace role</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`relative flex p-4 cursor-pointer rounded-lg border-2 transition-all ${role === 'buyer' ? 'border-secondary bg-secondary-fixed/30' : 'border-outline-variant bg-surface hover:bg-surface-variant'}`}>
                        <input type="radio" name="role" className="sr-only" checked={role === 'buyer'} onChange={() => setRole('buyer')} />
                        <div className="flex gap-4">
                          <div className={`h-10 w-10 flex items-center justify-center rounded-full ${role === 'buyer' ? 'bg-secondary text-on-secondary' : 'bg-surface-variant text-on-surface-variant'}`}>
                            <span className="material-symbols-outlined" style={role === 'buyer' ? { fontVariationSettings: "'FILL' 1" } : {}}>shopping_bag</span>
                          </div>
                          <div>
                            <p className="font-label-md text-label-md text-primary">Buyer</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">I am looking to acquire products and services.</p>
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
                            <p className="font-label-md text-label-md text-primary">Seller</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">I want to sell professional assets.</p>
                          </div>
                        </div>
                        {role === 'seller' && <div className="absolute top-4 right-4 text-secondary"><span className="material-symbols-outlined">check_circle</span></div>}
                      </label>
                    </div>
                  </div>

                  {saved && (
                    <div className="mt-4 bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 font-body-sm">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span> Profile updated!
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-4 py-stack-lg">
                    <button type="button" onClick={handleCancel} className="px-6 py-3 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Cancel</button>
                    <button type="submit" className="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 hover:scale-[0.98] transition-all border-none cursor-pointer">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ============ SECURITY TAB ============ */}
          {activeNav === 'security' && (
            <div className="space-y-stack-lg">
              <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-primary">Security</h1>
                <p className="text-on-surface-variant font-body-md text-body-md mt-2">Manage your password and account security.</p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Change password</h3>
                {pwSaved && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2 font-body-sm">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span> Password changed successfully!
                  </div>
                )}
                {pwError && (
                  <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 flex items-center gap-2 font-body-sm">
                    <span className="material-symbols-outlined text-[18px]">error</span> {pwError}
                  </div>
                )}
                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Current password</label>
                    <input type="password" placeholder="••••••••" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none" />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2">New password</label>
                    <input type="password" placeholder="••••••••" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required minLength={6} className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none" />
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Confirm new password</label>
                    <input type="password" placeholder="••••••••" value={pwForm.confirmPassword} onChange={e => setPwForm({...pwForm, confirmPassword: e.target.value})} required minLength={6} className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-surface-container-high text-primary py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:bg-surface-container transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">lock_reset</span> Change password
                  </button>
                </form>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Account</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div>
                      <p className="font-label-md text-label-md text-primary">Delete account</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Permanently delete your account and all associated data.</p>
                    </div>
                    <button className="px-4 py-2 border border-error text-error font-label-sm text-label-sm rounded-lg hover:bg-error-container transition-colors bg-transparent cursor-pointer">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ NOTIFICATIONS TAB ============ */}
          {activeNav === 'notifications' && (
            <div className="space-y-stack-lg">
              <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-primary">Notifications</h1>
                <p className="text-on-surface-variant font-body-md text-body-md mt-2">Choose what and how you want to be notified.</p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Email notifications</h3>
                <div className="space-y-4">
                  {[
                    { key: 'email_messages', label: 'New messages', desc: 'Get notified when someone sends you a message.' },
                    { key: 'email_favorites', label: 'Favorites updates', desc: 'Get notified when an item in your favorites changes price.' },
                    { key: 'email_promos', label: 'Promotions & tips', desc: 'Receive helpful tips and promotional offers.' },
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
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Push notifications</h3>
                <div className="space-y-4">
                  {[
                    { key: 'push_messages', label: 'New messages', desc: 'Get push notifications for new messages.' },
                    { key: 'push_favorites', label: 'Favorites updates', desc: 'Get push notifications for favorites changes.' },
                    { key: 'push_promos', label: 'Promotions & tips', desc: 'Receive push notifications for promotions.' },
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
                  <span className="material-symbols-outlined text-[18px]">check_circle</span> Notification preferences saved!
                </div>
              )}
              <div className="flex justify-end py-stack-lg">
                <button onClick={handleNotifSave} className="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 hover:scale-[0.98] transition-all border-none cursor-pointer">Save preferences</button>
              </div>
            </div>
          )}

          {/* ============ PREFERENCES TAB ============ */}
          {activeNav === 'preferences' && (
            <div className="space-y-stack-lg">
              <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-primary">Preferences</h1>
                <p className="text-on-surface-variant font-body-md text-body-md mt-2">Customize your marketplace experience.</p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Language & region</h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Language</label>
                    <select value={prefPrefs.language} onChange={e => setPrefPrefs({...prefPrefs, language: e.target.value})} className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none">
                      <option value="en">English</option>
                      <option value="fr">Fran&ccedil;ais</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Currency</label>
                    <select value={prefPrefs.currency} onChange={e => setPrefPrefs({...prefPrefs, currency: e.target.value})} className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none">
                      <option value="MAD">MAD - Moroccan Dirham</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - US Dollar</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Appearance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'light', icon: 'light_mode', label: 'Light' },
                    { key: 'system', icon: 'settings_brightness', label: 'System' },
                    { key: 'dark', icon: 'dark_mode', label: 'Dark' },
                  ].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setPrefPrefs({...prefPrefs, theme: t.key})}
                      className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all cursor-pointer ${
                        prefPrefs.theme === t.key
                          ? 'border-secondary bg-secondary-fixed/30'
                          : 'border-outline-variant bg-surface hover:bg-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[32px]" style={prefPrefs.theme === t.key ? { color: 'var(--color-secondary)' } : {}}>{t.icon}</span>
                      <span className="font-label-md text-label-md">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {prefSaved && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 font-body-sm">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span> Preferences saved!
                </div>
              )}
              <div className="flex justify-end py-stack-lg">
                <button onClick={handlePrefSave} className="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 hover:scale-[0.98] transition-all border-none cursor-pointer">Save preferences</button>
              </div>
            </div>
          )}

          {/* ============ BILLING TAB ============ */}
          {activeNav === 'billing' && (
            <div className="space-y-stack-lg">
              <div className="mb-stack-lg">
                <h1 className="font-headline-lg text-headline-lg text-primary">Billing</h1>
                <p className="text-on-surface-variant font-body-md text-body-md mt-2">Manage your payment methods and billing history.</p>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Payment methods</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-5xl text-outline mb-4">credit_card</span>
                  <p className="font-body-md text-on-surface-variant mb-4">No payment methods added yet.</p>
                  <button className="bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 transition-all border-none cursor-pointer">Add payment method</button>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Billing history</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-5xl text-outline mb-4">receipt_long</span>
                  <p className="font-body-md text-on-surface-variant">No billing history yet.</p>
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
