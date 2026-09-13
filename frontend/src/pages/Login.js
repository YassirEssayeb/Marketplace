import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || t('login_error'));
    }
  };

  return (
    <main className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 max-w-container-max mx-auto px-4 sm:px-6 lg:px-margin-desktop min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl border border-outline-variant">
          <div className="text-center mb-8">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">{t('login_title')}</h1>
            <p className="font-body-md text-on-surface-variant">{t('login_subtitle')}</p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 flex items-center gap-2 font-body-sm">
              <span className="material-symbols-outlined text-[18px]">error</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('login_email')}</label>
              <input
                type="email"
                placeholder={t('login_email_ph')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('login_password')}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-body-sm text-secondary font-medium hover:underline no-underline">{t('login_forgot')}</Link>
            </div>
            <button
              type="submit"
              className="w-full bg-secondary text-on-secondary py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">login</span> {t('login_btn')}
            </button>
          </form>

          <p className="mt-6 text-center text-body-sm text-on-surface-variant">
            {t('login_no_account')} <Link to="/register" className="font-semibold text-secondary hover:underline no-underline">{t('login_signup')}</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
