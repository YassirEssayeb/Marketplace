import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const TYPE_ICONS = {
  message: 'chat',
  favorite: 'favorite',
  ad_status: 'sell',
  system: 'info',
};

const TYPE_COLORS = {
  message: 'text-blue-500',
  favorite: 'text-red-500',
  ad_status: 'text-amber-500',
  system: 'text-gray-500',
};

const Notifications = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  const fetchNotifications = useCallback(async (p = 1) => {
    try {
      const res = await api.get('/notifications?page=' + p + '&limit=20');
      if (p === 1) {
        setNotifications(res.data.notifications);
      } else {
        setNotifications(prev => [...prev, ...res.data.notifications]);
      }
      setPagination(res.data.pagination);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchNotifications(1);
  }, [user, navigate, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.put('/notifications/' + id + '/read');
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch {}
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete('/notifications/' + id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    } catch {}
  };

  const deleteAll = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    } catch {}
  };

  const timeAgo = (dateStr) => {
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'now';
    if (diff < 3600) return Math.floor(diff / 60) + ' min';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h';
    if (diff < 604800) return Math.floor(diff / 86400) + 'd';
    return d.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="pt-24 pb-12 min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary">{t('notif_title')}</h1>
            <p className="text-on-surface-variant font-body-sm text-body-sm mt-1">
              {pagination.total} {t('notif_title').toLowerCase()}
              {unreadCount > 0 && <span className="ml-2 text-secondary font-medium">({unreadCount} unread)</span>}
            </p>
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 text-secondary bg-transparent border border-secondary rounded-lg font-label-sm text-label-sm hover:bg-secondary/10 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">done_all</span>
                  {t('notif_mark_all_read')}
                </button>
              )}
              <button
                onClick={deleteAll}
                className="flex items-center gap-2 px-4 py-2 text-error bg-transparent border border-error rounded-lg font-label-sm text-label-sm hover:bg-error/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                {t('notif_delete_all')}
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant">
            <span className="material-symbols-outlined text-outline text-[64px]">notifications_none</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mt-4">{t('notif_empty')}</h3>
            <p className="text-on-surface-variant font-body-md text-body-md mt-2 max-w-md mx-auto">{t('notif_empty_desc')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  n.is_read
                    ? 'bg-surface-container-lowest border-outline-variant hover:shadow-sm'
                    : 'bg-secondary-fixed-dim/20 border-secondary-fixed-dim/40 hover:shadow-sm'
                }`}
              >
                <span className={`material-symbols-outlined ${TYPE_COLORS[n.type] || 'text-on-surface-variant'} mt-0.5`}>
                  {TYPE_ICONS[n.type] || 'notifications'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-body-md font-body-md ${n.is_read ? 'text-on-surface-variant' : 'text-on-surface font-medium'}`}>
                      {n.title}
                    </p>
                    {!n.is_read && <span className="w-2.5 h-2.5 bg-secondary rounded-full flex-shrink-0 mt-1.5"></span>}
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-1">{n.message}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-body-xs text-outline">{timeAgo(n.created_at)}</span>
                    {n.link && (
                      <Link
                        to={n.link}
                        className="text-body-xs text-secondary font-medium hover:underline no-underline"
                      >
                        {t('notif_go_to')}
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!n.is_read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="p-2 text-on-surface-variant hover:text-secondary bg-transparent border-none cursor-pointer rounded-full hover:bg-surface-variant transition-colors"
                      title={t('notif_mark_read')}
                    >
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-2 text-on-surface-variant hover:text-error bg-transparent border-none cursor-pointer rounded-full hover:bg-error-container/50 transition-colors"
                    title={t('notif_delete')}
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>
            ))}

            {page < pagination.pages && (
              <div className="text-center py-6">
                <button
                  onClick={() => { setPage(p => p + 1); fetchNotifications(page + 1); }}
                  className="px-6 py-2.5 bg-transparent border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
