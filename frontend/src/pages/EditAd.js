import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const EditAd = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', category_id: '', location: '' });
  const [existingImages, setExistingImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/ads/categories').then(r => setCategories(r.data)).catch(() => {});
    api.get('/ads/' + id).then(r => {
      const ad = r.data;
      setForm({
        title: ad.title, description: ad.description || '', price: ad.price || '',
        category_id: ad.category_id || '', location: ad.location || ''
      });
      if (ad.images) setExistingImages(ad.images);
    }).catch(() => navigate('/my-ads'));
  }, [user, navigate, id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let images = [...existingImages];
      if (files.length > 0) {
        const fd = new FormData();
        files.forEach(f => fd.append('images', f));
        const uploadRes = await api.post('/upload', fd);
        images = [...images, ...uploadRes.data.urls];
      }
      await api.put('/ads/' + id, {
        title: form.title, description: form.description, price: form.price || null,
        category_id: form.category_id || null, location: form.location || null,
        images: images.length > 0 ? images : null
      });
      navigate('/my-ads');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur');
    } finally { setUploading(false); }
  };

  return (
    <div className="page-container" style={{ maxWidth: '640px' }}>
      <div className="card-lg" style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Modifier l'annonce</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input name="title" placeholder="Titre" value={form.title} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="5" className="form-input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Prix (€)</label>
              <input name="price" type="number" step="0.01" placeholder="Prix" value={form.price} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} className="form-input">
                <option value="">Catégorie</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Localisation</label>
            <input name="location" placeholder="Localisation" value={form.location} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Images (max 10, 5Mo chacune)</label>
            {existingImages.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                {existingImages.map((url, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={getImageUrl(url)} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)' }} />
                    <button type="button" onClick={() => setExistingImages(existingImages.filter((_, j) => j !== i))}
                      style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '12px', lineHeight: '22px', padding: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div onClick={() => document.getElementById('file-input-edit').click()}
              style={{ border: '2px dashed var(--gray-300)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'var(--gray-50)', transition: 'border-color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--gray-300)'}>
              <p style={{ fontSize: '2rem', margin: 0, color: 'var(--gray-400)' }}>📷</p>
              <p style={{ fontWeight: 600, color: 'var(--gray-600)', margin: '0.5rem 0 0.25rem' }}>Cliquez pour ajouter des images</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', margin: 0 }}>Formats: JPG, PNG, GIF, WebP, AVIF, HEIC — jusqu'à 10 fichiers</p>
            </div>
            <input id="file-input-edit" type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {previews.map((p, i) => (
                  <img key={i} src={p} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)' }} />
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={uploading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', opacity: uploading ? 0.7 : 1 }}>
            {uploading ? '⏳ Enregistrement...' : '💾 Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAd;
