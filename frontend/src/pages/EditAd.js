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
      alert(err.response?.data?.error || 'Error');
    } finally { setUploading(false); }
  };

  return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Edit listing</h1>
        <p className="font-body-md text-on-surface-variant mb-8">Update your listing information.</p>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-outline-variant space-y-6">
          {/* Title */}
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">Title</label>
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none resize-none"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">Price ($)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none bg-white cursor-pointer"
              >
                <option value="">Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">Location</label>
            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
            />
          </div>

          {/* Images */}
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">Images (max 10, 5MB each)</label>
            {existingImages.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {existingImages.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={getImageUrl(url)} alt="" className="w-20 h-20 object-cover rounded-lg border border-outline-variant" />
                    <button
                      type="button"
                      onClick={() => setExistingImages(existingImages.filter((_, j) => j !== i))}
                      className="absolute -top-2 -right-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer border-none shadow-md hover:opacity-80"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
            <div
              onClick={() => document.getElementById('file-input-edit').click()}
              className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center cursor-pointer hover:border-secondary transition-colors bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-5xl text-outline mb-2 block">add_a_photo</span>
              <p className="font-body-md font-semibold text-on-surface mb-1">Click to add images</p>
              <p className="font-body-sm text-on-surface-variant">JPG, PNG, GIF, WebP — up to 10 files</p>
            </div>
            <input id="file-input-edit" type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {previews.map((p, i) => (
                  <img key={i} src={p} alt="" className="w-20 h-20 object-cover rounded-lg border border-outline-variant" />
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-secondary text-on-secondary py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">save</span> Save changes
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default EditAd;
