import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const AdDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [msg, setMsg] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    api.get('/ads/' + id).then(r => setAd(r.data)).catch(() => navigate('/'));
  }, [id, navigate]);

  useEffect(() => {
    if (!user) return;
    api.get('/favorites/check/' + id).then(r => setFavorited(r.data.favorited)).catch(() => {});
  }, [id, user]);

  const sendMessage = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post('/messages', { receiver_id: ad.user_id, content: msg, ad_id: ad.id });
      setMsg('');
      navigate('/messages');
    } catch { alert('Erreur'); }
  };

  const toggleFavorite = async () => {
    if (!user) return navigate('/login');
    try {
      if (favorited) {
        await api.delete('/favorites/' + id);
        setFavorited(false);
      } else {
        await api.post('/favorites/' + id);
        setFavorited(true);
      }
    } catch { alert('Erreur'); }
  };

  const deleteAd = async () => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    try {
      await api.delete('/ads/' + id);
      navigate('/my-ads');
    } catch { alert('Erreur'); }
  };

  const reportAd = async () => {
    const reason = prompt('Motif du signalement :');
    if (!reason) return;
    try {
      await api.post('/ads/' + id + '/report', { reason });
      alert('Annonce signalée');
    } catch { alert('Erreur'); }
  };

  if (!ad) return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin mb-4"></div>
      <p className="text-on-surface-variant font-body-md">Chargement...</p>
    </main>
  );

  const images = ad.images && ad.images.length > 0 ? ad.images : [];

  return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop">
      {/* Product Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Image Gallery (Bento Style) */}
        <div className="lg:col-span-7 grid grid-cols-4 gap-4 h-[600px]">
          <div className="col-span-4 row-span-3 rounded-xl overflow-hidden border border-outline-variant bg-white group cursor-zoom-in">
            {images.length > 0 ? (
              <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={getImageUrl(images[currentImage])}
                alt={ad.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-outline">image</span>
              </div>
            )}
          </div>
          {images.slice(0, 4).map((img, i) => (
            <div
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`col-span-1 rounded-xl overflow-hidden border bg-white cursor-pointer hover:border-secondary transition-colors ${
                i === currentImage ? 'border-secondary' : 'border-outline-variant'
              }`}
            >
              <img className="w-full h-full object-cover" src={getImageUrl(img)} alt="" />
            </div>
          ))}
          {images.length > 4 && (
            <div className="col-span-1 rounded-xl overflow-hidden border border-outline-variant bg-white relative cursor-pointer group">
              <img className="w-full h-full object-cover opacity-60" src={getImageUrl(images[4])} alt="" />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-primary">+{images.length - 4}</div>
            </div>
          )}
        </div>

        {/* Right: Purchase Details */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          {/* Title & Rating */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-surface-container px-3 py-1 rounded-full text-label-sm font-label-sm text-on-surface-variant border border-outline-variant">
                {ad.category_name || 'Annonce'}
              </span>
              <span className="text-secondary font-bold text-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.9 ({ad.reviews || 124} avis)
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">{ad.title}</h1>
            <p className="text-on-surface-variant font-body-md text-body-md leading-relaxed">{ad.description || 'Aucune description fournie.'}</p>
          </div>

          {/* Price Card */}
          <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-display-lg font-display-lg text-primary">
                {ad.price ? (typeof ad.price === 'number' ? ad.price.toLocaleString('fr-FR') + ' €' : ad.price) : 'Prix N/S'}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {user && user.id !== ad.user_id ? (
                <>
                  <button
                    onClick={sendMessage}
                    className="w-full bg-white border border-outline-variant text-primary py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:bg-surface-container transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span> Envoyer un message
                  </button>
                  <textarea
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    placeholder="Écrivez votre message au vendeur..."
                    rows="3"
                    className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none resize-none"
                  />
                </>
              ) : !user ? (
                <Link
                  to="/login"
                  className="w-full bg-secondary text-white py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 no-underline text-center"
                >
                  <span className="material-symbols-outlined text-[20px]">login</span> Se connecter pour contacter
                </Link>
              ) : null}
            </div>

            {/* Shipping Info */}
            <div className="mt-6 pt-6 border-t border-outline-variant grid gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <p className="text-label-sm font-bold">Livraison gratuite</p>
                  <p className="text-[10px] text-on-surface-variant">Expédié en 2-3 jours</p>
                </div>
              </div>
              {ad.location && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <p className="text-label-sm font-bold">Localisation</p>
                    <p className="text-[10px] text-on-surface-variant">{ad.location}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">calendar_today</span>
                </div>
                <div>
                  <p className="text-label-sm font-bold">Publiée le</p>
                  <p className="text-[10px] text-on-surface-variant">{new Date(ad.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>

            {/* Owner actions */}
            {user && user.id === ad.user_id && (
              <div className="mt-6 pt-6 border-t border-outline-variant flex gap-3">
                <Link
                  to={'/ads/' + ad.id + '/edit'}
                  className="flex-1 bg-surface-container border border-outline-variant text-primary py-3 rounded-lg font-label-md text-label-md font-bold hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 no-underline text-center"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span> Modifier
                </Link>
                <button
                  onClick={deleteAd}
                  className="flex-1 bg-error-container border border-error-container text-on-error-container py-3 rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span> Supprimer
                </button>
              </div>
            )}

            {/* Favorite & Report */}
            <div className="mt-4 flex gap-3">
              {user && (
                <button
                  onClick={toggleFavorite}
                  className={`flex-1 border py-3 rounded-lg font-label-md text-label-md font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    favorited
                      ? 'bg-error-container border-error-container text-on-error-container'
                      : 'bg-white border-outline-variant text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]" style={favorited ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {favorited ? 'favorite' : 'favorite_border'}
                  </span>
                  {favorited ? 'En favori' : 'Ajouter aux favoris'}
                </button>
              )}
              {user && user.id !== ad.user_id && (
                <button
                  onClick={reportAd}
                  className="border border-outline-variant py-3 px-4 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
                >
                  <span className="material-symbols-outlined text-[18px]">flag</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description & Seller Tabs */}
      <div className="mt-20">
        <div className="flex gap-10 border-b border-outline-variant mb-8">
          {['description', 'specifications', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 border-b-2 font-headline-sm transition-colors bg-transparent border-x-0 border-t-0 cursor-pointer ${
                activeTab === tab
                  ? 'border-secondary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab === 'description' && 'Description'}
              {tab === 'specifications' && 'Spécifications'}
              {tab === 'reviews' && `Avis (${ad.reviews || 124})`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Description Content */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-on-surface-variant font-body-md text-body-md">
                <p>{ad.description || 'Aucune description fournie.'}</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li>Matériaux de haute qualité pour une durabilité optimale.</li>
                  <li>Design professionnel adapté aux exigences du marché.</li>
                  <li>Garantie fabricant incluse.</li>
                  <li>Expédition sécurisée avec suivi en temps réel.</li>
                </ul>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-low rounded-lg">
                    <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">État</p>
                    <p className="font-bold text-primary">Neuf</p>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-lg">
                    <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Catégorie</p>
                    <p className="font-bold text-primary">{ad.category_name || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-lg">
                    <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Localisation</p>
                    <p className="font-bold text-primary">{ad.location || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-lg">
                    <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Publiée le</p>
                    <p className="font-bold text-primary">{new Date(ad.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/50">
                  <div className="flex text-secondary mb-1">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-xs italic text-on-surface-variant">"Transaction fluide et produit de qualité exceptionnelle. Je recommande vivement ce vendeur."</p>
                  <p className="text-[10px] mt-2 font-bold">— Marc V., Acheteur vérifié</p>
                </div>
              </div>
            )}
          </div>

          {/* About the Seller Section */}
          <div className="lg:col-span-4 bg-surface-container-low p-8 rounded-2xl border border-outline-variant">
            <h3 className="font-headline-sm text-headline-sm text-primary mb-6">À propos du vendeur</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant">person</span>
              </div>
              <div>
                <p className="font-bold text-lg text-primary">{ad.user_name}</p>
                <p className="text-sm text-on-surface-variant">Membre depuis {new Date(ad.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</p>
              </div>
            </div>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              Vendeur spécialisé dans les produits de haute qualité. Chaque article est vérifié avant la mise en vente.
            </p>
            <div className="space-y-4">
              <p className="font-bold text-sm uppercase tracking-wider text-primary">Avis récents</p>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/50">
                <div className="flex text-secondary mb-1">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-xs italic text-on-surface-variant">"Excellent vendeur, livraison rapide et produit conforme."</p>
                <p className="text-[10px] mt-2 font-bold">— Sophie T., Vérifié</p>
              </div>
            </div>
            {user && user.id !== ad.user_id && (
              <Link
                to={`/messages?user=${ad.user_id}`}
                className="w-full mt-6 py-2 border border-secondary text-secondary rounded-lg font-bold text-sm hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-2 no-underline text-center"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span> Voir le profil
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      <div className="mt-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Produits similaires</h2>
            <p className="text-on-surface-variant font-body-md">Sélections de notre catalogue professionnel</p>
          </div>
          <Link to="/browse" className="text-secondary font-bold hover:underline flex items-center gap-1">
            Tout voir <span className="material-symbols-outlined">chevron_right</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Moniteurs Studio Pro 500', category: 'Audio', price: '1 299 €', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDA8fTJnLBDhow9aPEzyBUwa5e0cfJncQNg8EPVGu_L7NMw3dKhXOqtJ6ZgMevjijK1XnHUsDygAR4qgFI0t2qdXKIpHp2ectGWUdqT65cNUvqZgybpdTVB-ykp3ANikqk-lCgy3gb5UAHaFYr9_qS4X8L6yVxipJIBDtNg1ltUSdIGc6HHXCfpr6vD-WZgUMJk2Ay4rTP3Ll-oGkhIpUQZ9iDe1_XoyqJG3_p6TM-ZC-9dA8K' },
            { title: 'Écran Courbe 49"', category: 'Écrans', price: '1 850 €', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1LM6h_MTmBaTaYN5UfjpKTVyoVG6jvs2eyw84QdrFijMWhG7O0Nk7OlYsttk1mFi-eniZPaGsu0xGT_x4p013Mv7YCYuaRvmHp-gQ7CdASfiW8gZ7ZAw8w6_VvMeDTgJAG6RpDwRJL0-dRPgQLNkn4f25E-HdCgdtQxmq1SGOE8u1BJs0SMZaRg7ghrz_N75LiquALSbm_si1TPIUJ-rnXx86XnywN-3KsNWakbnvesMk0Vt7' },
            { title: 'Clavier Mécanique Prime', category: 'Périphériques', price: '249 €', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBVQFJ1zkpPiIHkLYsJa7b8TiacGchJYKuAsUEpnjYfxgXfh_i-GY39SIusdKQdmJxydYeArvl8Bl_w9zqfES4b5cNQrIl2OnUc812sDQ3TKGiyeGpQ_Z4133lowpxlRLmR1bC4JGfqD23Ayli3NIZw8u-AoQQyk0ktG4ziHdsleJHY8ewSnXCyGgOFEqqCUAo2trSk-Mmgy5ICNpiVf8ldGJ7Z48SG_mTIv6SfEmqelK7QvKp' },
            { title: 'Serveur Cloud 8 To', category: 'Entreprise', price: '2 400 €', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkzFFKt7X9Cb3gXuCjIuiMy56Tz_BBvmCpG-gDpTqUfz6mnV6mksOmjfQw0-lymsJbzO2AAKYIgPtZmPoUMenolXTMCk5BQGvMVFQCEQ_p2ENnPWc-CcAVo8leFpdz6iOZsNOsgfZCsKqIJX_gik8toqGHbD-Stqjb-MvnpAx5nQF4hDj8S8Sjrsx-DWNAr7GeWMGSo_Rh_lb-rA5oU2o8FsSeVD8BRsOblBU3KTkei8Oe2mJl' },
          ].map((item, i) => (
            <div key={i} className="group bg-white border border-outline-variant rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={item.img} alt={item.title} />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-md">
                  <span className="material-symbols-outlined text-primary text-[20px]">favorite</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1">{item.category}</p>
                <h4 className="font-bold text-primary mb-2 truncate">{item.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">{item.price}</span>
                  <button className="p-2 rounded-full hover:bg-surface-container transition-colors bg-transparent border-none cursor-pointer">
                    <span className="material-symbols-outlined text-secondary">add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdDetail;
