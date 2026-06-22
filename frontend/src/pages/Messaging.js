import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Send, MessageCircle } from '../utils/icons';

const Messaging = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/messages').then(r => setConversations(r.data)).catch(() => {});
  }, [user, navigate]);

  const loadMessages = async (userId) => {
    setSelectedUser(userId);
    const res = await api.get('/messages/' + userId);
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    try {
      const res = await api.post('/messages', { receiver_id: selectedUser, content: newMsg });
      setMessages([...messages, res.data]);
      setNewMsg('');
    } catch { alert('Erreur'); }
  };

  const otherUser = conversations.find(c => c.user.id === selectedUser);

  return (
    <div className="chat-layout">
      <div className="chat-sidebar">
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageCircle size={18} />
          <h3 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Conversations</h3>
        </div>
        {conversations.map(c => (
          <div key={c.user.id} onClick={() => loadMessages(c.user.id)}
            style={{
              padding: '1rem', cursor: 'pointer', borderBottom: '1px solid var(--gray-100)',
              background: selectedUser === c.user.id ? 'var(--primary-light)' : 'white',
              transition: 'var(--transition)'
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: selectedUser === c.user.id ? 'var(--primary)' : 'var(--gray-900)' }}>{c.user.name}</strong>
              {c.unread > 0 && <span className="badge">{c.unread}</span>}
            </div>
            {c.lastMessage && <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--gray-500)' }}>{c.lastMessage.content.substring(0, 50)}</p>}
          </div>
        ))}
        {conversations.length === 0 && (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.9rem' }}>Aucune conversation</p>
        )}
      </div>
      <div className="chat-main">
        {selectedUser ? (
          <>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--gray-200)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserIcon size={18} /> {otherUser ? otherUser.user.name : 'Chargement...'}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map(m => (
                <div key={m.id} style={{
                  alignSelf: m.sender_id === user.id ? 'flex-end' : 'flex-start',
                  background: m.sender_id === user.id ? 'var(--primary)' : 'var(--gray-100)',
                  color: m.sender_id === user.id ? 'white' : 'var(--gray-900)',
                  padding: '0.625rem 1rem',
                  borderRadius: m.sender_id === user.id ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  maxWidth: '70%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.4 }}>{m.content}</p>
                  <small style={{ opacity: 0.6, fontSize: '0.7rem', marginTop: '0.25rem', display: 'block' }}>
                    {new Date(m.created_at).toLocaleTimeString('fr-FR')}
                  </small>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--gray-200)', display: 'flex', gap: '0.75rem' }}>
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Votre message..." className="form-input"
                onKeyDown={e => e.key === 'Enter' && sendMessage()} />
              <button onClick={sendMessage} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Send size={16} /> Envoyer
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-400)' }}>
            <MessageCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem' }}>Sélectionnez une conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

const UserIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

export default Messaging;
