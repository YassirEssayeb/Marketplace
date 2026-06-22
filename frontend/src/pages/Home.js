import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { MapPin, Folder, Image, Search, Package, Shield, Users, Euro, ArrowRight, X, Briefcase, Home, Car, Shirt, Sofa, Gamepad, Dumbbell, Wrench, Star, Quote } from '../utils/icons';

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

const PXL = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&h=350`;
const demoProducts = [
  { title: 'iPhone 15 Pro Max 256 Go', price: 899, location: 'Paris', category: 'Multimédia', img: PXL(29020349), desc: 'iPhone 15 Pro Max 256 Go, couleur Titane naturel. Acheté il y a 3 mois, état impeccable.' },
  { title: 'Canapé d\'angle en cuir 5 places', price: 450, location: 'Lyon', category: 'Maison & Jardin', img: PXL(4740494), desc: 'Canapé d\'angle en cuir véritable, 5 places. Couleur gris foncé, état très bon.' },
  { title: 'Volkswagen Golf 8 1.5 TSI', price: 18500, location: 'Marseille', category: 'Véhicules', img: PXL(12433114), desc: 'Volkswagen Golf 8, 1.5 TSI 130ch, 25 000 km, finition Carat. Première main.' },
  { title: 'Appartement 3 pièces 65m²', price: 135000, location: 'Bordeaux', category: 'Immobilier', img: PXL(7546648), desc: 'Bel appartement 3 pièces de 65m², exposé sud. Cuisine équipée, balcon, cave.' },
  { title: 'MacBook Pro M3 14" 18Go RAM', price: 1650, location: 'Toulouse', category: 'Multimédia', img: PXL(8068269), desc: 'MacBook Pro M3 14 pouces, 18Go RAM, 512Go SSD. Charge cycles: 45, batterie 98%.' },
  { title: 'Veste en cuir vintage taille M', price: 85, location: 'Lille', category: 'Mode', img: PXL(12345554), desc: 'Veste en cuir vintage, taille M. Cuir souple et patiné. Parfait état, doublure intacte.' },
  { title: 'Table de jardin en teck 6 places', price: 220, location: 'Nantes', category: 'Maison & Jardin', img: PXL(32076746), desc: 'Table de jardin en teck massif, 6 places (180x90cm). Utilisée 2 saisons.' },
  { title: 'Vélo électrique VTT 27.5"', price: 780, location: 'Strasbourg', category: 'Loisirs', img: PXL(34259660), desc: 'VTT électrique 27.5", moteur Bosch 250W, batterie 500Wh. Autonomie 80km.' },
  { title: 'Nintendo Switch OLED + jeux', price: 250, location: 'Rennes', category: 'Loisirs', img: PXL(34482313), desc: 'Nintendo Switch OLED modèle 2023, avec 4 jeux (Mario Kart, Zelda, Odyssey, Smash).' },
  { title: 'Lit superposé enfant 2 places', price: 120, location: 'Nice', category: 'Maison & Jardin', img: PXL(4221413), desc: 'Lit superposé en bois massif, 2 places (90x190cm). Matelas inclus.' },
  { title: 'Cours de guitare particulier', price: 25, location: 'En ligne', category: 'Services', img: PXL(10354611), desc: 'Cours de guitare en visio. Tous niveaux. 25€/h. Premier cours offert.' },
  { title: 'Canapé-lit convertible 140x190', price: 180, location: 'Paris', category: 'Maison & Jardin', img: PXL(7166930), desc: 'Canapé-lit convertible, matelas 140x190. Mécanisme facile, housse lavable.' },
  { title: 'Bague en or blanc diamant', price: 590, location: 'Paris', category: 'Mode', img: PXL(2849742), desc: 'Bague en or blanc 750, diamant 0.5ct. Certificat inclus. Jamais portée.' },
  { title: 'PlayStation 5 + 3 manettes', price: 380, location: 'Montpellier', category: 'Multimédia', img: PXL(13189290), desc: 'PS5 standard, 825Go. 3 manettes, 2 jeux (FIFA 25, Spider-Man 2). Très bon état.' },
  { title: 'Studio 25m² centre ville', price: 89000, location: 'Lyon', category: 'Immobilier', img: PXL(6447384), desc: 'Studio 25m² rénové, centre Lyon. Cuisine équipée, salle de douche.' },
  { title: 'Trottinette électrique Xiaomi', price: 280, location: 'Grenoble', category: 'Véhicules', img: PXL(9168370), desc: 'Xiaomi Pro 2, autonomie 45km. 200km, état neuf. Chargeur + antivol inclus.' },
  { title: 'Machine à laver hublot 7kg', price: 150, location: 'Tours', category: 'Maison & Jardin', img: PXL(9669475), desc: 'Machine à laver hublot 7kg, classe A++. Très bon état, détartrée.' },
  { title: 'Cours de yoga en ligne', price: 15, location: 'En ligne', category: 'Services', img: PXL(34395958), desc: 'Yoga en ligne, 15€/séance. Hatha, Vinyasa, Yin. Tous niveaux.' },
  { title: 'Drone DJI Mini 4 Pro', price: 720, location: 'Nice', category: 'Loisirs', img: PXL(5555813), desc: 'DJI Mini 4 Pro, 3 batteries, télécommande RC2. Volé 2h seulement.' },
  { title: 'Appareil photo Sony A7III', price: 1400, location: 'Lille', category: 'Multimédia', img: PXL(19826563), desc: 'Sony A7III, 24MP, 15000 déclenchements. Objectif 28-70mm inclus. Très bon état.' },
  { title: 'Pouf ottoman en velours', price: 65, location: 'Marseille', category: 'Maison & Jardin', img: PXL(10964021), desc: 'Pouf ottoman velours bleu canard. Diamètre 50cm. Parfait pour salon ou chambre.' },
  { title: 'Tondeuse autoportée Husqvarna', price: 2200, location: 'Rennes', category: 'Loisirs', img: PXL(5163431), desc: 'Husqvarna automotrice, 80cm de coupe. Révision récente, 150h d\'utilisation.' },
];

const Landing = () => {
  const [ads, setAds] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [failedImages, setFailedImages] = useState({});
  const [modalImgFailed, setModalImgFailed] = useState(false);

  useEffect(() => {
    api.get('/ads?limit=24&sort=date_desc').then(r => setAds(r.data.ads)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = '/browse?search=' + encodeURIComponent(searchInput);
    }
  };

  const allProducts = [...ads, ...demoProducts].slice(0, 24);

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
          {allProducts.map((ad, i) => {
            const isReal = ad.id !== undefined;
            return (
              <div key={i} onClick={() => { if (!isReal) setSelectedProduct(ad); }} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                {isReal ? (
                  <Link to={'/ads/' + ad.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <AdCard ad={ad} isReal={true} />
                  </Link>
                ) : (
                  <AdCard ad={ad} isReal={false} imgFailed={failedImages[ad.title]} onImgError={() => setFailedImages(prev => ({...prev, [ad.title]: true}))} />
                )}
              </div>
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

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => { setSelectedProduct(null); setModalImgFailed(false); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setSelectedProduct(null); setModalImgFailed(false); }}><X size={20} /></button>
            <div className="modal-image" style={modalImgFailed ? { background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}>
              {modalImgFailed ? (
                <span style={{ fontSize: '4rem', color: 'white', fontWeight: 700 }}>{selectedProduct.title.charAt(0)}</span>
              ) : (
                <img src={selectedProduct.img} alt={selectedProduct.title} onError={() => setModalImgFailed(true)} />
              )}
            </div>
            <div className="modal-body">
              <div className="modal-category" style={{ color: '#7C3AED', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedProduct.category}</div>
              <h2 className="modal-title">{selectedProduct.title}</h2>
              <div className="modal-price"><Euro size={18} /> {selectedProduct.price.toLocaleString('fr-FR')} €</div>
              <div className="modal-location"><MapPin size={16} /> {selectedProduct.location}</div>
              <p className="modal-desc">{selectedProduct.desc}</p>
              <Link to={"/browse?search=" + encodeURIComponent(selectedProduct.title.split(' ')[0])} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => { setSelectedProduct(null); setModalImgFailed(false); }}>
                Voir annonces similaires <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdCard = ({ ad, isReal, imgFailed, onImgError }) => (
  <div className="ad-card">
    <div className="ad-card-image">
      {ad.status === 'sold' && <div className="ad-card-status"><span className="status-badge status-sold">Vendu</span></div>}
      {isReal && ad.images && ad.images.length > 0 ? (
        <img src={getImageUrl(ad.images[0])} alt={ad.title} loading="lazy" />
      ) : !isReal && ad.img && !imgFailed ? (
        <img src={ad.img} alt={ad.title} loading="lazy" onError={onImgError} />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(135deg, #7C3AED, #A78BFA)', color: 'white', fontSize: '2.5rem', fontWeight: 700 }}>
          {ad.title.charAt(0)}
        </div>
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
);

export default Landing;
