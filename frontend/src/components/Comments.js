import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const CommentItem = ({ comment, adId, user, onDelete, onReply, timeAgo }) => {
  const { t } = useLanguage();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await onReply(replyText, comment.id);
    setReplyText('');
    setShowReply(false);
  };

  return (
    <div className="border-b border-outline-variant/50 pb-4 mb-4 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 overflow-hidden">
          {comment.user_avatar_url ? (
            <img src={comment.user_avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant">person</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link to={`/user/${comment.user_id}`} className="font-label-md text-label-md text-primary font-bold no-underline hover:underline">{comment.user_name}</Link>
            <span className="text-xs text-on-surface-variant">{timeAgo(comment.created_at)}</span>
          </div>
          <p className="text-sm text-on-surface font-body-md leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2">
            {user && (
              <button onClick={() => setShowReply(!showReply)} className="text-xs text-secondary font-bold hover:underline bg-transparent border-none cursor-pointer p-0">
                {t('detail_reply')}
              </button>
            )}
            {user && user.id === comment.user_id && (
              <button onClick={() => onDelete(comment.id)} className="text-xs text-error font-bold hover:underline bg-transparent border-none cursor-pointer p-0">
                {t('detail_delete_comment')}
              </button>
            )}
          </div>
          {showReply && (
            <div className="mt-3 flex gap-2">
              <input
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleReply()}
                placeholder={t('detail_reply_to') + ' ' + comment.user_name + '...'}
                className="flex-1 px-4 py-2 rounded-lg border border-outline-variant bg-surface text-sm focus:outline-none focus:border-secondary"
              />
              <button onClick={handleReply} className="px-4 py-2 rounded-lg bg-secondary text-on-secondary text-sm font-bold border-none cursor-pointer hover:opacity-90">{t('detail_post_comment')}</button>
              <button onClick={() => setShowReply(false)} className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant text-sm bg-transparent cursor-pointer hover:bg-surface-container">{t('detail_cancel')}</button>
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 ml-4 pl-4 border-l-2 border-outline-variant/50 space-y-3">
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} adId={adId} user={user} onDelete={onDelete} onReply={onReply} timeAgo={timeAgo} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Comments = ({ adId }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + t('detail_min_ago');
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + t('detail_h_ago');
    const days = Math.floor(hours / 24);
    if (days < 30) return days + t('detail_d_ago');
    const months = Math.floor(days / 30);
    return months + (months > 1 ? t('detail_months_ago') : t('detail_month_ago'));
  };

  const fetchComments = () => {
    api.get('/comments/ad/' + adId).then(r => { setComments(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchComments(); }, [adId]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    try {
      const r = await api.post('/comments/ad/' + adId, { content: newComment });
      setComments(prev => [{ ...r.data }, ...prev]);
      setNewComment('');
    } catch { }
  };

  const handleReply = async (content, parentId) => {
    try {
      const r = await api.post('/comments/ad/' + adId, { content, parent_id: parentId });
      fetchComments();
    } catch { }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete('/comments/' + commentId);
      setComments(prev => prev.filter(c => c.id !== commentId).map(c => ({ ...c, replies: c.replies ? c.replies.filter(r => r.id !== commentId) : [] })));
    } catch { }
  };

  return (
    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
      <h3 className="font-headline-sm text-headline-sm text-primary mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined">chat</span>
        {t('detail_comments')}
        <span className="text-sm text-on-surface-variant font-body-sm">({comments.length})</span>
      </h3>

      {user ? (
        <div className="flex gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder={t('detail_write_comment')}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-white text-sm focus:outline-none focus:border-secondary resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handlePost}
                disabled={!newComment.trim()}
                className="px-6 py-2 rounded-lg bg-secondary text-on-secondary text-sm font-bold border-none cursor-pointer hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t('detail_post_comment')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 mb-6 border border-outline-variant/50 rounded-xl bg-white">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">chat</span>
          <p className="text-on-surface-variant text-sm">
            <Link to="/login" className="text-secondary font-bold hover:underline">{t('detail_login_comment')}</Link>
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-surface-container-high border-t-secondary rounded-full animate-spin"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-on-surface-variant text-sm">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">forum</span>
          <p>{t('detail_no_comments')}</p>
        </div>
      ) : (
        <div>
          {comments.map(c => (
            <CommentItem key={c.id} comment={c} adId={adId} user={user} onDelete={handleDelete} onReply={handleReply} timeAgo={timeAgo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
