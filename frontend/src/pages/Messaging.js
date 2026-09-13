import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const Messaging = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [filter, setFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef(null);
  const chatScrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    const el = chatScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get('/messages').then(r => setConversations(r.data)).catch(() => {});
  }, [user, navigate]);

  const loadMessages = async (userId) => {
    setSelectedUser(userId);
    setMessages([]);
    const res = await api.get('/messages/' + userId);
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedUser) return;
    try {
      const ad_id = conversations.find(c => c.user.id === selectedUser)?.ad_id || null;
      const res = await api.post('/messages', { receiver_id: selectedUser, content: newMsg, ad_id });
      setMessages([...messages, res.data]);
      setNewMsg('');
      const convRes = await api.get('/messages');
      setConversations(convRes.data);
    } catch { alert(t('messaging_err_send')); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await api.post('/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const ad_id = conversations.find(c => c.user.id === selectedUser)?.ad_id || null;
      const res = await api.post('/messages', {
        receiver_id: selectedUser,
        content: '',
        ad_id,
        file_url: uploadRes.data.url
      });
      setMessages([...messages, res.data]);
      const convRes = await api.get('/messages');
      setConversations(convRes.data);
    } catch { alert(t('messaging_err_upload')); }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getFileIcon = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext)) return 'image';
    if (['mp3', 'wav'].includes(ext)) return 'audio_file';
    if (['mp4'].includes(ext)) return 'video_file';
    if (['pdf'].includes(ext)) return 'picture_as_pdf';
    if (['zip', 'rar'].includes(ext)) return 'folder_zip';
    return 'description';
  };

  const isImage = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext);
  };

  const otherUser = conversations.find(c => c.user.id === selectedUser);

  return (
    <div className="flex h-[calc(100vh-64px)] sm:h-screen pt-16 sm:pt-20 overflow-hidden max-w-container-max mx-auto w-full bg-surface-container-lowest shadow-lg px-2 sm:px-4 lg:px-0">
      {/* Left Sidebar */}
      <aside className={`${showMobileChat ? 'hidden' : 'flex'} md:flex w-full md:w-80 lg:w-96 flex-col bg-surface-container-lowest border-r border-outline-variant h-full shadow-sm`}>
        <div className="p-3 sm:p-4 lg:p-6 border-b border-outline-variant">
          <h1 className="font-headline-sm text-headline-sm text-primary mb-4">{t('messaging_title')}</h1>
          <div className="flex gap-2">
            {[
              { key: 'all', label: t('messaging_all') },
              { key: 'buying', label: t('messaging_buying') },
              { key: 'selling', label: t('messaging_selling') },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-label-sm font-label-sm transition-colors border-none cursor-pointer ${
                  filter === f.key
                    ? 'bg-secondary-fixed text-on-secondary-fixed'
                    : 'hover:bg-surface-container-high text-on-surface-variant bg-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto chat-scroll">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">chat</span>
              <p className="font-body-md text-on-surface-variant">{t('messaging_no_conversations')}</p>
              <p className="text-sm text-on-surface-variant mt-1">{t('messaging_start_chat')}</p>
            </div>
          ) : (
            conversations.map(c => (
              <div
                key={c.user.id}
                onClick={() => loadMessages(c.user.id)}
                className={`p-4 flex gap-4 cursor-pointer transition-colors border-b border-outline-variant/30 ${
                  selectedUser === c.user.id
                    ? 'bg-secondary-fixed/30 border-l-4 border-l-secondary'
                    : 'hover:bg-surface-bright'
                }`}
              >
                <Link to={`/user/${c.user.id}`} onClick={e => e.stopPropagation()} className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center font-bold text-primary">
                    {c.user.avatar_url ? (
                      <img src={c.user.avatar_url} alt={c.user.name} className="w-full h-full object-cover" />
                    ) : (
                      c.user.name?.charAt(0) || 'U'
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <Link to={`/user/${c.user.id}`} onClick={e => e.stopPropagation()} className="font-label-md text-label-md text-primary truncate no-underline hover:underline">{c.user.name}</Link>
                    <span className="text-[11px] text-on-surface-variant font-medium">
                      {c.lastMessage ? new Date(c.lastMessage.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  {c.unread > 0 ? (
                    <p className="text-body-sm font-medium text-secondary truncate">
                      {c.lastMessage?.content ? c.lastMessage.content.substring(0, 50) : t('messaging_file')}
                    </p>
                  ) : (
                    <p className="text-body-sm text-on-surface-variant truncate">
                      {c.lastMessage?.content ? c.lastMessage.content.substring(0, 50) : t('messaging_no_messages')}
                    </p>
                  )}
                  {c.ad_title && (
                    <Link to={`/ads/${c.ad_id}`} onClick={e => e.stopPropagation()} className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container rounded border border-outline-variant/30 no-underline">
                      <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">{c.ad_title}</span>
                    </Link>
                  )}
                </div>
                {c.unread > 0 && (
                  <span className="bg-secondary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-1">{c.unread}</span>
                )}
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <section className={`${!showMobileChat ? 'hidden' : 'flex'} md:flex flex-1 flex-col bg-surface-bright h-full md:ml-4 lg:ml-6 shadow-sm`}>
        {selectedUser ? (
          <>
            {/* Header */}
            <header className="h-16 sm:h-20 bg-surface-container-lowest border-b border-outline-variant px-3 sm:px-6 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant border-none cursor-pointer bg-transparent"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <Link to={`/user/${otherUser?.user.id}`} className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary overflow-hidden no-underline">
                  {otherUser?.user.avatar_url ? (
                    <img src={otherUser.user.avatar_url} alt={otherUser.user.name} className="w-full h-full object-cover" />
                  ) : (
                    otherUser?.user.name?.charAt(0) || 'U'
                  )}
                </Link>
                <div>
                  <Link to={`/user/${otherUser?.user.id}`} className="font-headline-sm text-headline-sm leading-none text-primary no-underline hover:underline">{otherUser?.user.name || t('loading')}</Link>
                  {otherUser?.ad_title && (
                    <p className="text-label-sm text-on-surface-variant mt-0.5">{t('messaging_re')} {otherUser.ad_title}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors border-none cursor-pointer bg-transparent" title={t('messaging_call')}>
                  <span className="material-symbols-outlined">call</span>
                </button>
                <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors border-none cursor-pointer bg-transparent" title={t('messaging_video')}>
                  <span className="material-symbols-outlined">videocam</span>
                </button>
              </div>
            </header>

            {/* Messages */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex gap-3 max-w-[70%] ${m.sender_id === user.id ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex-shrink-0 mt-1 flex items-center justify-center overflow-hidden">
                    {m.sender_id === user.id ? (
                      user?.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-primary">{user.name?.charAt(0) || 'U'}</span>
                      )
                    ) : (
                      otherUser?.user.avatar_url ? (
                        <img src={otherUser.user.avatar_url} alt={otherUser.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-primary">{otherUser?.user.name?.charAt(0) || 'U'}</span>
                      )
                    )}
                  </div>
                  <div className={m.sender_id === user.id ? 'flex flex-col items-end' : ''}>
                    <div className={`rounded-xl overflow-hidden ${
                      m.sender_id === user.id
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-low text-on-surface border border-outline-variant/30'
                    }`}>
                      {m.file_url && (
                        <div>
                          {isImage(m.file_url) ? (
                            <a href={m.file_url} target="_blank" rel="noopener noreferrer">
                              <img src={m.file_url} alt={t('messaging_shared_file')} className="max-w-[280px] max-h-[200px] object-cover block hover:opacity-90 transition-opacity" />
                            </a>
                          ) : (
                            <a href={m.file_url} target="_blank" rel="noopener noreferrer"
                              className={`flex items-center gap-3 px-4 py-3 no-underline ${m.sender_id === user.id ? 'text-on-primary' : 'text-primary'}`}>
                              <span className="material-symbols-outlined text-[28px]">{getFileIcon(m.file_url)}</span>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate max-w-[180px]">{m.file_url.split('/').pop()}</p>
                                <p className="text-[10px] opacity-70">{t('messaging_click_open')}</p>
                              </div>
                            </a>
                          )}
                        </div>
                      )}
                      {m.content && (
                        <div className="p-4 text-body-md">
                          {m.content}
                        </div>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${m.sender_id === user.id ? 'mr-1' : 'ml-1'}`}>
                      <span className="text-[11px] text-on-surface-variant">
                        {new Date(m.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {m.sender_id === user.id && (
                        <span className="material-symbols-outlined text-secondary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <footer className="p-4 bg-surface-container-lowest border-t border-outline-variant">
              <div className="flex items-end gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt,.zip,.rar,.mp3,.mp4,.wav"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-3 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant border-none cursor-pointer bg-transparent flex-shrink-0"
                  title={t('messaging_share_file')}
                >
                  {uploading ? (
                    <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="material-symbols-outlined">attach_file</span>
                  )}
                </button>
                <div className="flex-1 relative bg-surface-bright border border-outline-variant rounded-xl focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/15 transition-all">
                  <textarea
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="w-full bg-transparent border-none focus:ring-0 p-4 text-body-md resize-none min-h-[48px] max-h-[120px] outline-none"
                    placeholder={t('messaging_type')}
                    rows="1"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMsg.trim()}
                  className={`h-[48px] w-[48px] rounded-xl flex items-center justify-center transition-all border-none flex-shrink-0 ${
                    newMsg.trim()
                      ? 'bg-secondary text-on-secondary hover:opacity-90 active:scale-95 cursor-pointer shadow-md shadow-secondary/20'
                      : 'bg-surface-container-high text-outline cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-30">chat</span>
            <p className="font-headline-sm text-headline-sm">{t('messaging_select')}</p>
            <p className="font-body-md text-on-surface-variant mt-2">{t('messaging_choose')}</p>
          </div>
        )}
      </section>
      {/* Mobile toggle button */}
      {!showMobileChat && (
        <button
          onClick={() => setShowMobileChat(true)}
          className="md:hidden fixed bottom-4 right-4 w-12 h-12 bg-secondary text-on-secondary rounded-full shadow-lg flex items-center justify-center border-none cursor-pointer z-50"
        >
          <span className="material-symbols-outlined">chat</span>
        </button>
      )}
    </div>
  );
};

export default Messaging;
