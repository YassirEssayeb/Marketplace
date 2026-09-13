import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Register = () => {
  const [data, setData] = useState({ name: '', email: '', password: '', phone: '', city: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(data.name, data.email, data.password, data.phone, data.city);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || t('register_error'));
    }
  };

  return (
    <main className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 max-w-container-max mx-auto px-4 sm:px-6 lg:px-margin-desktop min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl border border-outline-variant">
          <div className="text-center mb-8">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">{t('register_title')}</h1>
            <p className="font-body-md text-on-surface-variant">{t('register_subtitle')}</p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 flex items-center gap-2 font-body-sm">
              <span className="material-symbols-outlined text-[18px]">error</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('register_name')}</label>
              <input
                name="name"
                placeholder={t('register_name_ph')}
                value={data.name}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('register_email')}</label>
              <input
                name="email"
                type="email"
                placeholder={t('register_email_ph')}
                value={data.email}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('register_password')}</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={data.password}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('register_phone')}</label>
                <input
                  name="phone"
                  placeholder={t('register_phone')}
                  value={data.phone}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">{t('register_city')}</label>
                <input
                  name="city"
                  placeholder={t('register_city')}
                  value={data.city}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-secondary text-on-secondary py-4 rounded-lg font-headline-sm text-headline-sm font-bold hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span> {t('register_btn')}
            </button>
          </form>

          <p className="mt-6 text-center text-body-sm text-on-surface-variant">
            {t('register_has_account')} <Link to="/login" className="font-semibold text-secondary hover:underline no-underline">{t('register_login')}</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
