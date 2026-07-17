import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSent(true);
      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || t('error'));
    }
  };

  return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl border border-outline-variant">
          <div className="text-center mb-8">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">{t('forgot_title')}</h1>
            <p className="font-body-md text-on-surface-variant">{t('forgot_desc')}</p>
          </div>

          {sent ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-6xl text-secondary mb-4 block">mark_email_read</span>
              <p className="font-body-md text-on-surface-variant mb-6">{msg}</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-md text-label-md font-bold no-underline"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> {t('forgot_back')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-error-container text-on-error-container p-4 rounded-lg flex items-center gap-2 font-body-sm">
                  <span className="material-symbols-outlined text-[18px]">error</span> {error}
                </div>
              )}
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder={t('forgot_email_ph')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-secondary text-on-secondary py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">send</span> {t('forgot_send')}
              </button>
              <div className="text-center">
                <Link to="/login" className="inline-flex items-center gap-1 text-body-sm text-secondary font-medium hover:underline no-underline">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span> {t('forgot_back')}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
