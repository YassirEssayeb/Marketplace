import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TABS = ['stats', 'users', 'ads', 'reports', 'categories'];

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');

  useEffect(() => {
    if (!user) return navigate('/login');
  }, [user, navigate]);

  const loadStats = async () => { const r = await api.get('/admin/stats'); setStats(r.data); };
  const loadUsers = async () => { const r = await api.get('/admin/users'); setUsers(r.data); };
  const loadAds = async () => { const r = await api.get('/admin/ads'); setAds(r.data); };
  const loadReports = async () => { const r = await api.get('/admin/reports'); setReports(r.data); };
  const loadCategories = async () => { const r = await api.get('/admin/categories'); setCategories(r.data); };

  useEffect(() => {
    if (tab === 'stats') loadStats();
    else if (tab === 'users') loadUsers();
    else if (tab === 'ads') loadAds();
    else if (tab === 'reports') loadReports();
    else if (tab === 'categories') loadCategories();
  }, [tab]);

  const toggleAdmin = async (id, is_admin) => { await api.put('/admin/users/' + id, { is_admin: !is_admin }); loadUsers(); };
  const deleteUser = async (id) => { if (!window.confirm('Supprimer cet utilisateur ?')) return; await api.delete('/admin/users/' + id); loadUsers(); };
  const updateAdStatus = async (id, status) => { await api.put('/admin/ads/' + id, { status }); loadAds(); };
  const deleteAd = async (id) => { if (!window.confirm('Supprimer cette annonce ?')) return; await api.delete('/admin/ads/' + id); loadAds(); };
  const deleteReport = async (id) => { await api.delete('/admin/reports/' + id); loadReports(); };

  const addCategory = async () => {
    if (!newCat.trim()) return;
    await api.post('/admin/categories', { name: newCat });
    setNewCat('');
    loadCategories();
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    await api.delete('/admin/categories/' + id);
    loadCategories();
  };

  return (
    <div className="page-container">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Administration</h2>
      <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Gérez votre plateforme.</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline'}`}>
            {t === 'stats' ? 'Statistiques' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'stats' && stats && (
        <div className="stats-grid fade-in">
          {[
            { label: 'Utilisateurs', value: stats.users, color: 'var(--primary)' },
            { label: 'Annonces', value: stats.ads, color: 'var(--success)' },
            { label: 'Annonces actives', value: stats.active, color: '#2ecc71' },
            { label: 'Signalements', value: stats.reports, color: 'var(--warning)' },
            { label: 'Messages', value: stats.messages, color: '#9b59b6' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="table-container fade-in">
          <table className="table">
            <thead><tr><th>ID</th><th>Nom</th><th>Email</th><th>Admin</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td><td style={{ fontWeight: 600 }}>{u.name}</td><td>{u.email}</td>
                  <td>{u.is_admin ? <span className="status-badge status-active">Admin</span> : <span className="status-badge status-archived">Utilisateur</span>}</td>
                  <td style={{ color: 'var(--gray-500)' }}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <button onClick={() => toggleAdmin(u.id, u.is_admin)} className={`btn btn-sm ${u.is_admin ? 'btn-warning' : 'btn-success'}`} style={{ marginRight: '0.375rem' }}>
                      {u.is_admin ? 'Rétrograder' : 'Promouvoir'}
                    </button>
                    <button onClick={() => deleteUser(u.id)} className="btn btn-sm btn-danger">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'ads' && (
        <div className="table-container fade-in">
          <table className="table">
            <thead><tr><th>ID</th><th>Titre</th><th>Utilisateur</th><th>Statut</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {ads.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td><td style={{ fontWeight: 600 }}>{a.title}</td><td>{a.user_name}</td>
                  <td><span className={`status-badge status-${a.status}`}>{a.status}</span></td>
                  <td style={{ color: 'var(--gray-500)' }}>{new Date(a.created_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    {a.status !== 'archived' && <button onClick={() => updateAdStatus(a.id, 'archived')} className="btn btn-sm btn-warning" style={{ marginRight: '0.375rem' }}>Archiver</button>}
                    {a.status !== 'active' && <button onClick={() => updateAdStatus(a.id, 'active')} className="btn btn-sm btn-success" style={{ marginRight: '0.375rem' }}>Activer</button>}
                    <button onClick={() => deleteAd(a.id)} className="btn btn-sm btn-danger">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'reports' && (
        <div className="table-container fade-in">
          <table className="table">
            <thead><tr><th>ID</th><th>Annonce</th><th>Signalé par</th><th>Motif</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td><td style={{ fontWeight: 600 }}>{r.ad_title}</td><td>{r.reporter_name}</td>
                  <td style={{ color: 'var(--danger)' }}>{r.reason}</td>
                  <td style={{ color: 'var(--gray-500)' }}>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                  <td><button onClick={() => deleteReport(r.id)} className="btn btn-sm btn-success">Traité</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'categories' && (
        <div className="fade-in">
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Nouvelle catégorie" className="form-input" style={{ maxWidth: '300px' }} />
            <button onClick={addCategory} className="btn btn-success">Ajouter</button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>ID</th><th>Nom</th><th>Actions</th></tr></thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td><td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td><button onClick={() => deleteCategory(c.id)} className="btn btn-sm btn-danger">Supprimer</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
