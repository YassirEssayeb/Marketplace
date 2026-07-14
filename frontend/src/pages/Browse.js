import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const demoBrowseProducts = [
  { id: 'd1', title: 'Lumix X-900 Cinema', price: 2499, category_name: 'Electronics', subcategory: 'Cameras', badge: 'New Arrival', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7t-vAd7dx4TIJkuhQh0hiWSYp0LTGlfK41kFPy7HqrhkEx-4PLLGtpGCvqOS1tEUu_j6UltpJzjkz36rUlz93zY-4jUNfgYI4Ow_l0SRfMTOpUCyCmUTI5Es4QK5WfTL3xZKS21Snn3nD-3B4mWCCcXZcPI_nLofgknjPtb_A-U-7RZESibiJhw4yUTfEBtqatIqMMNN5rrgVJBkROvf_vjkl4bN828c-uj72qZ4k9EITeB7T', rating: 5, reviews: 124, sellerBadge: 'Verified Seller' },
  { id: 'd2', title: 'UltraView 32" 4K Curved', price: 899, category_name: 'Tech', subcategory: 'Displays', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgYW0AZfKgGDS0K9SL43XHyUObHeLTMhmt5qqgSZNWpCp6btwQxY9yZ_AMIrgloaWfiqhRofJkCl8w2LRv1poflK_qcp2UGk_6lqs-qxmbuXe8vuKX-aGgtPSQKnULeSUjzwz361Kvy2COWLqVEzRTU2QYHc7hKVWWnqseIr-i4_cUpOtRzyHzPi75KRiMXtEBTqYmm5IVUzyAx96XJDp3Q5SvdwEJQwoxXpTNgFSSX8zJZ9jF', rating: 4, reviews: 86, sellerBadge: 'Pro Shop' },
  { id: 'd3', title: 'Acoustic Pro Series X', price: 349, category_name: 'Creative', subcategory: 'Audio', badge: 'Best Seller', badgeType: 'secondary', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRv6yvy0oVOM3G4HVRc9IwoFjAZhKKcPFOWFjvqtA-P6TZ7YEX-DdVzIsF8GVg-zJEpuadvZIgAYlmnyGVcAJi470EHxdqUvsDrilYZqrVNTqp_qGrz2zx05RD0K5xhdvR5Kq0aEXntFzsyl4GDszAL0QlkNYZ-Mny0hv78fx3_nMvtDz-9YhFxXKQCCVSa3y6lFCVCmVXZSv2PcW1rlr0hAQo6mgQWHLBTR2tqQM4NgiXD0M1', rating: 5, reviews: 412, sellerBadge: 'Trusted' },
  { id: 'd4', title: 'SkyScan Pro Drone', price: 1200, category_name: 'Creative', subcategory: 'Aerial', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR4XbgBHbFhsQJFMl0R6cykhR38tWWiVBBU0Ko6V-kNXEPivb2cmyrFFxeVWnzHZLO-_qESNN8druDUhnzX56oUKR_aBcSwhEDLhk-O-SafkoRi6rI6WA8p11t1tmJ-2AcN0Yzh8HhjnJ0PCizARYxTJPOxOcQp6Mvaay3bPtTLze2BBeii09IboffgSGmMmlHyvQay86p8XXHLRnh3nWaeq5J6LdnJgKZx7Nd0rVQ07fKans3', rating: 4, reviews: 45, sellerBadge: 'Authorized' },
  { id: 'd5', title: 'KeyMaster Mechanical S2', price: 189, category_name: 'Office', subcategory: 'Input Devices', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3H-yXE1FJoj77p-dCb9oKGna95OdhvMAcv-OMkIGVrUGUdIGDNgkh_7FdiiMPg7pBImpB5IDRa2xlusRwuD9oceTcUrO1NbDAEWTqtDM_Nx6LHsr9YP5UyaE0paE5rRM1fm2MyBIncb_Lh88MhBCFTeFdrSNPeOf5Taid1w2PyC8uwMPXNkiaWkzaX94oiVsnIgu0246gNqzduW2tu-VA5YVkws2CYnbuiall-cMr1UqQc0Nb', rating: 4, reviews: 19, sellerBadge: 'New Seller' },
  { id: 'd6', title: 'NodeCore Cloud Server', price: 4500, category_name: 'Enterprise', subcategory: 'Server', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC3hCVEIB5ABm4hVbVC1-7wjIIw5zOJXwFSA_A-onr9Nkoa17e3k596IJpt6GHx2PKgoBZLgohidSwAo_QiyzQwjKWtfp4DmtiQ33ZvbAqC77YxvSAt8UAeA-9y3Ybw1UZaYK4b0I-FPS91DOQdkRpz-eG39yyiTfutPn6y5AYnfLvcn5VlnSLxQ4IgH5_Nt13WvkZZ7enhoJLtPfolzoIuwvyYXcb76AhuTKx2jfQYWFTqXTG', rating: 5, reviews: 12, sellerBadge: 'Platinum Seller' },
];

const Browse = () => {
  const [ads, setAds] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', minPrice: '', maxPrice: '', location: '', sort: 'date_desc' });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchParams] = useSearchParams();
  const [conditionFilter, setConditionFilter] = useState('Refurbished');

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

  const displayProducts = loading ? [] : (ads.length > 0 ? ads : demoBrowseProducts);

  return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen">
      <div className="flex flex-col md:flex-row gap-gutter">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-stack-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-primary">Filtres</h2>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-label-sm text-secondary hover:underline border-none bg-transparent cursor-pointer">Réinitialiser</button>
            )}
          </div>

          {/* Category */}
          <section>
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-stack-md uppercase tracking-wider">Catégorie</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === ''}
                  onChange={() => handleFilter('category', '')}
                  className="w-5 h-5 border-outline-variant rounded text-secondary focus:ring-secondary/20"
                />
                <span className="font-body-sm text-on-surface group-hover:text-secondary transition-colors">Toutes</span>
              </label>
              {categories.map(c => (
                <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === String(c.id)}
                    onChange={() => handleFilter('category', String(c.id))}
                    className="w-5 h-5 border-outline-variant rounded text-secondary focus:ring-secondary/20"
                  />
                  <span className="font-body-sm text-on-surface group-hover:text-secondary transition-colors">{c.name}</span>
                </label>
              ))}
            </div>
          </section>

          <div className="h-px bg-outline-variant"></div>

          {/* Price Range */}
          <section>
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-stack-md uppercase tracking-wider">Gamme de prix</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={e => handleFilter('minPrice', e.target.value)}
                  className="w-full h-10 px-3 border border-outline-variant rounded-lg font-body-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                />
                <span className="text-outline">à</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={e => handleFilter('maxPrice', e.target.value)}
                  className="w-full h-10 px-3 border border-outline-variant rounded-lg font-body-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                />
              </div>
              <div className="relative h-2 bg-surface-container rounded-full mt-4">
                <div className="absolute left-0 right-1/4 h-full bg-secondary rounded-full"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-secondary rounded-full shadow-sm cursor-pointer"></div>
                <div className="absolute left-3/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-secondary rounded-full shadow-sm cursor-pointer"></div>
              </div>
            </div>
          </section>

          <div className="h-px bg-outline-variant"></div>

          {/* Condition */}
          <section>
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-stack-md uppercase tracking-wider">État</h3>
            <div className="flex flex-wrap gap-2">
              {['Neuf', 'Reconditionné', 'Occasion'].map(c => (
                <button
                  key={c}
                  onClick={() => setConditionFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-label-sm border transition-all cursor-pointer ${
                    conditionFilter === c
                      ? 'bg-secondary text-white border-secondary'
                      : 'border-outline-variant hover:border-secondary bg-transparent text-on-surface'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          <div className="h-px bg-outline-variant"></div>

          {/* Rating */}
          <section>
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-stack-md uppercase tracking-wider">Note vendeur</h3>
            <div className="space-y-2">
              <button className="flex items-center gap-2 group w-full text-left bg-transparent border-none cursor-pointer">
                <div className="flex text-amber-500">
                  {[1,2,3,4].map(s => (
                    <span key={s} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                  <span className="material-symbols-outlined text-[18px]">star</span>
                </div>
                <span className="font-body-sm text-on-surface-variant group-hover:text-primary">& Plus</span>
              </button>
            </div>
          </section>
        </aside>

        {/* Main Listing Area */}
        <div className="flex-1 space-y-stack-lg">
          {/* Sorting & Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 border border-outline-variant rounded-xl gap-4">
            <p className="text-on-surface-variant font-body-sm">
              {loading ? 'Chargement...' : (
                <>Affichage <span className="font-bold text-primary">1-{Math.min(12, pagination.total || displayProducts.length)}</span> sur {pagination.total || displayProducts.length} produits</>
              )}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-label-md text-on-surface-variant">Trier par :</span>
              <select
                value={filters.sort}
                onChange={e => handleFilter('sort', e.target.value)}
                className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 font-label-md text-label-md outline-none focus:border-secondary transition-all cursor-pointer"
              >
                <option value="date_desc">En vedette</option>
                <option value="price_asc">Prix : croissant</option>
                <option value="price_desc">Prix : décroissant</option>
                <option value="date_asc">Nouvelles arrivées</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin"></div>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
              <p className="font-headline-sm text-headline-sm text-primary mb-2">Aucune annonce trouvée</p>
              <p className="font-body-md text-on-surface-variant">Essayez de modifier vos filtres ou d'élargir votre recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayProducts.map((ad, i) => (
                <div key={ad.id || i} className="group bg-white border border-outline-variant rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                    {ad.img || (ad.images && ad.images.length > 0) ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={ad.img || getImageUrl(ad.images[0])}
                        alt={ad.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-outline">image</span>
                      </div>
                    )}
                    {ad.badge && (
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                        ad.badgeType === 'secondary' ? 'bg-secondary text-white' : 'bg-white/90 backdrop-blur-sm text-primary'
                      }`}>{ad.badge}</div>
                    )}
                    {ad.status === 'sold' && (
                      <div className="absolute top-3 left-3 bg-error text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Vendu</div>
                    )}
                    <button className="absolute top-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-on-surface-variant hover:text-error transition-colors border-none cursor-pointer">
                      <span className="material-symbols-outlined">favorite</span>
                    </button>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-headline-sm text-headline-sm text-primary mb-1 group-hover:text-secondary transition-colors truncate">{ad.title}</h4>
                        <p className="text-label-sm text-on-surface-variant">{ad.category_name || ''}{ad.subcategory ? ` • ${ad.subcategory}` : ''}{ad.location ? ` • ${ad.location}` : ''}</p>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-primary ml-3 whitespace-nowrap">
                        {ad.price ? (typeof ad.price === 'number' ? '$' + ad.price.toLocaleString() : ad.price) : 'Prix N/S'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-500">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: s <= (ad.rating || 4) ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                        ))}
                      </div>
                      <span className="text-label-sm text-on-surface-variant">({ad.reviews || 0})</span>
                      <span className="h-1 w-1 bg-outline-variant rounded-full mx-1"></span>
                      <span className="text-label-sm text-secondary font-bold">{ad.sellerBadge || ''}</span>
                    </div>
                    <button className="w-full bg-primary text-white py-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 border-none cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">chat</span> Envoyer un message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center pt-10">
              <nav className="flex items-center gap-1">
                {pagination.page > 1 && (
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-surface-container transition-all bg-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                )}
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all border-none cursor-pointer ${
                        p === pagination.page
                          ? 'bg-secondary text-white'
                          : 'hover:bg-surface-container text-on-surface bg-white'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                {pagination.pages > 5 && <span className="px-2 text-outline">...</span>}
                {pagination.pages > 5 && (
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: pagination.pages }))}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all border-none cursor-pointer ${
                      pagination.pages === pagination.page ? 'bg-secondary text-white' : 'hover:bg-surface-container text-on-surface bg-white'
                    }`}
                  >
                    {pagination.pages}
                  </button>
                )}
                {pagination.page < pagination.pages && (
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-surface-container transition-all bg-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Browse;
