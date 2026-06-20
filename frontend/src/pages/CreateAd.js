import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CreateAd = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: '', category_id: '', location: '' });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/ads/categories').then(r => setCategories(r.data)).catch(() => {});
  }, [user, navigate]);

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
      let images = [];
      if (files.length > 0) {
        const fd = new FormData();
        files.forEach(f => fd.append('images', f));
        const uploadRes = await api.post('/upload', fd);
        images = uploadRes.data.urls;
      }
      const res = await api.post('/ads', {
        title: form.title, description: form.description, price: form.price || null,
        category_id: form.category_id || null, location: form.location || null,
        images: images.length > 0 ? images : null
      });
      navigate('/ads/' + res.data.id);
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur');
    } finally { setUploading(false); }
  };

  return (
    <div className="page-container" style={{ maxWidth: '640px' }}>
      <div className="card-lg" style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Déposer une annonce</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Publiez votre annonce en quelques clics.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Titre de l'annonce *</label>
            <input name="title" placeholder="Ex: iPhone 14 Pro Max 256 Go" value={form.title} onChange={handleChange} required className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" placeholder="Décrivez votre article en détail..." value={form.description} onChange={handleChange} rows="5" className="form-input" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Prix (€)</label>
              <input name="price" type="number" step="0.01" placeholder="0.00" value={form.price} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} className="form-input">
                <option value="">Sélectionnez</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Localisation</label>
            <input name="location" placeholder="Ex: Paris 11e" value={form.location} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Images (max 10, 5Mo chacune)</label>
            <div onClick={() => document.getElementById('file-input-create').click()}
              style={{ border: '2px dashed var(--gray-300)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: 'var(--gray-50)', transition: 'border-color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseOut={e => e.currentTarget.style.borderColor = 'var(--gray-300)'}>
              <p style={{ fontSize: '2rem', margin: 0, color: 'var(--gray-400)' }}>📷</p>
              <p style={{ fontWeight: 600, color: 'var(--gray-600)', margin: '0.5rem 0 0.25rem' }}>Cliquez pour ajouter des images</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', margin: 0 }}>Formats: JPG, PNG, GIF, WebP, AVIF, HEIC — jusqu'à 10 fichiers</p>
            </div>
            <input id="file-input-create" type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
            {previews.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {previews.map((p, i) => (
                  <img key={i} src={p} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)' }} />
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={uploading} className="btn btn-success" style={{ width: '100%', padding: '0.75rem', opacity: uploading ? 0.7 : 1 }}>
            {uploading ? '⏳ Publication en cours...' : "🚀 Publier l'annonce"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAd;
