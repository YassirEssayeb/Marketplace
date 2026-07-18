import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const demoProducts = [
  { title: 'Aura NC Headphones', price: '499.00', category: 'Tech & Audio', rating: 5, reviews: '2.4k', badge: 'Trending', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBriRFWh07SKUuBVDznHwL4d2flGKma4hHj3NquvY6i_Xiq6rZnINfLKg_jUGWhoLB1JcGVd-SlUwr00-imR-3hQgQQxw5eJjUUEA7Wb43TVmK4KdAK2PMme18lec0bGrXCLAz9B43ugrgiNnaZVseT_CXSmtYvJ2WaAmv0Oh6WMeIu3aM4rmERw9fV_au6fSAoxoFrqbLRG1cdbu4xgFKd2gMJa5jyZx_Lca6HtEno2YTf2E9M' },
  { title: 'V-Series Ergo Chair', price: '1 150.00', category: 'Office', rating: 4, reviews: '840', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9LLjBIENd8j2cTdy8l4hmQQNQb9NsE4TSaAsEf6nWA4ktXZJa-h-NtdB_eOOmxjBeO59Wkh3MWdf0xKdwETzGSf_M5nLeq2Y0WyxR_-q-44iyu7UljY1t6I9feV8L1BDmvLkF6BcrWjsj3wOaSWAg4S1uJnH89OWD3DjfEp_-3KRrL-UG2M_kpbMonLE1h3Lbk06dgXmRTcVOyu26q7U-3sHyHycAhBjaLaIO2DlPfVu9bTuJ' },
  { title: 'Pro-Brew 9000', price: '2 890.00', category: 'Appliances', rating: 5, reviews: '310', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnZF9DhxKKhdYZqFwuICf0fh_cUATKnWIvRdLlbT6Pl0eJQUqww13Sybvuo0pkb1wWc8uPr-iBD6gYoY09vWtpzpJ2qqJtXcHHg7I4saWGklQpbTf0IaHnaPPQjrl_IsFZiTfBlrxYDHXhSO83Rot_MKvAkNLAJRQHSNFB7AFx5SEsglIDFH__3NUQVQ0-Fw9ZM5Rf7_3xdd8lYCfMDd0vCVeWvOtkfxpVcUH5jYaAeTVUxnlj' },
  { title: 'Chronos Titanium X', price: '6 200.00', category: 'Accessories', rating: 5, reviews: '142', badge: 'Limited Edition', badgeType: 'error', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR3dQDilTyBUB1fCxU6Cz2N2wt7Cb55mh73tSpf7RK0gFDIAwRUe8vTyjeDfnyVjqWF_DyF-J9k_mseGnQrfUQUyGDVgBcheLSyg2Qj5it8LkBBZQy6AuGPu2fVtYzMM_lf5EKeI_xah_d450WecAhk6VmS2zUQXNaa-MNl_WBbPrbxK2snRgOC2KfTlO5fBD45VjR9_M82chYXPx4sOPhRKLOIFp2y7T2e5vliwZBq3gS4CJX' },
];

const Landing = () => {
  const { t, formatPrice, currency } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [email, setEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    api.get('/ads?limit=4&sort=date_desc').then(r => setAds(r.data.ads)).catch(() => {});
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setNewsletterLoading(true);
    setNewsletterMsg('');
    try {
      const res = await api.post('/newsletter/subscribe', { email });
      setNewsletterMsg(res.data.message);
      setEmail('');
    } catch (err) {
      setNewsletterMsg(err.response?.data?.error || 'Erreur');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const displayProducts = ads.length > 0 ? ads.map(ad => ({
    id: ad.id,
    title: ad.title,
    price: ad.price ? ad.price : null,
    category: ad.category_name || '',
    img: ad.images && ad.images.length > 0 ? getImageUrl(ad.images[0]) : null,
    rating: 4 + Math.floor(Math.random() * 2),
    reviews: Math.floor(Math.random() * 2000) + 10,
  })) : demoProducts;

  const featuredAd = {
    id: 44,
    title: 'Louis Vuitton Keepall 55',
    price: 3200,
    category: 'Fashion & Accessories',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[720px] flex items-center overflow-hidden bg-surface">
        <div className="max-w-container-max mx-auto px-margin-desktop w-full relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-label-sm text-label-sm mb-6 tracking-wider uppercase">{t('home_hero_badge')}</span>
            <h1 className="font-display-lg text-display-lg text-primary mb-6">{t('home_hero_title')}</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 leading-relaxed">{t('home_hero_desc')}</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/browse" className="bg-secondary text-on-secondary px-10 py-5 rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-secondary/20 active:scale-95 transition-all no-underline">
                {t('home_hero_cta')}
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link to={user ? '/join-as-seller' : '/register'} className="bg-white border border-outline-variant text-primary px-10 py-5 rounded-xl font-headline-sm text-headline-sm flex items-center justify-center gap-3 hover:bg-surface-container-low transition-all no-underline">
                {t('home_hero_partner')}
              </Link>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <p className="font-headline-md text-headline-md text-primary">500k+</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{t('home_stat_products')}</p>
              </div>
              <div className="w-px h-10 bg-outline-variant"></div>
              <div>
                <p className="font-headline-md text-headline-md text-primary">12k+</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{t('home_stat_sellers')}</p>
              </div>
              <div className="w-px h-10 bg-outline-variant"></div>
              <div>
                <p className="font-headline-md text-headline-md text-primary">24/7</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{t('home_stat_support')}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Hero Floating Card */}
        <div className="hidden lg:block absolute right-[5%] top-1/2 -translate-y-1/2 w-[480px] z-20">
          <div
            onClick={() => navigate(featuredAd.id ? `/ads/${featuredAd.id}` : '/ad/featured', { state: { ad: featuredAd } })}
            className="block bg-white p-6 rounded-2xl shadow-2xl border border-outline-variant relative no-underline cursor-pointer"
          >
            <div className="absolute -top-4 -left-4 bg-primary text-on-primary p-4 rounded-xl shadow-lg">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <div className="mt-4 rounded-xl overflow-hidden mb-6 h-64 bg-surface-container">
              {featuredAd.img ? (
                <img className="w-full h-full object-cover" src={featuredAd.img} alt={featuredAd.title} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-5xl">image</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">{featuredAd.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{featuredAd.category}</p>
              </div>
              <span className="font-headline-sm text-headline-sm text-secondary">{featuredAd.price ? formatPrice(featuredAd.price, currency) : 'Prix à définir'}</span>
            </div>
            <span className="block w-full py-4 rounded-lg bg-surface-container-high text-primary font-label-md text-label-md font-bold hover:bg-primary hover:text-on-primary transition-all text-center">{t('home_floating_specs')}</span>
          </div>
        </div>
      </section>

      {/* Categories Section (Bento Grid Style) */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-2">{t('home_categories_title')}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">{t('home_categories_desc')}</p>
            </div>
            <Link to="/browse" className="font-label-md text-label-md text-secondary font-bold flex items-center gap-2 hover:gap-3 transition-all no-underline">
              {t('home_categories_view_all')} <span className="material-symbols-outlined">arrow_right_alt</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-gutter h-[600px]">
            {/* Tech (Large) */}
            <Link to="/browse?category=6" className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-2xl bg-primary border border-outline-variant no-underline">
              <div className="absolute inset-0 opacity-60 group-hover:scale-110 transition-transform duration-700">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZsNozmhzCP5__PoMcczSf7VgHO4Mz46tOa68ciPcBTxrxRepYv5eTLKj204uOWaU7af6wU_c_8eHzZ7GgOgk4VVP3QQaiaLVt4aOvgZsHIG-wRTN2KPU4aVhSPEtHHgApKHq9HRAFRU_sMyhftEwIf-4DKTeEjpAeO-q_q_k1OwyyqB8ki3h4kK4ZceiTcbhfXKUj3e7sXOY4ni1I3b6VGeVF9cGEjvBYLwePu8tQoWFn57tI" alt="Tech & Innovation" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10">
                <h3 className="text-white font-display-lg text-3xl mb-2">{t('home_cat_tech_title')}</h3>
                <p className="text-white/80 font-body-md text-body-md mb-6 max-w-sm">{t('home_cat_tech_desc')}</p>
                <span className="bg-white text-primary px-6 py-3 rounded-lg font-label-md text-label-md font-bold inline-block">{t('home_cat_tech_cta')}</span>
              </div>
            </Link>
            {/* Home */}
            <Link to="/browse?category=5" className="md:col-span-2 md:row-span-1 group relative overflow-hidden rounded-2xl bg-surface-container border border-outline-variant no-underline">
              <div className="absolute inset-0 opacity-80 group-hover:scale-110 transition-transform duration-700">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDG0QNdry9llwx_zEl3W-hYHH6fKMM9vsCsmCteEBo5WabvmYocO-OC09pooLE8we1Mhwmf7apwyZFY1Plm-JRX4-N_g_R9ZWh9xm692hBN4ERtIwwVnhHcXNiDroq_5dgUJbdYPM9qFfUjMnZEOWRFnBnX66DcY1lCncEn2L8Rkav1sxYkf2S-Wm6zvt-OQeKKPSZlpHV8rbAfKHtCpzBHjcF9oJW_VsdR_zWTPkAVHerLJoWK" alt="Home & Living" />
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-white font-headline-md text-headline-md mb-1 drop-shadow-md">{t('home_cat_home_title')}</h3>
                <p className="text-white/90 font-label-sm text-label-sm mb-4 drop-shadow-md">{t('home_cat_home_desc')}</p>
                <span className="text-white font-bold font-label-md flex items-center gap-1">{t('home_cat_home_cta')} <span className="material-symbols-outlined">chevron_right</span></span>
              </div>
            </Link>
            {/* Fashion */}
            <Link to="/browse?category=4" className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-2xl bg-surface-container-high border border-outline-variant no-underline">
              <div className="absolute inset-0 opacity-80 group-hover:scale-110 transition-transform duration-700">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxJI2YYuFV9aMiHwSeZaW0gPTy9P57B796u8DeEYU0ezhowq6mIxnIRVkA-u5Yd_uawCO49LFkgBQkOapPI_xELMCbnLc3-CVhAmIkpNO02I17OAKDISn9leen91zevUmKKnS8FpHILubPMN9QGGHocBR0QciSQrgR0x-DxTVqcW-gv5RLT4VIw6nYtLDn9nnKFH_GIbAdx1WwWcygD1lI8qlUHlKIFCXA2uhxgyDzo8Q0eJPw" alt="Fashion" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-white font-headline-sm text-headline-sm">{t('home_cat_fashion_title')}</h3>
                <span className="text-white/80 font-label-sm text-label-sm">{t('home_cat_fashion_sub')}</span>
              </div>
            </Link>
            {/* Accessories */}
            <Link to="/browse?category=6" className="md:col-span-1 md:row-span-1 group relative overflow-hidden rounded-2xl bg-surface-container-high border border-outline-variant no-underline">
              <div className="absolute inset-0 opacity-80 group-hover:scale-110 transition-transform duration-700">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdo90J4xn8AZh9ppnVUW3ADB4PYgPit3ws4Eg7HYs3iVp5cXy6yyxMfWiSF_6TcT0V0S1SX6o3SJn0pJdgvTJNzTtP_yRtQwcSW2pvv-Ezjnxj2PpycINcTPNalgg5g55b1IFSAhgfx78eY0_08c6bxleHBi8e64vMZx-29pOOyWUEZ1FbpzrjpIdf91KPynNpZwT91NR5ESiFGEIwIjWI6qD7Nlv0JqNrLC1h8ispjLcJFzXc" alt="Accessories" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-white font-headline-sm text-headline-sm">{t('home_cat_access_title')}</h3>
                <span className="text-white/80 font-label-sm text-label-sm">{t('home_cat_access_sub')}</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-24 bg-background">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-4">{t('home_trending_title')}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">{t('home_trending_desc')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {displayProducts.map((ad, i) => (
              <Link to={`/ads/${ad.id}`} key={i} className="group bg-white rounded-xl border border-outline-variant premium-card-hover overflow-hidden block no-underline text-left">
                <div className="relative h-64 overflow-hidden bg-surface-container">
                  {ad.img ? (
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={ad.img} alt={ad.title} loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                      <span className="text-4xl font-bold text-on-surface-variant">{ad.title.charAt(0)}</span>
                    </div>
                  )}
                  <button className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full text-primary hover:bg-white transition-all border-none cursor-pointer">
                    <span className="material-symbols-outlined">favorite</span>
                  </button>
                  {ad.badge && (
                    <div className={`absolute bottom-4 left-4 px-2 py-1 rounded font-label-sm text-label-sm ${ad.badgeType === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'}`}>{ad.badge}</div>
                  )}
                </div>
                <div className="p-5">
                  <p className="font-label-sm text-label-sm text-secondary mb-1">{ad.category}</p>
                  <h4 className="font-headline-sm text-headline-sm text-primary mb-1 truncate">{ad.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="font-headline-md text-headline-md text-primary">{ad.price ? formatPrice(Number(String(ad.price).replace(/\s/g, '')), currency) : t('price_na')}</span>
                    <Link to="/messages" className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-secondary hover:text-on-secondary transition-all no-underline">
                      <span className="material-symbols-outlined">chat</span>
                    </Link>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Shop With Us Section */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-8">{t('home_why_title')}</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-secondary-fixed rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-fixed text-3xl">verified</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-primary mb-2">{t('home_why_verified_title')}</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">{t('home_why_verified_desc')}</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-secondary-fixed rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-fixed text-3xl">shield_with_heart</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-primary mb-2">{t('home_why_secure_title')}</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">{t('home_why_secure_desc')}</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-secondary-fixed rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-secondary-fixed text-3xl">public</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-primary mb-2">{t('home_why_logistics_title')}</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">{t('home_why_logistics_desc')}</p>
                  </div>
                </div>
              </div>
              <Link to="/about" className="mt-12 inline-block bg-primary text-on-primary px-8 py-4 rounded-lg font-label-md text-label-md font-bold hover:shadow-xl transition-all no-underline">
                {t('home_why_cta')}
              </Link>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="h-64 rounded-2xl overflow-hidden shadow-lg border border-outline-variant">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_wd_FjT1uJvCyShDWSK1foxe2OYEQjImR8YUEl2VmWhoSjNEYmEyudbsLADu4heZpncZktpwGDB8qaCxMMBDscVsR39gMgHL2JNFuSLr4xkMxnCU7kNc4u-NyUIwFYQp_8Ie6-yYvqaOPv8RhL3Aig2a414gSnGqAFdvulcOtKI0jVdbtdt97w4Zra-ZuGXp8F3LRkVq_xY8spIz5IeLNJ-io_L3IhjLLiRYMD69_nv2dtcXY" alt="Professionals" />
                  </div>
                  <div className="h-48 rounded-2xl overflow-hidden shadow-lg border border-outline-variant">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5fH9_7zEoMehyfe5AgZrY6TVUmbgS2oXnD2QU5Hduz2rSBIK3eXOuD61BTI-1s7i5EZLMNPceKXc96C7DgDq_jACMQkY_HQFiH5BCnM1EXcXBuqN7F0Siie8_vqMXXg8DclYd6spWHRNRA7n-kQ-Yp_LfQVCitwEj7hwvEBdQAYEsYYxSpcP8K29T8vfRsQYoUBlsr4WnNFExSR7PxuDPzOE4XjHZsRV_aKqRhfD-KgWeU-hn" alt="Security" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-48 rounded-2xl overflow-hidden shadow-lg border border-outline-variant">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgUczkm2GEAO98yNckK0I3SnK46ciuVjXRemKUgw0zzW3ya52_bt6fzn6SHbzmeXmd3pusNwLBKNDbampDjE1S2MWlHzc3Noyi9AfPrUVYI_HEAvLVFbMlnV5wT3QWFwXbD-TOmVe307PJamIhW2pAYBTHroe9XPMqFGInr4iMto_tTq59qvmdEE7uvRLRM3Sn2ANPzXHTIakRp8SRRrqOly4wbZAX8eIoI70s6dfsHqAEYf6O" alt="Logistics" />
                  </div>
                  <div className="h-64 rounded-2xl overflow-hidden shadow-lg border border-outline-variant">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBI5r46nQpGnyg17uNzbLBqzHxACeGS7TWuIPPtHsMlagzLAhSRnCZce_XYtPMGYcvWOyF_Tsl6GhLWI13y_uQd2s8Z5_duG_BH120t4LAXs2QOfuosjQbcVsv3B7y5SA3FFWQBfiyFvSbJ04gqWs2a11jAKjHlOz0KXZIiLvGut7gcXiZ3II1_fbKd9r5P2ml95R8K6JV55oJFMCv3QSysCWPqDJb4XiIOMNvx8XjGyRGZWWvz" alt="Partnership" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <section className="py-24 bg-primary text-on-primary">
        <div className="max-w-container-max mx-auto px-margin-desktop text-center">
          <h2 className="font-display-lg text-display-lg mb-6">{t('home_newsletter_title')}</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl mx-auto mb-10">{t('home_newsletter_desc')}</p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder:text-white/40"
              placeholder={t('home_newsletter_placeholder')}
              required
            />
            <button type="submit" disabled={newsletterLoading} className="bg-white text-primary px-8 py-4 rounded-lg font-label-md text-label-md font-bold hover:bg-secondary-fixed transition-all whitespace-nowrap border-none cursor-pointer disabled:opacity-50">
              {newsletterLoading ? '...' : t('home_newsletter_btn')}
            </button>
          </form>
          {newsletterMsg && <p className="mt-4 text-white font-label-sm text-label-sm">{newsletterMsg}</p>}
          <p className="mt-6 text-on-primary-container font-label-sm text-label-sm opacity-60">{t('home_newsletter_disclaimer')}</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
