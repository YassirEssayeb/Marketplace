import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError(t('reset_pw_no_match'));
    setError('');
    try {
      await api.post('/auth/reset-password', { token: searchParams.get('token'), password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || t('error'));
    }
  };

  return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl border border-outline-variant">
          <div className="text-center mb-8">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">{t('reset_title')}</h1>
            <p className="font-body-md text-on-surface-variant">{t('reset_desc')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-lg flex items-center gap-2 font-body-sm">
                <span className="material-symbols-outlined text-[18px]">error</span> {error}
              </div>
            )}
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('reset_new_pw')}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('reset_confirm_pw')}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                minLength={6}
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-secondary text-on-secondary py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">lock_reset</span> {t('reset_btn')}
            </button>
            <div className="text-center">
              <Link to="/login" className="inline-flex items-center gap-1 text-body-sm text-secondary font-medium hover:underline no-underline">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span> {t('reset_back')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
