import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { MapPin, Folder, Image, Search, Package, Shield, Users, Euro, ArrowRight, Briefcase, Home, Car, Shirt, Sofa, Gamepad, Dumbbell, Wrench, Star, Quote } from '../utils/icons';

const categoriesList = [
  { name: 'Emploi', icon: Briefcase, color: '#3B82F6', bg: '#EFF6FF' },
  { name: 'Immobilier', icon: Home, color: '#10B981', bg: '#ECFDF5' },
  { name: 'Véhicules', icon: Car, color: '#F59E0B', bg: '#FFFBEB' },
  { name: 'Mode', icon: Shirt, color: '#EC4899', bg: '#FDF2F8' },
  { name: 'Maison & Jardin', icon: Sofa, color: '#8B5CF6', bg: '#F5F3FF' },
  { name: 'Multimédia', icon: Gamepad, color: '#EF4444', bg: '#FEF2F2' },
  { name: 'Loisirs', icon: Dumbbell, color: '#14B8A6', bg: '#F0FDFA' },
  { name: 'Services', icon: Wrench, color: '#F97316', bg: '#FFF7ED' },
];

const demoProducts = [
  { title: 'iPhone 15 Pro Max 256 Go', price: 899, location: 'Paris', category: 'Multimédia', catColor: '#EF4444', bg: 'linear-gradient(135deg, #1E1B4B, #312E81)', emoji: '📱' },
  { title: 'Canapé d\'angle en cuir 5 places', price: 450, location: 'Lyon', category: 'Maison & Jardin', catColor: '#8B5CF6', bg: 'linear-gradient(135deg, #1C1917, #292524)', emoji: '🛋️' },
  { title: 'Volkswagen Golf 8 1.5 TSI', price: 18500, location: 'Marseille', category: 'Véhicules', catColor: '#F59E0B', bg: 'linear-gradient(135deg, #1E3A5F, #0F172A)', emoji: '🚗' },
  { title: 'Appartement 3 pièces 65m²', price: 135000, location: 'Bordeaux', category: 'Immobilier', catColor: '#10B981', bg: 'linear-gradient(135deg, #0F172A, #1E293B)', emoji: '🏠' },
  { title: 'MacBook Pro M3 14" 18Go RAM', price: 1650, location: 'Toulouse', category: 'Multimédia', catColor: '#EF4444', bg: 'linear-gradient(135deg, #1E1B4B, #2E1065)', emoji: '💻' },
  { title: 'Veste en cuir vintage taille M', price: 85, location: 'Lille', category: 'Mode', catColor: '#EC4899', bg: 'linear-gradient(135deg, #1C1917, #3F1D2B)', emoji: '🧥' },
  { title: 'Table de jardin en teck 6 places', price: 220, location: 'Nantes', category: 'Maison & Jardin', catColor: '#8B5CF6', bg: 'linear-gradient(135deg, #0A1628, #1E293B)', emoji: '🪑' },
  { title: 'Vélo électrique VTT 27.5"', price: 780, location: 'Strasbourg', category: 'Loisirs', catColor: '#14B8A6', bg: 'linear-gradient(135deg, #0F172A, #1E3A5F)', emoji: '🚲' },
  { title: 'Nintendo Switch OLED + jeux', price: 250, location: 'Rennes', category: 'Loisirs', catColor: '#14B8A6', bg: 'linear-gradient(135deg, #1E1B4B, #5B21B6)', emoji: '🎮' },
  { title: 'Lit superposé enfant 2 places', price: 120, location: 'Nice', category: 'Maison & Jardin', catColor: '#8B5CF6', bg: 'linear-gradient(135deg, #1C1917, #292524)', emoji: '🛏️' },
  { title: 'Cours de guitare particulier', price: 25, location: 'En ligne', category: 'Services', catColor: '#F97316', bg: 'linear-gradient(135deg, #1E1B4B, #312E81)', emoji: '🎸' },
  { title: 'Canapé-lit convertible 140x190', price: 180, location: 'Paris', category: 'Maison & Jardin', catColor: '#8B5CF6', bg: 'linear-gradient(135deg, #0F172A, #1E293B)', emoji: '🛋️' },
];

const Landing = () => {
  const [ads, setAds] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    api.get('/ads?limit=12&sort=date_desc').then(r => setAds(r.data.ads)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = '/browse?search=' + encodeURIComponent(searchInput);
    }
  };

  const allProducts = [...ads, ...demoProducts].slice(0, 12);

  return (
    <div className="fade-in">
      <section className="hero-section" style={{ margin: '1.5rem 1.5rem 2.5rem' }}>
        <div className="hero-pattern" />
        <div className="hero-content" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 className="hero-title">
            Trouvez tout ce que vous cherchez,<br />près de chez vous
          </h1>
          <p className="hero-subtitle" style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '2rem' }}>
            Des milliers de petites annonces dans toute la France. Meubles, électroménager, vêtements, voitures et bien plus.
          </p>
          <form onSubmit={handleSearch}>
            <div className="hero-search" style={{ margin: '0 auto' }}>
              <div className="hero-search-input">
                <Search size={20} style={{ color: '#A1A1AA', flexShrink: 0 }} />
                <input
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Que cherchez-vous ? (ex: iPhone, canapé, appartement...)"
                />
              </div>
              <button type="submit" className="hero-search-btn">
                Rechercher
              </button>
            </div>
          </form>
          <div className="hero-stats" style={{ justifyContent: 'center' }}>
            <div className="hero-stat"><Package size={18} /> +10 000 annonces</div>
            <div className="hero-stat"><Users size={18} /> 5 000 utilisateurs</div>
            <div className="hero-stat"><Shield size={18} /> Paiement sécurisé</div>
          </div>
        </div>
      </section>

      <section className="page-container" style={{ paddingTop: '0.5rem', paddingBottom: '1rem' }}>
        <div className="section-header">
          <h2 className="section-title">Catégories</h2>
          <Link to="/browse" className="section-link">
            Tout voir <ArrowRight size={16} />
          </Link>
        </div>
        <div className="categories-grid">
          {categoriesList.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link to={'/browse?category=' + (i + 1)} key={i} className="category-card"
                onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.boxShadow = '0 8px 25px ' + cat.color + '20'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; }}
              >
                <div className="category-icon" style={{ background: cat.bg, color: cat.color }}>
                  <Icon size={22} />
                </div>
                <p className="category-name" style={{ color: cat.color }}>{cat.name}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="page-container" style={{ paddingTop: '1rem' }}>
        <div className="section-header">
          <h2 className="section-title">
            {ads.length > 0 ? 'Annonces récentes' : 'Ce que vendent nos membres'}
          </h2>
          <Link to="/browse" className="section-link">
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>
        <div className="ad-grid">
          {allProducts.slice(0, 12).map((ad, i) => {
            const isReal = ad.id !== undefined;
            return (
              <Link to={isReal ? '/ads/' + ad.id : '/browse?search=' + encodeURIComponent(ad.title.split(' ')[0])} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="ad-card">
                  <div className="ad-card-image" style={!isReal ? { background: ad.bg } : {}}>
                    {isReal ? (
                      <>
                        {ad.status === 'sold' && <div className="ad-card-status"><span className="status-badge status-sold">Vendu</span></div>}
                        {ad.images && ad.images.length > 0 ? (
                          <img src={getImageUrl(ad.images[0])} alt={ad.title} loading="lazy" />
                        ) : (
                          <Image size={40} style={{ color: '#A1A1AA' }} />
                        )}
                      </>
                    ) : (
                      <span style={{ fontSize: '3rem', filter: 'brightness(1) saturate(1.2)' }}>{ad.emoji}</span>
                    )}
                  </div>
                  <div className="ad-card-body">
                    <h3 className="ad-card-title">{ad.title}</h3>
                    <div className="ad-card-price">
                      <Euro size={16} style={{ verticalAlign: 'text-bottom' }} /> {ad.price ? ad.price.toLocaleString('fr-FR') + ' €' : 'Prix non spécifié'}
                    </div>
                    <div className="ad-card-meta">
                      {ad.location && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={14} /> {ad.location}
                        </span>
                      )}
                      {ad.category && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Folder size={14} /> {ad.category}
                        </span>
                      )}
                      {ad.category_name && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Folder size={14} /> {ad.category_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="page-container" style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
        <div className="trust-section">
          <div className="trust-card">
            <div className="trust-icon" style={{ background: 'rgba(124,58,237,0.1)' }}>
              <Shield size={28} style={{ color: '#7C3AED' }} />
            </div>
            <h3 className="trust-title">Transactions sécurisées</h3>
            <p className="trust-desc">Achetez et vendez en toute confiance sur notre plateforme.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <Users size={28} style={{ color: '#22C55E' }} />
            </div>
            <h3 className="trust-title">Grande communauté</h3>
            <p className="trust-desc">Rejoignez des milliers d'utilisateurs actifs près de chez vous.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <Euro size={28} style={{ color: '#F59E0B' }} />
            </div>
            <h3 className="trust-title">100% gratuit</h3>
            <p className="trust-desc">Publiez vos annonces gratuitement, sans commission.</p>
          </div>
          <div className="trust-card">
            <div className="trust-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <Search size={28} style={{ color: '#EF4444' }} />
            </div>
            <h3 className="trust-title">Recherche intelligente</h3>
            <p className="trust-desc">Filtres avancés pour trouver exactement ce qu'il vous faut.</p>
          </div>
        </div>
      </section>

      <section className="page-container" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <div className="section-header">
          <h2 className="section-title">Ce que disent nos utilisateurs</h2>
        </div>
        <div className="testimonials-grid">
          {[
            {
              name: 'Sophie Martin',
              role: 'Acheteuse régulière',
              avatar: 'SM',
              color: '#7C3AED',
              text: 'J\'ai trouvé un super canapé à moitié prix. La mise en relation avec le vendeur était rapide et le paiement sécurisé. Je recommande !',
              stars: 5,
            },
            {
              name: 'Thomas Dubois',
              role: 'Vendeur pro',
              avatar: 'TD',
              color: '#10B981',
              text: 'Je vends régulièrement sur cette plateforme. L\'interface est intuitive et les acheteurs sont sérieux. J\'ai déjà vendu plus de 30 articles.',
              stars: 5,
            },
            {
              name: 'Léa Petit',
              role: 'Acheteuse et vendeuse',
              avatar: 'LP',
              color: '#F59E0B',
              text: 'Le système de messagerie intégré est très pratique. Pas besoin de donner son numéro, tout se fait via l\'application. Sécurisé et simple.',
              stars: 5,
            },
          ].map((t, i) => (
            <div key={i} className="testimonial-card animate-fade-in" style={{ animationDelay: i * 0.1 + 's' }}>
              <Quote size={20} style={{ color: 'var(--primary)', opacity: 0.3, position: 'absolute', top: '1rem', left: '1rem' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="avatar" style={{ background: t.color }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '0.75rem' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', gap: '0.15rem' }}>
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} size={14} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-container" style={{ paddingTop: '0', paddingBottom: '2rem' }}>
        <div className="cta-banner">
          <h2 className="cta-title">Prêt à vendre ?</h2>
          <p className="cta-subtitle">
            Publiez votre première annonce en moins de 2 minutes. Rejoignez des milliers de vendeurs satisfaits.
          </p>
          <Link to="/ads/new" className="btn btn-success btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Déposer une annonce <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
