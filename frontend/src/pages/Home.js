import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { MapPin, Folder, Image, Search, Package, Shield, Users, Euro, ArrowRight, Briefcase, Home, Car, Shirt, Sofa, Gamepad, Dumbbell, Wrench } from '../utils/icons';

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

const Landing = () => {
  const [ads, setAds] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    api.get('/ads?limit=8&sort=date_desc').then(r => setAds(r.data.ads)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = '/browse?search=' + encodeURIComponent(searchInput);
    }
  };

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
                style={{ '--cat-color': cat.color }}
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
          <h2 className="section-title">Annonces récentes</h2>
          <Link to="/browse" className="section-link">
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>
        {ads.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <p>Aucune annonce pour le moment. Soyez le premier à publier !</p>
          </div>
        ) : (
          <div className="ad-grid">
            {ads.map(ad => (
              <Link to={'/ads/' + ad.id} key={ad.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="ad-card">
                  <div className="ad-card-image">
                    {ad.status === 'sold' && <div className="ad-card-status"><span className="status-badge status-sold">Vendu</span></div>}
                    {ad.images && ad.images.length > 0 ? (
                      <img src={getImageUrl(ad.images[0])} alt={ad.title} loading="lazy" />
                    ) : (
                      <Image size={40} style={{ color: '#A1A1AA' }} />
                    )}
                  </div>
                  <div className="ad-card-body">
                    <h3 className="ad-card-title">{ad.title}</h3>
                    <div className="ad-card-price">
                      <Euro size={16} style={{ verticalAlign: 'text-bottom' }} /> {ad.price ? ad.price.toLocaleString('fr-FR') + ' €' : 'Prix non spécifié'}
                    </div>
                    <div className="ad-card-meta">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} /> {ad.location || 'N/A'}
                      </span>
                      {ad.category_name && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Folder size={14} /> {ad.category_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
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
