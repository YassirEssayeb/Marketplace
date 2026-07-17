import React, { useState } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/contact', form);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
    }
  };

  return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">{t('contact_title')}</h1>
        <p className="font-body-md text-on-surface-variant mb-8">{t('contact_subtitle')}</p>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-outline-variant text-center">
            <span className="material-symbols-outlined text-3xl text-secondary mb-3 block">mail</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-1">{t('contact_email_label')}</h3>
            <a href="mailto:contact@promarket.com" className="text-body-sm text-secondary hover:underline no-underline">{t('contact_email_val')}</a>
          </div>
          <div className="bg-white p-6 rounded-xl border border-outline-variant text-center">
            <span className="material-symbols-outlined text-3xl text-secondary mb-3 block">phone</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-1">{t('contact_phone_label')}</h3>
            <p className="text-body-sm text-on-surface-variant">{t('contact_phone_val')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-outline-variant text-center">
            <span className="material-symbols-outlined text-3xl text-secondary mb-3 block">location_on</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-1">{t('contact_address_label')}</h3>
            <p className="text-body-sm text-on-surface-variant">{t('contact_address_val')}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-xl border border-outline-variant">
          {sent ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-6xl text-green-500 mb-4 block">check_circle</span>
              <p className="font-headline-sm text-headline-sm text-primary mb-2">{t('contact_sent')}</p>
              <p className="font-body-md text-on-surface-variant">{t('contact_sent_desc')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-error-container text-on-error-container p-4 rounded-lg flex items-center gap-2 font-body-sm">
                  <span className="material-symbols-outlined text-[18px]">error</span> {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('contact_name')}</label>
                  <input
                    name="name"
                    placeholder={t('contact_name_ph')}
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('contact_form_email')}</label>
                  <input
                    name="email"
                    type="email"
                    placeholder={t('contact_form_email_ph')}
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('contact_subject')}</label>
                <input
                  name="subject"
                  placeholder={t('contact_subject_ph')}
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('contact_message')}</label>
                <textarea
                  name="message"
                  placeholder={t('contact_message_ph')}
                  value={form.message}
                  onChange={handleChange}
                  rows="5"
                  required
                  className="w-full px-4 py-3 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-secondary text-on-secondary py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">send</span> {t('contact_send')}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default Contact;
