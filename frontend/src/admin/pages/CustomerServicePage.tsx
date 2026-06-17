import { useState, useEffect } from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';
import { useAdminCallbackStore } from '../store/adminCallbackStore';
import AdminTopbar from '../components/AdminTopbar';
import { useAdminAuthStore } from '../store/adminAuthStore';
import { useState as useStateLocal } from 'react';
import axios from 'axios';
 
export default function CustomerServicePage() {
  const { callbacks, fetchPendingCallbacks, updateCallbackStatus, loading } = useAdminCallbackStore();
  const [resolving, setResolving] = useState<number | null>(null);
  const admin = useAdminAuthStore((s) => s.admin);

  // live chat state
  const [chats, setChats] = useStateLocal<Array<{ userId: string; from: string; text: string; time?: string }>>([]);
  const [replyText, setReplyText] = useStateLocal('');
  const [selectedUser, setSelectedUser] = useStateLocal<string | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const p = e.detail as any;
      setChats((s) => [{ userId: p.from_user_id, from: p.from_name || `User ${p.from_user_id}`, text: p.text, time: p.time }, ...s]);
    };
    window.addEventListener('support:message', handler as EventListener);
    return () => window.removeEventListener('support:message', handler as EventListener);
  }, []);

  const sendReply = async () => {
    if (!selectedUser || !replyText.trim()) return;
    try {
      await axios.post('http://localhost:8000/api/v1/support/admin/send', { user_id: selectedUser, text: replyText }, { withCredentials: true });
      setChats(s => [{ userId: selectedUser as string, from: admin?.name || 'Admin', text: replyText, time: new Date().toISOString() }, ...s]);
      setReplyText('');
    } catch (err) {
      console.error(err);
    }
  };
 
  useEffect(() => {
    fetchPendingCallbacks();
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchPendingCallbacks();
    }, 30000);
    return () => clearInterval(interval);
  }, []);
 
  const handleResolve = async (id: number) => {
    setResolving(id);
    await updateCallbackStatus(id, 'resolved');
    setResolving(null);
  };
 
  return (
    <div className="min-h-screen bg-[#050816]">
      <AdminTopbar title="Customer Service" />
     
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Callback Requests</h2>
          <p className="text-gray-400">Manage and resolve customer callback requests</p>
        </div>
 
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4D8D]"></div>
              <p className="text-gray-400 mt-4">Loading callbacks...</p>
            </div>
          </div>
        )}
 
        {!loading && callbacks.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#0b1224]/50 p-12 text-center">
            <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
            <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
            <p className="text-gray-400">No pending callback requests at the moment</p>
          </div>
        )}
 
        {!loading && callbacks.length > 0 && (
          <div className="grid gap-4">
            {callbacks.map((callback) => (
              <div
                key={callback.id}
                className="rounded-2xl border border-white/10 bg-[#0b1224]/80 p-6 hover:border-white/20 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {/* User Name */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="text-lg font-semibold text-white">{callback.name}</p>
                  </div>
 
                  {/* Email */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-blue-400 break-all">{callback.email}</p>
                  </div>
 
                  {/* Phone */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="text-sm text-white">{callback.phone || 'Not provided'}</p>
                  </div>
                </div>
 
                {/* Issue/Message */}
                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-sm text-gray-500 mb-2">Issue/Message</p>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">
                    {callback.message || 'No additional message'}
                  </p>
                </div>
 
                {/* Timestamp and Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-xs text-gray-500">
                    <p>
                      Requested: {new Date(callback.created_at).toLocaleDateString()} at{' '}
                      {new Date(callback.created_at).toLocaleTimeString()}
                    </p>
                    <p className="mt-1">
                      Status: <span className="text-yellow-400 font-semibold">{callback.status}</span>
                    </p>
                  </div>
 
                  {/* Actions */}
                  <button
                    onClick={() => handleResolve(callback.id)}
                    disabled={resolving === callback.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50 whitespace-nowrap"
                  >
                    <CheckCircle size={18} />
                    {resolving === callback.id ? 'Resolving...' : 'Mark Resolved'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
 
        {/* Live chat area */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0b1224]/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Live Support Chat</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <div className="space-y-2">
                {chats.map((c, i) => (
                  <button key={i} onClick={() => setSelectedUser(c.userId)} className="w-full text-left p-3 rounded-xl bg-white/3">{c.from} — {c.text}</button>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              {selectedUser ? (
                <div>
                  <div className="h-48 overflow-y-auto p-3 space-y-2 bg-white/2 rounded">
                    {chats.filter(ch => ch.userId === selectedUser).map((m, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="text-xs text-gray-400">{m.from} • {new Date(m.time || '').toLocaleString()}</div>
                        <div className="text-sm text-white">{m.text}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <input value={replyText} onChange={e => setReplyText(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-white/5" />
                    <button onClick={sendReply} className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">Send</button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">Select a conversation to view and reply.</div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        {callbacks.length > 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#0b1224]/50 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Requests</p>
                <p className="text-2xl font-bold text-white">{callbacks.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {callbacks.filter((c) => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 
 