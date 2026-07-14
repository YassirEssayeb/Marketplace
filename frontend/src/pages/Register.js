import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [data, setData] = useState({ name: '', email: '', password: '', phone: '', city: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(data.name, data.email, data.password, data.phone, data.city);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || "Erreur d'inscription");
    }
  };

  return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-xl border border-outline-variant">
          <div className="text-center mb-8">
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Inscription</h1>
            <p className="font-body-md text-on-surface-variant">Créez votre compte gratuitement.</p>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6 flex items-center gap-2 font-body-sm">
              <span className="material-symbols-outlined text-[18px]">error</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">Nom complet *</label>
              <input
                name="name"
                placeholder="Votre nom"
                value={data.name}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">Email *</label>
              <input
                name="email"
                type="email"
                placeholder="votre@email.fr"
                value={data.email}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
              />
            </div>
            <div>
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">Mot de passe *</label>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">Téléphone</label>
                <input
                  name="phone"
                  placeholder="Téléphone"
                  value={data.phone}
                  onChange={handleChange}
                  className="w-full h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2 block">Ville</label>
                <input
                  name="city"
                  placeholder="Ville"
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
              <span className="material-symbols-outlined text-[20px]">person_add</span> S'inscrire
            </button>
          </form>

          <p className="mt-6 text-center text-body-sm text-on-surface-variant">
            Déjà un compte ? <Link to="/login" className="font-semibold text-secondary hover:underline no-underline">Connectez-vous</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
