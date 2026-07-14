import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Messaging = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [filter, setFilter] = useState('all');
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
    <div className="flex flex-1 pt-20 overflow-hidden max-w-container-max mx-auto w-full bg-surface-container-lowest shadow-lg min-h-screen">
      {/* Left Sidebar: Conversations List */}
      <aside className="w-full md:w-80 lg:w-96 border-r border-outline-variant flex flex-col bg-surface-container-lowest">
        <div className="p-6 border-b border-outline-variant">
          <h1 className="font-headline-sm text-headline-sm text-primary mb-4">Messages</h1>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Toutes' },
              { key: 'buying', label: 'Achats' },
              { key: 'selling', label: 'Ventes' },
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

        {/* Scrollable Conversation List */}
        <div className="flex-1 overflow-y-auto chat-scroll">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-6">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">chat</span>
              <p className="font-body-md text-on-surface-variant">Aucune conversation</p>
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
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center font-bold text-primary">
                    {c.user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-label-md text-label-md text-primary truncate">{c.user.name}</h3>
                    <span className="text-[11px] text-on-surface-variant font-medium">
                      {c.lastMessage ? new Date(c.lastMessage.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  {c.unread > 0 ? (
                    <p className="text-body-sm font-medium text-secondary truncate">
                      {c.lastMessage?.content.substring(0, 50) || 'Nouveau message'}
                    </p>
                  ) : (
                    <p className="text-body-sm text-on-surface-variant truncate">
                      {c.lastMessage?.content.substring(0, 50) || 'Aucun message'}
                    </p>
                  )}
                  {c.ad_title && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container rounded border border-outline-variant/30">
                      <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">{c.ad_title}</span>
                    </div>
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

      {/* Right: Chat Area */}
      <section className="flex-1 flex flex-col bg-surface-bright">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <header className="h-20 bg-surface-container-lowest border-b border-outline-variant px-6 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center font-bold text-primary">
                    {otherUser?.user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm leading-none text-primary">{otherUser?.user.name || 'Chargement...'}</h2>
                  <span className="text-label-sm text-green-600 font-semibold uppercase tracking-wider">En ligne</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors border-none cursor-pointer bg-transparent" title="Appel">
                  <span className="material-symbols-outlined">call</span>
                </button>
                <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors border-none cursor-pointer bg-transparent" title="Appel vidéo">
                  <span className="material-symbols-outlined">videocam</span>
                </button>
                <div className="w-px h-6 bg-outline-variant mx-1"></div>
                <button className="p-2 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors border-none cursor-pointer bg-transparent" title="Info">
                  <span className="material-symbols-outlined">info</span>
                </button>
              </div>
            </header>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-scroll">
              {/* Date Separator */}
              <div className="flex justify-center">
                <span className="px-4 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>

              {messages.map(m => (
                <div key={m.id} className={`flex gap-3 max-w-[80%] ${m.sender_id === user.id ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex-shrink-0 mt-1 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {m.sender_id === user.id ? user.name?.charAt(0) : otherUser?.user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className={m.sender_id === user.id ? 'flex flex-col items-end' : ''}>
                    <div className={`p-4 rounded-xl text-body-md ${
                      m.sender_id === user.id
                        ? 'bg-primary text-on-primary chat-bubble-sent'
                        : 'bg-surface-container-low text-on-surface border border-outline-variant/30 chat-bubble-received'
                    }`}>
                      {m.content}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${m.sender_id === user.id ? 'mr-1' : 'ml-1'}`}>
                      <span className="text-[11px] text-on-surface-variant">
                        {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {m.sender_id === user.id && (
                        <span className="material-symbols-outlined text-secondary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse animate-pulse">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex-shrink-0"></div>
                <div className="bg-surface-container p-3 rounded-full flex gap-1">
                  <span className="w-1.5 h-1.5 bg-outline rounded-full"></span>
                  <span className="w-1.5 h-1.5 bg-outline rounded-full"></span>
                  <span className="w-1.5 h-1.5 bg-outline rounded-full"></span>
                </div>
              </div>

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <footer className="p-6 bg-surface-container-lowest border-t border-outline-variant">
              <div className="flex flex-col gap-3">
                {/* Rich options */}
                <div className="flex items-center gap-2 mb-1">
                  <button className="flex items-center gap-1 px-3 py-1 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant rounded-full text-label-sm transition-colors text-on-surface-variant bg-transparent cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">attachment</span>
                    <span>Partager un fichier</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant rounded-full text-label-sm transition-colors text-on-surface-variant bg-transparent cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    <span>Créer une facture</span>
                  </button>
                </div>

                {/* Input Bar */}
                <div className="flex items-end gap-3">
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
                      className="w-full bg-transparent border-none focus:ring-0 p-4 pr-12 text-body-md resize-none min-h-[56px] chat-scroll outline-none"
                      placeholder="Écrivez un message..."
                      rows="1"
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                      <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors bg-transparent border-none cursor-pointer">
                        <span className="material-symbols-outlined">mood</span>
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={sendMessage}
                    className="h-[56px] w-[56px] bg-secondary text-on-secondary rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md shadow-secondary/20 border-none cursor-pointer"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  </button>
                </div>
                <p className="text-[11px] text-center text-outline uppercase tracking-widest font-bold">Appuyez sur Entrée pour envoyer</p>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-30">chat</span>
            <p className="font-headline-sm text-headline-sm">Sélectionnez une conversation</p>
            <p className="font-body-md text-on-surface-variant mt-2">Choisissez une conversation dans la barre latérale</p>
          </div>
        )}
      </section>

      {/* Right Details Sidebar (Hidden on smaller screens) */}
      <aside className="hidden xl:flex w-72 border-l border-outline-variant flex-col bg-surface-container-lowest overflow-y-auto chat-scroll">
        <div className="p-8 flex flex-col items-center text-center border-b border-outline-variant">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-surface-bright bg-surface-container-high flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {otherUser?.user.name?.charAt(0) || 'U'}
            </span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-primary">{otherUser?.user.name || 'Utilisateur'}</h3>
          <p className="text-body-sm text-on-surface-variant mb-4">Vendeur vérifié</p>
          <button className="w-full py-2 border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-bright transition-colors bg-transparent cursor-pointer">
            Voir le profil
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-label-md text-label-md text-primary mb-3 uppercase tracking-widest text-[10px]">Projet actif</h4>
            <div className="p-3 border border-outline-variant rounded-lg bg-surface-bright">
              <p className="font-label-md text-label-md text-primary mb-1">{otherUser?.ad_title || 'Aucun projet'}</p>
              <div className="flex justify-between text-label-sm text-on-surface-variant mb-2">
                <span>Progression</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-primary mb-3 uppercase tracking-widest text-[10px]">Médias partagés</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square bg-surface-container rounded overflow-hidden flex items-center justify-center">
                <span className="material-symbols-outlined text-outline">image</span>
              </div>
              <div className="aspect-square bg-surface-container rounded overflow-hidden flex items-center justify-center">
                <span className="material-symbols-outlined text-outline">image</span>
              </div>
              <div className="aspect-square bg-surface-container rounded flex items-center justify-center text-on-surface-variant cursor-pointer hover:bg-surface-container-high transition-colors">
                <span className="text-label-sm font-bold">+12</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-outline-variant">
            <button className="flex items-center gap-3 text-body-sm text-error font-medium hover:underline bg-transparent border-none cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">block</span>
              Bloquer l'utilisateur
            </button>
            <button className="flex items-center gap-3 text-body-sm text-on-surface-variant font-medium mt-3 hover:underline bg-transparent border-none cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">report</span>
              Signaler la conversation
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Messaging;
