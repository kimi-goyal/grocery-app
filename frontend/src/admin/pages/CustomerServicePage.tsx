import { useState, useEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAdminCallbackStore } from '../store/adminCallbackStore';
import AdminTopbar from '../components/AdminTopbar';
import { useAdminAuthStore } from '../store/adminAuthStore';
import axios from 'axios';
// import BASE_URL from your centralized services file
import { BASE_URL } from '../../services/api';

interface ChatMsg {
  id: string;
  from: 'user' | 'admin';
  fromName: string;
  text: string;
  time: string;
  imageUrl?: string;
}

interface Conversation {
  userId: string;
  displayName: string;
  messages: ChatMsg[];
  lastTime: string;
  unread: number;
  status: 'open' | 'resolved';
}

export default function CustomerServicePage() {
  const { callbacks, fetchPendingCallbacks, updateCallbackStatus, loading } = useAdminCallbackStore();
  const [resolving, setResolving] = useState<number | null>(null);
  const admin = useAdminAuthStore((s) => s.admin);

  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [showResolved, setShowResolved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConvo = activeTicketId ? conversations[activeTicketId] : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvo?.messages.length]);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const p = e.detail as any;
      const ticketId = p.ticket_id || `T-${p.from_user_id || 'unknown'}`;
      const userId = String(p.from_user_id || '');
      const msg: ChatMsg = {
        id: `msg-${Date.now()}-${Math.random()}`,
        from: 'user',
        fromName: p.from_name || `User ${userId}`,
        text: p.text || (p.image_url ? '[Image sent]' : ''),
        imageUrl: p.image_url || undefined,
        time: p.time || new Date().toISOString(),
      };
      setConversations((prev) => {
        const existing = prev[ticketId];
        return {
          ...prev,
          [ticketId]: {
            userId,
            displayName: msg.fromName,
            messages: [...(existing?.messages || []), msg],
            lastTime: msg.time,
            unread: activeTicketId === ticketId ? 0 : (existing?.unread || 0) + 1,
          },
        };
      });
    };
    window.addEventListener('support:message', handler as EventListener);
    return () => window.removeEventListener('support:message', handler as EventListener);
  }, [activeTicketId]);

  const openConversation = (ticketId: string) => {
    setActiveTicketId(ticketId);
    setConversations((prev) => ({
      ...prev,
      [ticketId]: { ...prev[ticketId], unread: 0 },
    }));

    const loadMessages = async () => {
      try {
        const existing = conversations[ticketId];
        if (existing && existing.messages && existing.messages.length > 0) return;
       
        // Updated URL string using BASE_URL template literal
        const res = await axios.get(`${BASE_URL}/api/v1/support/conversations/${ticketId}`, { withCredentials: true });
       
        const msgs = res.data?.messages || [];
        const formatted = msgs.map((m: any) => ({
          id: m.message_id || `m-${Date.now()}-${Math.random()}`,
          from: m.from_role === 'admin' ? 'admin' : 'user',
          fromName: m.from_name || '',
          text: m.text || '',
          imageUrl: m.image_url || undefined,
          time: m.time || new Date().toISOString(),
        } as ChatMsg));
        setConversations((prev) => ({
          ...prev,
          [ticketId]: {
            ...(prev[ticketId] || {} as Conversation),
            messages: formatted,
            status: res.data?.status || 'open',
            lastTime: res.data?.last_time || (formatted[formatted.length-1]?.time || new Date().toISOString())
          }
        }));
      } catch (e) {
        console.error('failed to load messages for', ticketId, e);
      }
    };

    void loadMessages();
  };

  const sendReply = async () => {
    if (!activeTicketId || !replyText.trim()) return;
    if (activeConvo?.status === 'resolved') {
      alert('Cannot send messages to a resolved conversation');
      return;
    }
    const text = replyText.trim();
    setSending(true);
    const optimisticMsg: ChatMsg = {
      id: `admin-${Date.now()}`,
      from: 'admin',
      fromName: admin?.name || 'Support Agent',
      text,
      time: new Date().toISOString(),
    };
    setConversations((prev) => ({
      ...prev,
      [activeTicketId]: {
        ...prev[activeTicketId],
        messages: [...(prev[activeTicketId]?.messages || []), optimisticMsg],
        lastTime: optimisticMsg.time,
      },
    }));
    setReplyText('');
    try {
      const convo = conversations[activeTicketId];
      const user_id = convo?.userId || '';
     
      // Updated URL string using BASE_URL template literal
      await axios.post(`${BASE_URL}/api/v1/support/admin/send`, { user_id, ticket_id: activeTicketId, text }, { withCredentials: true });
     
    } catch (err: any) {
      console.error('[admin send]', err);
      if (err.response?.status === 400 && err.response?.data?.detail?.includes('resolved')) {
        alert('This conversation has been resolved. No new messages can be sent.');
        setConversations((prev) => ({
          ...prev,
          [activeTicketId]: {
            ...prev[activeTicketId],
            status: 'resolved',
          },
        }));
      }
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchPendingCallbacks();
    const interval = setInterval(() => fetchPendingCallbacks(), 30_000);

    const loadConversations = async (resolved = false) => {
      try {
        const status = resolved ? 'resolved' : 'open';
       
        // Updated URL string using BASE_URL template literal
        const url = `${BASE_URL}/api/v1/support/conversations?status=${status}`;
       
        const res = await axios.get(url, { withCredentials: true });
        const list = res.data?.conversations || [];
        const map: Record<string, Conversation> = {};
        list.forEach((c: any) => {
          map[c.ticket_id] = {
            userId: String(c.user_id || ''),
            displayName: c.from_name || `User ${c.user_id || ''}`,
            messages: [],
            lastTime: c.last_time || new Date().toISOString(),
            unread: 0,
            status: c.status || 'open',
          };
        });
        setConversations(map);
      } catch (e) {
        console.error('failed to load conversations', e);
      }
    };

    void loadConversations(showResolved);

    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (id: number) => {
    setResolving(id);
    await updateCallbackStatus(id, 'resolved');
    setResolving(null);
  };

  const sortedConvos = Object.values(conversations).sort(
    (a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
  );

  return (
    <div className="min-h-screen bg-[#050816]">
      <AdminTopbar title="Customer Service" />

      <div className="p-6 max-w-7xl mx-auto space-y-8">

        {/* ── Callback Requests ── */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">Callback Requests</h2>
            <p className="text-gray-500 text-sm mt-0.5">Manage and resolve customer callback requests</p>
          </div>

          {loading && (
            <div className="flex items-center gap-3 py-10 justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF4D8D]" />
              <span className="text-gray-400 text-sm">Loading callbacks…</span>
            </div>
          )}

          {!loading && callbacks.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#0b1224]/50 p-10 text-center">
              <CheckCircle size={40} className="mx-auto mb-3 text-green-400" />
              <h3 className="text-lg font-semibold text-white mb-1">All caught up!</h3>
              <p className="text-gray-500 text-sm">No pending callback requests</p>
            </div>
          )}

          {!loading && callbacks.length > 0 && (
            <div className="grid gap-3">
              {callbacks.map((cb) => (
                <div key={cb.id} className="rounded-2xl border border-white/10 bg-[#0b1224]/80 p-5 hover:border-white/20 transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Name</p>
                      <p className="text-sm font-semibold text-white">{cb.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Email</p>
                      <p className="text-sm text-blue-400 break-all">{cb.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                      <p className="text-sm text-white">{cb.phone || '—'}</p>
                    </div>
                  </div>

                  <div className="mb-4 p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Message</p>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                      {cb.message || 'No message'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="text-xs text-gray-500 space-y-0.5">
                      <p>{new Date(cb.created_at).toLocaleDateString()} at {new Date(cb.created_at).toLocaleTimeString()}</p>
                      <p>Status: <span className="text-yellow-400 font-semibold">{cb.status}</span></p>
                    </div>
                    <button
                      onClick={() => handleResolve(cb.id)}
                      disabled={resolving === cb.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                      <CheckCircle size={15} />
                      {resolving === cb.id ? 'Resolving…' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {callbacks.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-[#0b1224]/50 px-5 py-4">
                <p className="text-xs text-gray-500 mb-1">Total Requests</p>
                <p className="text-2xl font-bold text-white">{callbacks.length}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0b1224]/50 px-5 py-4">
                <p className="text-xs text-gray-500 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {callbacks.filter((c) => c.status === 'pending').length}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ── Live Support Chat ── */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Live Support Chat</h2>
              <p className="text-gray-500 text-sm mt-0.5">
                {sortedConvos.length === 0
                  ? 'Waiting for customer messages…'
                  : `${sortedConvos.length} active conversation${sortedConvos.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  const newShow = !showResolved;
                  setShowResolved(newShow);
                  try {
                    const status = newShow ? 'resolved' : 'open';
                   
                    // Updated URL string using BASE_URL template literal
                    const url = `${BASE_URL}/api/v1/support/conversations?status=${status}`;
                   
                    const res = await axios.get(url, { withCredentials: true });
                    const list = res.data?.conversations || [];
                    const map: Record<string, Conversation> = {};
                    list.forEach((c: any) => {
                      map[c.ticket_id] = {
                        userId: String(c.user_id || ''),
                        displayName: c.from_name || `User ${c.user_id || ''}`,
                        messages: [],
                        lastTime: c.last_time || new Date().toISOString(),
                        unread: 0,
                        status: c.status || 'open',
                      };
                    });
                    setConversations(map);
                  } catch (e) {
                    console.error('failed to load conversations', e);
                  }
                }}
                className="px-3 py-1 rounded bg-gray-700 text-white text-xs"
              >
                {showResolved ? 'Show Active' : 'Show Resolved'}
              </button>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Listening for messages</span>
            </div>
          </div>

          <div
            className="rounded-2xl border border-white/10 bg-[#0b1224]/60 overflow-hidden"
            style={{ minHeight: '520px', display: 'grid', gridTemplateColumns: '280px 1fr' }}
          >
            {/* Sidebar */}
            <div className="border-r border-white/8 flex flex-col" style={{ background: 'rgba(5,8,22,0.6)' }}>
              <div className="px-4 py-3.5 border-b border-white/5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Conversations</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {sortedConvos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 px-4 py-10 text-center">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">💬</div>
                    <p className="text-gray-600 text-xs leading-relaxed">No active chats yet.<br />Customer messages will appear here.</p>
                  </div>
                ) : (
                  sortedConvos.map((convo) => {
                    const ticketId = Object.keys(conversations).find(k => conversations[k] === convo) || convo.userId;
                    const isActive = activeTicketId === ticketId;
                    const lastMsg = convo.messages[convo.messages.length - 1];
                    return (
                      <button
                        key={ticketId}
                        onClick={() => openConversation(ticketId)}
                        className="w-full text-left px-4 py-3.5 transition-all relative"
                        style={{
                          background: isActive ? 'rgba(255,77,109,0.08)' : 'transparent',
                          borderLeft: isActive ? '2px solid #ff4d6d' : '2px solid transparent',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                            style={{
                              background: isActive ? 'rgba(255,77,109,0.2)' : 'rgba(255,255,255,0.06)',
                              color: isActive ? '#ff4d6d' : '#888',
                            }}
                          >
                            {convo.displayName[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p className="text-sm font-semibold truncate" style={{ color: isActive ? '#fff' : '#ccc' }}>
                                {convo.displayName}
                              </p>
                              {convo.unread > 0 && (
                                <span className="w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 ml-1"
                                  style={{ background: '#ff4d6d', color: '#fff' }}>
                                  {convo.unread}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 truncate">{lastMsg?.text || '—'}</p>
                            <p className="text-[10px] text-gray-700 mt-0.5">
                              {lastMsg ? new Date(lastMsg.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat panel */}
            <div className="flex flex-col">
              {!activeConvo ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)' }}>
                    👆
                  </div>
                  <p className="text-gray-400 text-sm font-medium">Select a conversation</p>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    Pick a customer from the left panel<br />to read and reply to their messages.
                  </p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="px-5 py-3.5 flex items-center gap-3 shrink-0"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{ background: 'rgba(255,77,109,0.15)', color: '#ff4d6d' }}>
                      {activeConvo.displayName[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{activeConvo.displayName}</p>
                      <p className="text-[10px] text-gray-600">
                        {activeConvo.messages.length} message{activeConvo.messages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={async () => {
                          try {
                            if (!activeTicketId) return;
                           
                            // Updated URL string using BASE_URL template literal
                            await axios.post(`${BASE_URL}/api/v1/support/conversations/${activeTicketId}/resolve`, {}, { withCredentials: true });
                           
                            setConversations(prev => ({ ...prev, [activeTicketId]: { ...prev[activeTicketId], status: 'resolved' } }));
                          } catch (e) {
                            console.error('resolve failed', e);
                          }
                        }}
                        disabled={activeConvo?.status === 'resolved'}
                        className="px-3 py-1 rounded text-white text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: activeConvo?.status === 'resolved' ? '#6B7280' : '#16A34A',
                        }}
                      >
                        {activeConvo?.status === 'resolved' ? '✓ Resolved' : 'Mark Solved'}
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ minHeight: 0 }}>
                    {activeConvo.messages.map((m) => (
                      m.from === 'user' ? (
                        <div key={m.id} className="flex gap-3 items-end">
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mb-4"
                            style={{ background: 'rgba(255,255,255,0.06)', color: '#aaa' }}>
                            {m.fromName[0]?.toUpperCase()}
                          </div>
                          <div className="flex flex-col gap-1 max-w-[70%]">
                            {m.imageUrl && (
                              <img src={m.imageUrl} alt="shared" className="rounded-2xl rounded-bl-sm max-w-full h-auto max-h-64 object-cover" />
                            )}
                            <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm text-gray-200 leading-relaxed"
                              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                              {m.text}
                            </div>
                            <span className="text-[10px] text-gray-700 pl-1">
                              {m.fromName} · {new Date(m.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div key={m.id} className="flex gap-3 items-end justify-end">
                          <div className="flex flex-col items-end gap-1 max-w-[70%]">
                            {m.imageUrl && (
                              <img src={m.imageUrl} alt="shared" className="rounded-2xl rounded-br-sm max-w-full h-auto max-h-64 object-cover" />
                            )}
                            <div className="px-4 py-2.5 rounded-2xl rounded-br-sm text-sm text-white leading-relaxed"
                              style={{ background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)' }}>
                              {m.text}
                            </div>
                            <span className="text-[10px] text-gray-700 pr-1">
                              {m.fromName} · {new Date(m.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mb-4"
                            style={{ background: 'rgba(255,77,109,0.2)', color: '#ff4d6d' }}>
                            {(admin?.name || 'A')[0].toUpperCase()}
                          </div>
                        </div>
                      )
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Reply bar */}
                  <div className="px-4 py-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {activeConvo?.status === 'resolved' ? (
                      <div className="px-4 py-3 rounded-xl text-center text-sm text-gray-400"
                        style={{ background: 'rgba(107,183,24,0.08)', border: '1px solid rgba(107,183,24,0.2)' }}>
                        ✓ This conversation is resolved
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendReply()}
                          placeholder={`Reply to ${activeConvo.displayName}…`}
                          disabled={sending}
                          className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-all disabled:opacity-50"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,77,109,0.4)')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
                        />
                        <button
                          onClick={sendReply}
                          disabled={sending || !replyText.trim()}
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-40"
                          style={{ background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)' }}
                        >
                          {sending ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-700 mt-2 text-right">
                      {activeConvo?.status === 'resolved' ? 'Conversation closed' : 'Press Enter to send'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
