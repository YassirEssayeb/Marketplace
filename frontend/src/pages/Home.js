import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const Home = () => {
  const [ads, setAds] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', minPrice: '', maxPrice: '', location: '', sort: 'date_desc' });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => { api.get('/ads/categories').then(r => setCategories(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
    params.append('page', pagination.page);
    api.get('/ads?' + params.toString()).then(r => {
      setAds(r.data.ads);
      setPagination(r.data.pagination);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [filters, pagination.page]);

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="page-container">
      <div className="hero-section fade-in">
        <h1 className="hero-title">Trouvez tout ce que vous cherchez</h1>
        <p className="hero-subtitle">Des milliers de petites annonces près de chez vous. Meubles, électroménager, vêtements, voitures et bien plus.</p>
      </div>

      <div className="filters-bar">
        <input className="filter-input" placeholder="Rechercher..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        <select className="filter-input" value={filters.category} onChange={e => handleFilter('category', e.target.value)}>
          <option value="">Toutes catégories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input className="filter-input" type="number" placeholder="Prix min" value={filters.minPrice} onChange={e => handleFilter('minPrice', e.target.value)} style={{ minWidth: '100px' }} />
        <input className="filter-input" type="number" placeholder="Prix max" value={filters.maxPrice} onChange={e => handleFilter('maxPrice', e.target.value)} style={{ minWidth: '100px' }} />
        <input className="filter-input" placeholder="Localisation" value={filters.location} onChange={e => handleFilter('location', e.target.value)} />
        <select className="filter-input" value={filters.sort} onChange={e => handleFilter('sort', e.target.value)} style={{ minWidth: '160px' }}>
          <option value="date_desc">Plus récentes</option>
          <option value="date_asc">Plus anciennes</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray-400)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          Chargement des annonces...
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '1.25rem', color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            {pagination.total} annonce{pagination.total > 1 ? 's' : ''} trouvée{pagination.total > 1 ? 's' : ''}
          </p>
          {ads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--gray-400)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <p style={{ fontSize: '1.1rem' }}>Aucune annonce trouvée</p>
              <p style={{ marginTop: '0.5rem' }}>Essayez de modifier vos filtres.</p>
            </div>
          ) : (
            <div className="ad-grid fade-in">
              {ads.map(ad => (
                <Link to={'/ads/' + ad.id} key={ad.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="ad-card">
                    <div className="ad-card-image">
                      {ad.images && ad.images.length > 0 ? (
                        <img src={getImageUrl(ad.images[0])} alt={ad.title} />
                      ) : (
                        <span style={{ color: 'var(--gray-400)', fontSize: '2rem' }}>📷</span>
                      )}
                    </div>
                    <div className="ad-card-body">
                      <h3 className="ad-card-title">{ad.title}</h3>
                      <div className="ad-card-price">{ad.price ? ad.price.toLocaleString('fr-FR') + ' €' : 'Prix non spécifié'}</div>
                      <div className="ad-card-meta">
                        <span>📍 {ad.location || 'Localisation non spécifiée'}</span>
                        {ad.category_name && <span>📁 {ad.category_name}</span>}
                      </div>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                        {ad.user_name} — {new Date(ad.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {pagination.pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                  className={`page-btn ${p === pagination.page ? 'active' : ''}`}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
