import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AccountSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', headline: '', bio: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');
  const [role, setRole] = useState('buyer');
  const [activeNav, setActiveNav] = useState('profile');

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/auth/me').then(r => {
      const nameParts = (r.data.name || '').split(' ');
      setForm({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: r.data.email || '',
        headline: r.data.headline || '',
        bio: r.data.bio || '',
      });
    }).catch(() => {});
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/me', { name: form.firstName + ' ' + form.lastName, phone: '', city: '' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { alert('Erreur'); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirmPassword) return setPwError('Les mots de passe ne correspondent pas');
    try {
      await api.put('/auth/me/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwSaved(true);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPwSaved(false), 2000);
    } catch (err) {
      setPwError(err.response?.data?.error || 'Erreur');
    }
  };

  const navItems = [
    { key: 'profile', icon: 'person', label: 'Profil' },
    { key: 'security', icon: 'security', label: 'Sécurité' },
    { key: 'notifications', icon: 'notifications', label: 'Notifications' },
    { key: 'preferences', icon: 'tune', label: 'Préférences' },
    { key: 'billing', icon: 'payments', label: 'Facturation' },
  ];

  return (
    <div className="flex pt-20 min-h-screen">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-20 bg-surface-container-low border-r border-outline-variant hidden md:flex flex-col p-4 gap-2">
        <div className="mb-6 px-2">
          <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Paramètres</h2>
          <p className="text-on-surface-variant font-body-sm text-body-sm">Gérez votre présence</p>
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
          <button className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all w-full text-left bg-transparent border-none cursor-pointer">
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-md text-label-md">Support</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container rounded-lg transition-all w-full text-left bg-transparent border-none cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop bg-surface">
        <div className="max-w-4xl mx-auto">
          <div className="mb-stack-lg">
            <h1 className="font-headline-lg text-headline-lg text-primary">Profil personnel</h1>
            <p className="text-on-surface-variant font-body-md text-body-md mt-2">Mettez à jour vos informations personnelles et votre visibilité sur la plateforme.</p>
          </div>

          <div className="space-y-stack-lg">
            {/* Profile Photo */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-outline-variant bg-surface-container-high flex items-center justify-center">
                      <span className="text-2xl font-bold text-on-surface-variant">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <button className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center border-none cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">Votre photo</h3>
                    <p className="text-on-surface-variant font-body-sm text-body-sm mt-1">JPG, GIF ou PNG acceptés. Taille max 2 Mo.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-variant transition-colors bg-transparent cursor-pointer">Téléverser</button>
                  <button className="px-4 py-2 text-error font-label-md text-label-md hover:bg-error-container rounded-lg transition-colors bg-transparent border-none cursor-pointer">Supprimer</button>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Informations générales</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block">Prénom</label>
                    <input
                      className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      type="text"
                      value={form.firstName}
                      onChange={e => setForm({...form, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block">Nom</label>
                    <input
                      className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      type="text"
                      value={form.lastName}
                      onChange={e => setForm({...form, lastName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block">Adresse email</label>
                    <div className="relative">
                      <input
                        className="w-full h-12 px-4 pl-12 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        type="email"
                        value={form.email}
                        disabled
                      />
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">mail</span>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block">Titre professionnel</label>
                    <input
                      className="w-full h-12 px-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      placeholder="ex. Architecte logiciel senior"
                      type="text"
                      value={form.headline}
                      onChange={e => setForm({...form, headline: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface-variant block">Bio</label>
                    <textarea
                      className="w-full p-4 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none"
                      placeholder="Parlez-nous de votre parcours professionnel..."
                      rows="4"
                      value={form.bio}
                      onChange={e => setForm({...form, bio: e.target.value})}
                    />
                    <p className="text-on-surface-variant font-label-sm text-label-sm text-right">0 / 500 caractères</p>
                  </div>
                </div>

                {/* Marketplace Role */}
                <div className="mt-stack-lg">
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Rôle sur la place de marché</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`relative flex p-4 cursor-pointer rounded-lg border-2 transition-all ${
                      role === 'buyer' ? 'border-secondary bg-secondary-fixed/30' : 'border-outline-variant bg-surface hover:bg-surface-variant'
                    }`}>
                      <input type="radio" name="role" className="sr-only" checked={role === 'buyer'} onChange={() => setRole('buyer')} />
                      <div className="flex gap-4">
                        <div className={`h-10 w-10 flex items-center justify-center rounded-full ${role === 'buyer' ? 'bg-secondary text-on-secondary' : 'bg-surface-variant text-on-surface-variant'}`}>
                          <span className="material-symbols-outlined" style={role === 'buyer' ? { fontVariationSettings: "'FILL' 1" } : {}}>shopping_bag</span>
                        </div>
                        <div>
                          <p className="font-label-md text-label-md text-primary">Acheteur</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Je cherche à acquérir des produits et services.</p>
                        </div>
                      </div>
                      {role === 'buyer' && (
                        <div className="absolute top-4 right-4 text-secondary">
                          <span className="material-symbols-outlined">check_circle</span>
                        </div>
                      )}
                    </label>
                    <label className={`relative flex p-4 cursor-pointer rounded-lg border-2 transition-all ${
                      role === 'seller' ? 'border-secondary bg-secondary-fixed/30' : 'border-outline-variant bg-surface hover:bg-surface-variant'
                    }`}>
                      <input type="radio" name="role" className="sr-only" checked={role === 'seller'} onChange={() => setRole('seller')} />
                      <div className="flex gap-4">
                        <div className={`h-10 w-10 flex items-center justify-center rounded-full ${role === 'seller' ? 'bg-secondary text-on-secondary' : 'bg-surface-variant text-on-surface-variant'}`}>
                          <span className="material-symbols-outlined" style={role === 'seller' ? { fontVariationSettings: "'FILL' 1" } : {}}>storefront</span>
                        </div>
                        <div>
                          <p className="font-label-md text-label-md text-primary">Vendeur</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Je souhaite vendre des actifs professionnels.</p>
                        </div>
                      </div>
                      {role === 'seller' && (
                        <div className="absolute top-4 right-4 text-secondary">
                          <span className="material-symbols-outlined">check_circle</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {saved && (
                  <div className="mt-4 bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 font-body-sm">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span> Profil mis à jour !
                  </div>
                )}

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-end gap-4 py-stack-lg">
                  <button type="button" className="px-6 py-3 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer">Annuler</button>
                  <button type="submit" className="bg-secondary text-on-secondary px-8 py-3 rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 hover:scale-[0.98] transition-all border-none cursor-pointer">Enregistrer</button>
                </div>
              </form>
            </div>

            {/* Password Change */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Sécurité</h3>
              {pwSaved && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2 font-body-sm">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span> Mot de passe modifié !
                </div>
              )}
              {pwError && (
                <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 flex items-center gap-2 font-body-sm">
                  <span className="material-symbols-outlined text-[18px]">error</span> {pwError}
                </div>
              )}
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Mot de passe actuel</label>
                  <input type="password" placeholder="••••••••" value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Nouveau mot de passe</label>
                  <input type="password" placeholder="••••••••" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required minLength={6} className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none" />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-2">Confirmer le nouveau mot de passe</label>
                  <input type="password" placeholder="••••••••" value={pwForm.confirmPassword} onChange={e => setPwForm({...pwForm, confirmPassword: e.target.value})} required minLength={6} className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none" />
                </div>
                <button type="submit" className="w-full bg-surface-container-high text-primary py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:bg-surface-container transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span> Modifier le mot de passe
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountSettings;
