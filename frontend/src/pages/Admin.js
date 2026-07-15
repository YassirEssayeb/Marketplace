import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TABS = ['stats', 'users', 'ads', 'reports', 'categories'];
const TAB_LABELS = { stats: 'Statistics', users: 'Users', ads: 'Listings', reports: 'Reports', categories: 'Categories' };
const TAB_ICONS = { stats: 'analytics', users: 'people', ads: 'inventory_2', reports: 'flag', categories: 'category' };

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
  const [editCat, setEditCat] = useState(null);

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
  const deleteUser = async (id) => { if (!window.confirm('Delete this user?')) return; await api.delete('/admin/users/' + id); loadUsers(); };
  const updateAdStatus = async (id, status) => { await api.put('/admin/ads/' + id, { status }); loadAds(); };
  const deleteAd = async (id) => { if (!window.confirm('Delete this listing?')) return; await api.delete('/admin/ads/' + id); loadAds(); };
  const deleteReport = async (id) => { await api.delete('/admin/reports/' + id); loadReports(); };

  const addCategory = async () => {
    if (!newCat.trim()) return;
    await api.post('/admin/categories', { name: newCat });
    setNewCat('');
    loadCategories();
  };

  const renameCategory = async (id, name) => {
    await api.put('/admin/categories/' + id, { name });
    setEditCat(null);
    loadCategories();
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await api.delete('/admin/categories/' + id);
    loadCategories();
  };

  return (
    <main className="pt-32 pb-20 max-w-container-max mx-auto px-margin-desktop min-h-screen">
      <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Administration</h1>
      <p className="font-body-md text-on-surface-variant mb-8">Manage your platform.</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-label-md text-label-md border cursor-pointer transition-all ${
              tab === t
                ? 'bg-secondary text-on-secondary border-secondary'
                : 'bg-white text-on-surface-variant border-outline-variant hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{TAB_ICONS[t]}</span>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Stats */}
      {tab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Users', value: stats.users, icon: 'people' },
            { label: 'Listings', value: stats.ads, icon: 'inventory_2' },
            { label: 'Active', value: stats.active, icon: 'check_circle' },
            { label: 'Reports', value: stats.reports, icon: 'flag' },
            { label: 'Messages', value: stats.messages, icon: 'chat' },
          ].map(s => (
            <div key={s.label} className="bg-white p-6 rounded-xl border border-outline-variant text-center">
              <span className="material-symbols-outlined text-3xl text-secondary mb-2 block">{s.icon}</span>
              <div className="font-display-lg text-display-lg text-primary">{s.value}</div>
              <div className="font-label-md text-label-md text-on-surface-variant mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Users Table */}
      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Name</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Email</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Role</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Date</th>
                <th className="text-right p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-outline-variant/30 hover:bg-surface-bright transition-colors">
                  <td className="p-4 text-body-sm text-on-surface-variant">{u.id}</td>
                  <td className="p-4 font-body-md font-semibold text-primary">{u.name}</td>
                  <td className="p-4 text-body-sm text-on-surface-variant">{u.email}</td>
                  <td className="p-4">
                    {u.is_admin ? (
                      <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-secondary-fixed text-on-secondary-fixed border border-secondary-fixed">Admin</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-label-sm font-label-sm bg-surface-container text-on-surface-variant border border-outline-variant">User</span>
                    )}
                  </td>
                  <td className="p-4 text-body-sm text-on-surface-variant">{new Date(u.created_at).toLocaleDateString('en-US')}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleAdmin(u.id, u.is_admin)}
                        className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm border cursor-pointer transition-colors ${
                          u.is_admin
                            ? 'bg-surface-container-high text-primary border-outline-variant hover:bg-surface-container'
                            : 'bg-secondary-fixed text-on-secondary-fixed border-secondary-fixed hover:opacity-80'
                        }`}
                      >
                        {u.is_admin ? 'Demote' : 'Promote'}
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="bg-error-container text-on-error-container border-none px-3 py-1.5 rounded-lg font-label-sm text-label-sm hover:opacity-80 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ads Table */}
      {tab === 'ads' && (
        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Title</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">User</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Date</th>
                <th className="text-right p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ads.map(a => (
                <tr key={a.id} className="border-b border-outline-variant/30 hover:bg-surface-bright transition-colors">
                  <td className="p-4 text-body-sm text-on-surface-variant">{a.id}</td>
                  <td className="p-4 font-body-md font-semibold text-primary">{a.title}</td>
                  <td className="p-4 text-body-sm text-on-surface-variant">{a.user_name}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${
                      a.status === 'active' ? 'bg-green-50 text-green-700 border border-green-200' :
                      a.status === 'sold' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-gray-50 text-gray-500 border border-gray-200'
                    }`}>{a.status}</span>
                  </td>
                  <td className="p-4 text-body-sm text-on-surface-variant">{new Date(a.created_at).toLocaleDateString('en-US')}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {a.status !== 'archived' && (
                        <button onClick={() => updateAdStatus(a.id, 'archived')} className="bg-surface-container-high text-primary border border-outline-variant px-3 py-1.5 rounded-lg font-label-sm text-label-sm hover:bg-surface-container cursor-pointer">Archive</button>
                      )}
                      {a.status !== 'active' && (
                        <button onClick={() => updateAdStatus(a.id, 'active')} className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg font-label-sm text-label-sm hover:bg-green-100 cursor-pointer">Activate</button>
                      )}
                      <button onClick={() => deleteAd(a.id)} className="bg-error-container text-on-error-container border-none px-3 py-1.5 rounded-lg font-label-sm text-label-sm hover:opacity-80 cursor-pointer">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reports Table */}
      {tab === 'reports' && (
        <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">ID</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Listing</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Reported by</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Reason</th>
                <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Date</th>
                <th className="text-right p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} className="border-b border-outline-variant/30 hover:bg-surface-bright transition-colors">
                  <td className="p-4 text-body-sm text-on-surface-variant">{r.id}</td>
                  <td className="p-4 font-body-md font-semibold text-primary">{r.ad_title}</td>
                  <td className="p-4 text-body-sm text-on-surface-variant">{r.reporter_name}</td>
                  <td className="p-4 text-body-sm text-error">{r.reason}</td>
                  <td className="p-4 text-body-sm text-on-surface-variant">{new Date(r.created_at).toLocaleDateString('en-US')}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => deleteReport(r.id)} className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg font-label-sm text-label-sm hover:bg-green-100 cursor-pointer">Resolved</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Categories */}
      {tab === 'categories' && (
        <div>
          <div className="flex gap-3 mb-6">
            <input
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              placeholder="New category"
              className="flex-1 max-w-sm h-12 px-4 border border-outline-variant rounded-lg font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
            />
            <button
              onClick={addCategory}
              className="bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all flex items-center gap-2 border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> Add
            </button>
          </div>
          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low">
                  <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">ID</th>
                  <th className="text-left p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Name</th>
                  <th className="text-right p-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id} className="border-b border-outline-variant/30 hover:bg-surface-bright transition-colors">
                    <td className="p-4 text-body-sm text-on-surface-variant">{c.id}</td>
                    <td className="p-4 font-body-md font-semibold text-primary">
                      {editCat === c.id ? (
                        <form onSubmit={e => { e.preventDefault(); renameCategory(c.id, e.target.name.value); }} className="flex gap-2">
                          <input name="name" defaultValue={c.name} className="h-9 px-3 border border-outline-variant rounded-lg font-body-sm focus:border-secondary outline-none" autoFocus />
                          <button type="submit" className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-lg font-label-sm text-label-sm cursor-pointer">OK</button>
                          <button type="button" onClick={() => setEditCat(null)} className="bg-surface-container-high text-primary border border-outline-variant px-3 py-1 rounded-lg font-label-sm text-label-sm cursor-pointer">Cancel</button>
                        </form>
                      ) : c.name}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditCat(c.id)} className="bg-surface-container-high text-primary border border-outline-variant px-3 py-1.5 rounded-lg font-label-sm text-label-sm hover:bg-surface-container cursor-pointer">
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                        </button>
                        <button onClick={() => deleteCategory(c.id)} className="bg-error-container text-on-error-container border-none px-3 py-1.5 rounded-lg font-label-sm text-label-sm hover:opacity-80 cursor-pointer">
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
};

export default Admin;
