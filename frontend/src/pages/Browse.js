import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import { MapPin, Folder, Image, Search, Euro, Clock, Loader, X } from '../utils/icons';

const Browse = () => {
  const [ads, setAds] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', minPrice: '', maxPrice: '', location: '', sort: 'date_desc' });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    api.get('/ads/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchInput(q);
    setFilters(prev => ({ ...prev, search: q }));
  }, [searchParams]);

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

  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', location: '', sort: 'date_desc' });
    setSearchInput('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="page-container fade-in">
      <div className="filters-bar">
        <div className="filter-group">
          <span className="filter-label">Recherche</span>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="filter-input"
              placeholder="Rechercher..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Catégorie</span>
          <select className="filter-input" value={filters.category} onChange={e => handleFilter('category', e.target.value)}>
            <option value="">Toutes</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <span className="filter-label">Prix min</span>
          <input className="filter-input" type="number" placeholder="0 €" value={filters.minPrice} onChange={e => handleFilter('minPrice', e.target.value)} />
        </div>
        <div className="filter-group">
          <span className="filter-label">Prix max</span>
          <input className="filter-input" type="number" placeholder="Max" value={filters.maxPrice} onChange={e => handleFilter('maxPrice', e.target.value)} />
        </div>
        <div className="filter-group">
          <span className="filter-label">Localisation</span>
          <input className="filter-input" placeholder="Ville..." value={filters.location} onChange={e => handleFilter('location', e.target.value)} />
        </div>
        <div className="filter-group" style={{ minWidth: '130px' }}>
          <span className="filter-label">Trier par</span>
          <select className="filter-input" value={filters.sort} onChange={e => handleFilter('sort', e.target.value)}>
            <option value="date_desc">Plus récentes</option>
            <option value="date_asc">Plus anciennes</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="btn btn-ghost" title="Réinitialiser les filtres" style={{ padding: '0.5rem 0.75rem', flexShrink: 0, alignSelf: 'flex-end' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="empty-state" style={{ padding: '4rem 0' }}>
          <Loader size={32} className="spinner" />
          <p style={{ marginTop: '0.75rem' }}>Chargement des annonces...</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {pagination.total} annonce{pagination.total !== 1 ? 's' : ''} trouvée{pagination.total !== 1 ? 's' : ''}
            </p>
          </div>
          {ads.length === 0 ? (
            <div className="empty-state" style={{ padding: '4rem 0' }}>
              <Search size={48} />
              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Aucune annonce trouvée</p>
              <p style={{ marginTop: '0.5rem' }}>Essayez de modifier vos filtres ou d'élargir votre recherche.</p>
            </div>
          ) : (
            <div className="ad-grid animate-fade-in">
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
                        <Euro size={16} style={{ verticalAlign: 'text-bottom' }} />{' '}
                        {ad.price ? ad.price.toLocaleString('fr-FR') + ' €' : 'Prix non spécifié'}
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
                      <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {new Date(ad.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {pagination.pages > 1 && (
            <div className="pagination">
              {pagination.page > 1 && (
                <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))} className="page-btn">
                  Précédent
                </button>
              )}
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                  className={`page-btn ${p === pagination.page ? 'active' : ''}`}>{p}</button>
              ))}
              {pagination.page < pagination.pages && (
                <button onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))} className="page-btn">
                  Suivant
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Browse;
