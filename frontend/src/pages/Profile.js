import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';


const demoListings = [
  { id: 1, title: 'Skyscraper Modular System', category: 'Architecture', price: 12450, type: 'commercial', badge: 'Premium Asset', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1hx7jF0QQHTBTZzb-4Yva4YabpGqh06xqjuDTy743zPXR6z5USZqiHYlA9Rea_Ahp3secgiP2rNvX7pO30i2_f57cPEDwihwHjXdWFugdH75ewfu39OM6WQ8gA9w7RAkTph-jU6hZ6-Egz1VwEw8q2M8lVw5XzyWiCJF-ccuT_et3kGjvZCl67PFZAWEiPMnsYGjZ6u4p6h38ZH1fbX7pcUUSffFaRX4KqaoDhfLj9gF_kIQR' },
  { id: 2, title: 'Suite Analytics Entreprise v4', category: 'Software', price: 890, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFW3SFNTPcFWBN5V00Y1aU5nTp3e9QyIyTCJLexYYqzsSSvoHxzzEm0y6Xidh3SPjoK8Z8MtnQAz9gg2elf9CXMcQLUB8xC4-r74_62A_FQWLMBayrggCG_yZO_EZOvGGjYXXfzC00_9bS1TGwenb9vLjKoxMYDRCsu7KBf2N9LS0xuMHWlq2XQxDEAXx91U6v3O-eKIhFpABl4Q37cqa9Fs1Vq_fnrWlE_EPbPCO5_12pdoLf' },
  { id: 3, title: 'Brand Integrity Audit', category: 'Consulting', price: 2100, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATiusfzL8dwSyifBEe3Fy7Z8-VZEVhKFqqvCW6uoebOi1QPppBM70WmOn9QdH9pu4RDdOi3UGvkhdeVLuE8PN7uNY35aALUwWxPMOh5j6e_hbtV21G3OaklWZn5IxB47QT3-ZqU4HNrXg-0q__EndQJ65-6oJ8tI937QeX6CQHw14fYcnkUW8S0IOB0MPLUNOzQRRkinl9yZPoWw8YFFti1jgomtJI0KjDAntCIRah798HUihb' },
  { id: 4, title: 'Secure Cloud Node v2', category: 'Infrastructure', price: 450, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbyIivFFWRs2xaTwuAXHcKKQrV451nOMV8DVSjbyzgmKySmbJJkgmcy-0O8Jt_UYfOStzSIDCa0lQ9rbcc3t9Ytu3CetL_ZvC_D8BTFoCfSSDmvjzSiL7xL5WEVrwi918XZ9IjJcYjsFfMiS18a6cpM_WO37HWhwIe-z1nf49vyfnSJ5UNJTigA8r63EqZgN5z0viXeSJVHJKS-IbXSOXVnnl4yhvujdCZ8tjk-J0fhyzcVs0x' },
  { id: 5, title: 'Precision Workflow Pack', category: 'Office', price: 1200, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA09sou6l4HlDdZqZHQgFug2N4zKR8UhBZWBJcSIJuKM75dBuFUtEOxwAeu2jgWFecfhmFLGP2yiy1sD3sfBoCUpyDOkkKbWnh-lxP-iErlv8qaSEEg0qQl3jyovm5rc3jfsEafbrSfpGuctyJCUER60ICKOaVmdLJnVyi8R-MUv56gYXn49efCupJIMc92F0VKuHYzidk7ZmQ9rJkyFxAGsRn0DbF92iFcJHSaoLNEK-T6OBag' },
];

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, formatPrice, currency } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/auth/me').then(r => {
      setProfile(r.data);
      setListings(demoListings);
    }).catch(() => {});
  }, [user, navigate]);

  const toggleFollow = () => setIsFollowing(!isFollowing);

  if (!profile) return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin mb-4"></div>
      <p className="text-on-surface-variant font-body-md">{t('profile_loading')}</p>
    </main>
  );

  return (
    <main className="mt-20">
      {/* Hero Profile Section */}
      <section className="bg-surface-container-lowest border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-40 h-40 rounded-full border-4 border-surface-container-high overflow-hidden bg-surface-container-high flex items-center justify-center ambient-shadow">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-on-surface-variant">{profile.name?.charAt(0) || 'U'}</span>
                )}
              </div>
              <div className="absolute bottom-2 right-2 bg-secondary text-on-secondary rounded-full p-1.5 border-4 border-surface-container-lowest flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="font-headline-lg text-headline-lg text-primary">{profile.name || t('profile_user')}</h1>
                  <p className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider mt-1">{t('profile_verified')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleFollow}
                    className={`group flex items-center gap-2 px-8 py-3 font-label-md text-label-md rounded-lg shadow-sm hover:opacity-90 transition-all active:scale-95 border-none cursor-pointer ${
                      isFollowing
                        ? 'bg-surface-container-high text-on-surface'
                        : 'bg-secondary text-on-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{isFollowing ? 'person_check' : 'person_add'}</span>
                    <span>{isFollowing ? t('profile_following') : t('profile_follow')}</span>
                  </button>
                  <Link to="/messages" className="p-3 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors group no-underline">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">mail</span>
                  </Link>
                  <button className="p-3 border border-outline-variant rounded-lg hover:bg-surface-variant transition-colors group bg-transparent cursor-pointer">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">more_horiz</span>
                  </button>
                </div>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface max-w-3xl leading-relaxed">
                Specializing in high-quality software solutions and consulting services. With over 12 years of experience in the global market, I provide verified sellers and professional buyers the reliability needed for large-scale operations.
              </p>
              <div className="flex flex-wrap gap-8 pt-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">star</span>
                  <span className="font-label-md text-label-md text-primary">4.9 (2 400 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">location_on</span>
                  <span className="font-label-md text-label-md text-primary">{profile.city || 'New York, US'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">calendar_today</span>
                  <span className="font-label-md text-label-md text-primary">{t('profile_joined')} {new Date(profile.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop py-16">
          <div className="flex items-center justify-between mb-10">
            <div className="flex gap-8">
              {[
                { key: 'active', label: `${t('profile_active_listings')} (${listings.length})` },
                { key: 'past', label: t('profile_past_activity') },
                { key: 'about', label: t('profile_about') },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`font-label-md text-label-md pb-2 border-b-2 transition-colors bg-transparent border-x-0 border-t-0 cursor-pointer ${
                    activeTab === tab.key
                      ? 'text-primary border-primary font-bold'
                      : 'text-on-surface-variant hover:text-primary border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant bg-transparent cursor-pointer">
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">filter_list</span>
              <span className="font-label-md text-label-md text-on-surface-variant">{t('profile_filter_category')}</span>
            </button>
          </div>

          {/* Bento Grid of Listings */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Listing Card 1 (Large Feature) */}
            <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden ambient-shadow ambient-shadow-hover transition-all group">
              <div className="relative h-[400px]">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={listings[0]?.img} alt={listings[0]?.title} />
                <div className="absolute top-4 right-4 bg-primary/90 text-on-primary px-3 py-1 rounded font-label-sm text-label-sm uppercase tracking-widest">{listings[0]?.badge}</div>
              </div>
              <div className="p-stack-lg flex justify-between items-end">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase mb-2 block">{listings[0]?.category}</span>
                  <h3 className="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors">{listings[0]?.title}</h3>
                  <p className="text-on-surface-variant font-body-sm mt-2 max-w-lg">Complete structural blueprints including electrical wiring and ventilation for high-rise developments.</p>
                </div>
                <div className="text-right">
                  <span className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Commercial license</span>
                  <span className="font-headline-sm text-headline-sm text-primary">{formatPrice(listings[0]?.price, currency)}</span>
                </div>
              </div>
            </div>

            {/* Listing Cards 2-5 (Smaller) */}
            {listings.slice(1).map(listing => (
              <div key={listing.id} className="md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden ambient-shadow ambient-shadow-hover transition-all group">
                <div className="h-64 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={listing.img} alt={listing.title} />
                </div>
                <div className="p-stack-md">
                  <span className="font-label-sm text-label-sm text-secondary uppercase mb-1 block">{listing.category}</span>
                  <h3 className="font-headline-sm text-headline-sm text-primary mb-4">{listing.title}</h3>
                  <div className="flex items-center justify-between border-t border-outline-variant pt-4">
                    <span className="font-headline-sm text-headline-sm text-primary">{formatPrice(listing.price, currency)}</span>
                    <button className="bg-surface-container-high p-2 rounded-lg hover:bg-secondary-fixed transition-colors border-none cursor-pointer">
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Profile;
