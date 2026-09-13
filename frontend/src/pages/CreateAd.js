import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const CreateAd = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
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
      alert(err.response?.data?.error || 'Error');
    } finally { setUploading(false); }
  };

  return (
    <main className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 max-w-container-max mx-auto px-4 sm:px-6 lg:px-margin-desktop min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">{t('create_title')}</h1>
        <p className="font-body-md text-on-surface-variant mb-8">{t('create_subtitle')}</p>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-outline-variant space-y-6">
          {/* Title */}
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('create_label_title')}</label>
            <input
              name="title"
              placeholder={t('create_title_ph')}
              value={form.title}
              onChange={handleChange}
              required
              className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('create_label_desc')}</label>
            <textarea
              name="description"
              placeholder={t('create_desc_ph')}
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none resize-none"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('create_label_price')}</label>
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder={t('create_price_ph')}
                value={form.price}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('create_label_category')}</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none bg-white cursor-pointer"
              >
                <option value="">{t('create_category_ph')}</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('create_label_location')}</label>
            <input
              name="location"
              placeholder={t('create_location_ph')}
              value={form.location}
              onChange={handleChange}
              className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
            />
          </div>

          {/* Images */}
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('create_label_images')}</label>
            <div
              onClick={() => document.getElementById('file-input-create').click()}
              className="border-2 border-dashed border-outline-variant rounded-xl p-4 sm:p-6 lg:p-8 text-center cursor-pointer hover:border-secondary transition-colors bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-5xl text-outline mb-2 block">add_a_photo</span>
              <p className="font-body-md font-semibold text-on-surface mb-1">{t('create_images_cta')}</p>
              <p className="font-body-sm text-on-surface-variant">{t('create_images_hint')}</p>
            </div>
            <input id="file-input-create" type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: 'none' }} />
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
                {t('create_publishing')}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">publish</span> {t('create_publish')}
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default CreateAd;
