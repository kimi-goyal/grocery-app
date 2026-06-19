
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';
import { privateApi } from '../../services/api';
import { BotBubble, MenuTile, ActionTile } from './SupportBotUI';
// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
    | 'home'
    | 'my_orders'
    | 'order_detail'
    | 'order_issue'
    | 'missing_item'
    | 'cancel_order'
    | 'coupon_issue'
    | 'coupon_validate'
    | 'delivery_info'
    | 'refund_status'
    | 'success'
    | 'escalate';

interface BotMessage {
    id: string;
    type: 'bot' | 'user' | 'system';
    text: string;
    time: string;
    imageUrl?: string;
}

interface OrderSummary {
    id: string;
    order_number: string;
    status: string;
    total_amount: number;
    items_count: number;
    created_at: string;
    items_preview: { name: string; image_url: string | null }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

const STATUS_EMOJI: Record<string, string> = {
    'Pending': '🕐',
    'Packed': '📦',
    'On the Way': '🚀',
    'Delivered': '✅',
    'Cancelled': '❌',
};

const STATUS_COLOR: Record<string, string> = {
    'Pending': '#eab308',
    'Packed': '#3b82f6',
    'On the Way': '#ff4d6d',
    'Delivered': '#22c55e',
    'Cancelled': '#ef4444',
};

const STATUS_MSG: Record<string, string> = {
    'Pending': 'Your order has been placed and is being confirmed.',
    'Packed': 'Great news! Your order is packed and waiting for a delivery partner.',
    'On the Way': 'Your delivery partner has picked up your order and is on the way! 🚀',
    'Delivered': 'Your order was delivered. Enjoy your groceries! 🎉',
    'Cancelled': 'This order was cancelled. If you were charged, a refund is on the way.',
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SupportBot() {
    const [open, setOpen] = useState(false);
    const [screen, setScreen] = useState<Screen>('home');
    const [messages, setMessages] = useState<BotMessage[]>([]);
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(0);
    const [couponInput, setCouponInput] = useState('');
    const [couponResult, setCouponResult] = useState<{ valid: boolean; message: string } | null>(null);
    const [successMsg, setSuccessMsg] = useState('');
    // (refund info not used in UI currently)

    const bottomRef = useRef<HTMLDivElement>(null);
    const chatBottomRef = useRef<HTMLDivElement>(null);


    const { isAuthenticated, user } = useAuthStore();
    const orderStore = useOrderStore.getState();

    // Scroll to bottom on new messages
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, screen]);

    // Reset unread on open
    useEffect(() => {
        if (open) setUnread(0);
        else if (screen !== 'home') {
            // Reset to home when closed
            setTimeout(() => { setScreen('home'); setMessages([]); setSelectedOrder(null); }, 300);
        }
    }, [open]);

    // ── Fetch user orders ──────────────────────────────────────────────────────

    const fetchOrders = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            // Use centralized order store so auth/refresh flows are consistent
            await orderStore.fetchOrders();
            setOrders(orderStore.orders || []);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // ── Navigate between screens ───────────────────────────────────────────────

    const go = (s: Screen) => setScreen(s);

    const goOrders = () => {
        go('my_orders');
        fetchOrders();
    };

    const selectOrder = (order: OrderSummary) => {
        setSelectedOrder(order);
        go('order_detail');
    };

    // ── Actions that call backend ──────────────────────────────────────────────

    const handleCancelOrder = async () => {
        if (!selectedOrder) return;
        if (selectedOrder.status !== 'Pending') {
            setSuccessMsg(`Sorry, we can't cancel an order that is already "${selectedOrder.status}". Please contact support.`);
            go('success');
            return;
        }
        setLoading(true);
        try {
            await privateApi.patch(`/orders/my/${selectedOrder.id}/status`, { status: 'Cancelled' });
            setSuccessMsg(`Order ${selectedOrder.order_number} has been cancelled. If you paid online, your refund will be processed in 5–7 business days.`);
            go('success');
        } catch {
            setSuccessMsg('We could not cancel your order right now. Please try again or contact support.');
            go('success');
        } finally {
            setLoading(false);
        }
    };

    const handleMissingItem = async () => {
        if (!selectedOrder) return;
        setLoading(true);
        try {
            // POST to your refund/ticket endpoint
            await privateApi.post('/support/ticket', {
                order_id: selectedOrder.id,
                type: 'missing_item',
                message: 'Customer reported missing item.',
            });
            // refund info recorded server-side; UI shows success message instead
            go('success');
            setSuccessMsg(`We're sorry about that! A refund of ₹${selectedOrder.total_amount} will be initiated to your ${selectedOrder.status === 'Delivered' ? 'original payment method' : 'wallet'} within 24 hours.`);
        } catch {
            setSuccessMsg('Your complaint has been noted. Our team will contact you within 2 hours.');
            go('success');
        } finally {
            setLoading(false);
        }
    };

    const handleValidateCoupon = async () => {
        if (!couponInput.trim()) return;
        setLoading(true);
        try {
            const res = await privateApi.post('/coupons/validate', {
                code: couponInput.toUpperCase().trim(),
                order_amount: 500, // placeholder — in real use, pass cart total
            });
            setCouponResult({ valid: res.data.valid, message: res.data.message });
        } catch {
            setCouponResult({ valid: false, message: 'Could not validate coupon right now.' });
        } finally {
            setLoading(false);
        }
    };



    const [chatMessages, setChatMessages] = useState<BotMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [chatConnected, setChatConnected] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [chatTicketId, setChatTicketId] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [historyTickets, setHistoryTickets] = useState<any[]>([]);
    const [chatTicketStatus, setChatTicketStatus] = useState<'open' | 'resolved'>('open');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = (e: CustomEvent) => {
            const payload = e.detail as any;
            setChatMessages(s => [...s, {
                id: `s-${Date.now()}`,
                type: 'bot',
                text: payload.text || 'Message from support',
                time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                imageUrl: payload.image_url || undefined,
            }]);
            if (!open) setUnread(u => u + 1);
        };
        window.addEventListener('support:message', handler as EventListener);
        return () => window.removeEventListener('support:message', handler as EventListener);
    }, [open]);

    useEffect(() => {
        if (screen === 'escalate' && !chatConnected) autoConnect();
    }, [screen]);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const autoConnect = async () => {
        if (chatConnected) return;
        setChatLoading(true);
        try {
            const res = await privateApi.post('/support/message', { text: '__connect__', type: 'connect' });
            if (res.data?.ticket_id) {
                setChatTicketId(res.data.ticket_id);
            }
            setChatTicketStatus('open');
            setChatConnected(true);
            setChatMessages(prev => [...prev, {
                id: `sys-${Date.now()}`,
                type: 'bot' as const,
                text: res.data?.admin_online
                    ? 'Connected! An agent is online — say hi 👋'
                    : "All agents are offline. Leave a message and we'll reply within a few hours.",
                time: now(),
            }]);
        } catch {
            setChatMessages(prev => [...prev, {
                id: `err-${Date.now()}`,
                type: 'bot' as const,
                text: 'Could not reach support. Check your connection.',
                time: now(),
            }]);
        } finally {
            setChatLoading(false);
        }
    };

    const loadMyHistory = async () => {
        try {
            const res = await privateApi.get('/support/mine');
            setHistoryTickets(res.data?.conversations || []);
            setShowHistory(true);
        } catch (e) {
            console.error('failed to load history', e);
        }
    };

    const openHistoryTicket = async (ticketId: string) => {
        try {
            const res = await privateApi.get(`/support/conversations/${ticketId}`);
            const msgs = res.data?.messages || [];
            const mapped: BotMessage[] = msgs.map((m: any, i: number) => ({ 
                id: m.message_id || `h-${i}`, 
                type: m.from_role === 'admin' ? 'bot' : 'user', 
                text: m.text, 
                time: m.time || now(),
                imageUrl: m.image_url || undefined,
            }));
            setChatMessages(mapped);
            setChatTicketId(ticketId);
            setChatTicketStatus(res.data?.status || 'open');
            setShowHistory(false);
            setChatConnected(true);
        } catch (e) {
            console.error('failed to open ticket', e);
        }
    };

    const sendChatMessage = async () => {
        const text = chatInput.trim();
        if (!text && !selectedImage) return;
        
        if (chatTicketStatus === 'resolved') {
            setChatMessages(s => [...s, {
                id: `err-${Date.now()}`, type: 'bot',
                text: 'This conversation is resolved. You cannot send messages.', time: now(),
            }]);
            return;
        }

        // Add optimistic user message
        if (text) {
            setChatMessages(s => [...s, { id: `u-${Date.now()}`, type: 'user', text, time: now() }]);
        }
        setChatInput('');
        
        try {
            let imageUrl:any = undefined;
            
            // Upload image if selected
            if (selectedImage) {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', selectedImage);
                const uploadRes = await privateApi.post('/support/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadRes.data?.image_url;
                setSelectedImage(null);
                setUploading(false);
                
                // Add image message if no text
                if (!text) {
                    setChatMessages(s => [...s, { id: `u-${Date.now()}`, type: 'user', text: '[Image sent]', time: now(), imageUrl }]);
                }
            }
            
            await privateApi.post('/support/message', { 
                text: text || '[Image sent]', 
                type: 'message', 
                ticket_id: chatTicketId,
                image_url: imageUrl,
            });
        } catch (err: any) {
            console.error('[chat send]', err);
            if (err.response?.status === 400 && err.response?.data?.detail?.includes('resolved')) {
                setChatMessages(s => [...s, {
                    id: `err-${Date.now()}`, type: 'bot',
                    text: 'This conversation is resolved. You cannot send messages.', time: now(),
                }]);
                setChatTicketStatus('resolved');
            } else {
                setChatMessages(s => [...s, {
                    id: `err-${Date.now()}`, type: 'bot',
                    text: 'Message failed to send. Try again.', time: now(),
                }]);
            }
        }
    };


    // ─── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen(v => !v)}
                className="fixed bottom-24 right-5 sm:bottom-6 sm:right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95"
                style={{
                    background: 'linear-gradient(135deg, #ff4d6d, #e63c5a)',
                    boxShadow: '0 8px 30px rgba(255,77,109,0.45)',
                }}
            >
                {open ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                )}
                {unread > 0 && !open && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full text-[10px] font-black text-[#ff4d6d] flex items-center justify-center">
                        {unread}
                    </span>
                )}
            </button>

            {/* Chat window */}
            {open && (
                <div
                    className="fixed bottom-44 right-5 sm:bottom-24 sm:right-6 z-50 w-[340px] sm:w-[370px] flex flex-col rounded-3xl shadow-2xl overflow-hidden"
                    style={{
                        background: 'rgba(7,12,24,0.97)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(30px)',
                        maxHeight: '70vh',
                        animation: 'botSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards',
                    }}
                >
                    {/* ── Header ── */}
                    <div
                        className="px-4 py-3.5 flex items-center gap-3 shrink-0"
                        style={{ background: 'linear-gradient(135deg, rgba(255,77,109,0.15), rgba(255,77,109,0.05))', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <div className="w-9 h-9 rounded-xl bg-[#ff4d6d]/20 border border-[#ff4d6d]/30 flex items-center justify-center text-lg shrink-0">
                            🛒
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-sm" style={{ fontFamily: 'Sora,sans-serif' }}>FreshCart Support</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-green-400 text-[10px] font-medium">Always online</span>
                            </div>
                        </div>
                        {screen !== 'home' && (
                            <button
                                onClick={() => { go('home'); setSelectedOrder(null); setCouponResult(null); setCouponInput(''); }}
                                className="text-gray-500 hover:text-white transition-colors p-1"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 5l-7 7 7 7" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* ── Body ── */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">

                        {/* ════════════════════ HOME SCREEN ════════════════════ */}
                        {screen === 'home' && (
                            <>
                                <BotBubble>
                                    {isAuthenticated
                                        ? `Hi ${user?.name?.split(' ')[0] || 'there'} 👋 How can I help you today?`
                                        : 'Hi there 👋 How can I help you today?'}
                                </BotBubble>

                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <MenuTile icon="📦" label="My Orders" onClick={goOrders} />
                                    <MenuTile icon="🔖" label="Coupon Issue" onClick={() => go('coupon_issue')} />
                                    <MenuTile icon="🚀" label="Delivery Info" onClick={() => go('delivery_info')} />
                                    <MenuTile icon="💬" label="Talk to Us" onClick={() => { setChatTicketId(null); setChatMessages([]); setChatConnected(false); go('escalate'); }} />
                                </div>
                            </>
                        )}

                        {/* ════════════════════ MY ORDERS ════════════════════ */}
                        {screen === 'my_orders' && (
                            <>
                                <BotBubble>Here are your recent orders. Tap one to manage it.</BotBubble>

                                {!isAuthenticated && (
                                    <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)' }}>
                                        <p className="text-gray-300 text-sm mb-3">Please login to see your orders.</p>
                                        <a href="/auth" className="text-[#ff4d6d] text-sm font-bold underline">Login →</a>
                                    </div>
                                )}

                                {isAuthenticated && loading && (
                                    <div className="flex justify-center py-6">
                                        <svg className="w-6 h-6 animate-spin text-[#ff4d6d]" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    </div>
                                )}

                                {isAuthenticated && !loading && orders.length === 0 && (
                                    <BotBubble>You don't have any orders yet. Start shopping! 🛍️</BotBubble>
                                )}

                                {isAuthenticated && !loading && orders.map(order => (
                                    <button
                                        key={order.id}
                                        onClick={() => selectOrder(order)}
                                        className="w-full text-left rounded-2xl p-3.5 transition-all hover:border-[#ff4d6d]/30 active:scale-[0.98]"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[#ff4d6d] text-xs font-bold font-mono">{order.order_number}</span>
                                            <span
                                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                                style={{
                                                    background: `${STATUS_COLOR[order.status]}18`,
                                                    border: `1px solid ${STATUS_COLOR[order.status]}35`,
                                                    color: STATUS_COLOR[order.status],
                                                }}
                                            >
                                                {STATUS_EMOJI[order.status]} {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-1.5">
                                                {order.items_preview?.slice(0, 3).map((item, i) => (
                                                    <div key={i} className="w-7 h-7 rounded-lg overflow-hidden bg-white/8 border border-white/10">
                                                        {item.image_url && (
                                                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-xs font-medium truncate">
                                                    {order.items_preview?.[0]?.name}
                                                    {order.items_count > 1 ? ` +${order.items_count - 1} more` : ''}
                                                </p>
                                                <p className="text-gray-500 text-[10px]">₹{order.total_amount} · {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                            </div>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </>
                        )}

                        {/* ════════════════════ ORDER DETAIL ════════════════════ */}
                        {screen === 'order_detail' && selectedOrder && (
                            <>
                                <BotBubble>
                                    {`Order ${selectedOrder.order_number} is currently `}
                                    <span style={{ color: STATUS_COLOR[selectedOrder.status], fontWeight: 700 }}>
                                        {selectedOrder.status}
                                    </span>
                                    {`. ${STATUS_MSG[selectedOrder.status]} What do you need help with?`}
                                </BotBubble>

                                <div className="space-y-2">
                                    <ActionTile
                                        icon="📍"
                                        label="Track this order"
                                        sub="See live delivery status"
                                        onClick={() => window.location.href = '/orders'}
                                    />
                                    {(selectedOrder.status === 'Delivered') && (
                                        <ActionTile
                                            icon="📦"
                                            label="Item missing or wrong"
                                            sub="Get instant refund"
                                            onClick={() => go('missing_item')}
                                            accent
                                        />
                                    )}
                                    {(selectedOrder.status === 'Pending') && (
                                        <ActionTile
                                            icon="❌"
                                            label="Cancel this order"
                                            sub="Only possible before packing"
                                            onClick={() => go('cancel_order')}
                                            danger
                                        />
                                    )}
                                    {(selectedOrder.status === 'Delivered') && (
                                        <ActionTile
                                            icon="⭐"
                                            label="Rate this order"
                                            sub="Share your feedback"
                                            onClick={() => window.location.href = '/orders'}
                                        />
                                    )}
                                    <ActionTile
                                        icon="💬"
                                        label="Other issue"
                                        sub="Talk to our team"
                                        onClick={() => go('escalate')}
                                    />
                                </div>
                            </>
                        )}

                        {/* ════════════════════ MISSING ITEM ════════════════════ */}
                        {screen === 'missing_item' && selectedOrder && (
                            <>
                                <BotBubble>
                                    We're really sorry about that! 😔 We take missing items very seriously.
                                </BotBubble>
                                <BotBubble delay={400}>
                                    For order <strong style={{ color: '#ff4d6d' }}>{selectedOrder.order_number}</strong> we will initiate a full refund of <strong style={{ color: '#22c55e' }}>₹{selectedOrder.total_amount}</strong> to your original payment method within 24 hours.
                                </BotBubble>
                                <BotBubble delay={800}>
                                    Tap below to confirm and we'll process it right away.
                                </BotBubble>

                                <div className="flex gap-2 pt-1">
                                    <button
                                        onClick={handleMissingItem}
                                        disabled={loading}
                                        className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                                        style={{ background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)', fontFamily: 'Sora,sans-serif' }}
                                    >
                                        {loading ? '...' : '✓ Yes, item was missing'}
                                    </button>
                                    <button
                                        onClick={() => go('order_detail')}
                                        className="px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 transition-all"
                                    >
                                        Back
                                    </button>
                                </div>
                            </>
                        )}

                        {/* ════════════════════ CANCEL ORDER ════════════════════ */}
                        {/* ════════════════════ CANCEL ORDER ════════════════════ */}
                        {screen === 'cancel_order' && selectedOrder && (
                            <>
                                <BotBubble>
                                    Are you sure you want to cancel order{' '}
                                    <strong style={{ color: '#ff4d6d' }}>
                                        {selectedOrder.order_number}
                                    </strong>
                                    ?
                                </BotBubble>

                                <BotBubble delay={300}>
                                    {selectedOrder.status === 'Pending'
                                        ? "Your order can still be cancelled. If you paid online, you'll get a full refund in 5–7 business days."
                                        : `Sorry, this order is already "${selectedOrder.status}" and cannot be cancelled.`}
                                </BotBubble>

                                {selectedOrder.status === 'Pending' && (
                                    <div className="flex gap-2 pt-1">
                                        <button
                                            onClick={handleCancelOrder}
                                            disabled={loading}
                                            className="flex-1 py-3 rounded-xl text-sm font-bold text-red-400 border border-red-500/30 bg-red-500/8 hover:bg-red-500/15 transition-all disabled:opacity-50"
                                            style={{ fontFamily: 'Sora,sans-serif' }}
                                        >
                                            {loading ? '...' : 'Yes, cancel order'}
                                        </button>

                                        <button
                                            onClick={() => go('order_detail')}
                                            className="px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 transition-all"
                                        >
                                            Keep it
                                        </button>
                                    </div>
                                )}

                                {selectedOrder.status !== 'Pending' && (
                                    <ActionTile
                                        icon="💬"
                                        label="Talk to support"
                                        sub="We'll see what we can do"
                                        onClick={() => go('escalate')}
                                    />
                                )}
                            </>
                        )}

                        {/* ════════════════════ COUPON ISSUE ════════════════════ */}
                        {screen === 'coupon_issue' && (
                            <>
                                <BotBubble>What's the issue with your coupon?</BotBubble>
                                <div className="space-y-2">
                                    <ActionTile icon="✅" label="Check if coupon is valid" sub="Validate a code right now" onClick={() => go('coupon_validate')} />
                                    <ActionTile icon="📋" label="View my coupons" sub="See all available offers" onClick={() => window.location.href = '/coupons'} />
                                    <ActionTile icon="💬" label="Coupon didn't apply at checkout" sub="Talk to our team" onClick={() => go('escalate')} />
                                </div>
                            </>
                        )}

                        {/* ════════════════════ COUPON VALIDATE ════════════════════ */}
                        {screen === 'coupon_validate' && (
                            <>
                                <BotBubble>Enter the coupon code you want to check:</BotBubble>

                                <div className="flex gap-2">
                                    <input
                                        value={couponInput}
                                        onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponResult(null); }}
                                        onKeyDown={e => e.key === 'Enter' && handleValidateCoupon()}
                                        placeholder="e.g. FLAT50"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff4d6d]/40 tracking-widest font-mono uppercase"
                                    />
                                    <button
                                        onClick={handleValidateCoupon}
                                        disabled={loading || !couponInput.trim()}
                                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-white disabled:opacity-40 transition-all"
                                        style={{ background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)', fontFamily: 'Sora,sans-serif' }}
                                    >
                                        {loading ? '...' : 'Check'}
                                    </button>
                                </div>

                                {couponResult && (
                                    <div
                                        className="rounded-xl p-3 flex items-start gap-2"
                                        style={{
                                            background: couponResult.valid ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                                            border: couponResult.valid ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(239,68,68,0.25)',
                                        }}
                                    >
                                        <span>{couponResult.valid ? '✅' : '❌'}</span>
                                        <p style={{ color: couponResult.valid ? '#22c55e' : '#f87171', fontSize: 13 }}>
                                            {couponResult.message}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ════════════════════ DELIVERY INFO ════════════════════ */}
                        {screen === 'delivery_info' && (
                            <>
                                <BotBubble>Here's everything about FreshCart delivery 🚀</BotBubble>
                                <div className="space-y-2">
                                    {[
                                        { q: '⚡ How fast is delivery?', a: 'We deliver in 10 minutes. No kidding.' },
                                        { q: '💰 What is the delivery fee?', a: 'FREE on orders above ₹299. ₹20 below that.' },
                                        { q: '🕐 What are delivery hours?', a: 'We deliver from 6 AM to midnight, every day.' },
                                        { q: '📍 Where do you deliver?', a: 'Currently serving select areas in Mumbai. Check the app for your pincode.' },
                                        { q: '🌧️ What about bad weather?', a: 'We try our best! Delays are rare but possible. We\'ll notify you if there\'s a delay.' },
                                    ].map(faq => (
                                        <div
                                            key={faq.q}
                                            className="rounded-xl p-3"
                                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                                        >
                                            <p className="text-white text-xs font-semibold mb-1" style={{ fontFamily: 'Sora,sans-serif' }}>{faq.q}</p>
                                            <p className="text-gray-400 text-xs leading-relaxed">{faq.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* ════════════════════ SUCCESS ════════════════════ */}
                        {screen === 'success' && (
                            <>
                                <div className="flex flex-col items-center py-6 gap-3 text-center">
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                                        style={{ background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.35)', boxShadow: '0 0 30px rgba(34,197,94,0.15)' }}
                                    >
                                        ✓
                                    </div>
                                    <p className="text-white font-bold text-base" style={{ fontFamily: 'Sora,sans-serif' }}>Done!</p>
                                    <p className="text-gray-400 text-sm leading-relaxed px-2">{successMsg}</p>
                                </div>
                                <button
                                    onClick={() => { go('home'); setSelectedOrder(null); setSuccessMsg(''); }}
                                    className="w-full py-3 rounded-xl text-sm font-semibold border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Back to Help Menu
                                </button>
                            </>
                        )}


                        {/* ════════════════════ ESCALATE ════════════════════ */}
                       
{/* ════════════════════ ESCALATE ════════════════════ */}
{screen === 'escalate' && (
  <div className="flex flex-col gap-0">
    {/* Status bar */}
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
      style={{
        background: chatConnected ? 'rgba(34,197,94,0.08)' : 'rgba(234,179,8,0.08)',
        border: `1px solid ${chatConnected ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)'}`,
      }}
    >
      {chatLoading ? (
        <svg className="w-3.5 h-3.5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <span className="w-2 h-2 rounded-full shrink-0" style={{
          background: chatConnected ? '#22c55e' : '#eab308',
          boxShadow: chatConnected ? '0 0 6px #22c55e' : '0 0 6px #eab308',
        }} />
      )}
      <p className="text-xs font-medium" style={{ color: chatConnected ? '#4ade80' : '#fde047' }}>
        {chatLoading
          ? 'Connecting to support...'
          : chatConnected
          ? 'Support connected · avg. reply < 5 min'
          : 'Agents offline · leave a message'}
      </p>
    </div>

    {/* Messages */}
    <div
      className="overflow-y-auto scrollbar-hide space-y-3 pr-1"
      style={{ height: '320px' }}
    >
            <div className="flex justify-end mb-2">
                <button onClick={loadMyHistory} className="text-xs text-[#ff4d6d] underline">View chat history</button>
            </div>
      {chatMessages.length === 0 && !chatLoading && (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 flex items-center justify-center text-xl">
            💬
          </div>
          <p className="text-gray-500 text-xs text-center">
            Your chat with our support team<br />will appear here
          </p>
        </div>
      )}

      {chatMessages.map(m => (
        m.type === 'user' ? (
          <div key={m.id} className="flex justify-end gap-2 items-end">
            <div className="flex flex-col items-end gap-1 max-w-[78%]">
              {m.imageUrl && (
                <img src={m.imageUrl} alt="shared" className="rounded-2xl rounded-br-sm max-w-full h-auto max-h-64 object-cover" />
              )}
              <div className="px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm text-white leading-relaxed"
                style={{ background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)' }}>
                {m.text}
              </div>
              <span className="text-[10px] text-gray-600 pr-1">{m.time}</span>
            </div>
            <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs shrink-0 mb-4">
              {(user?.name || 'U')[0].toUpperCase()}
            </div>
          </div>
        ) : (
          <div key={m.id} className="flex gap-2 items-end">
            <div className="w-7 h-7 rounded-xl bg-[#ff4d6d]/15 border border-[#ff4d6d]/25 flex items-center justify-center text-sm shrink-0 mb-4">
              🛒
            </div>
            <div className="flex flex-col gap-1 max-w-[78%]">
              {m.imageUrl && (
                <img src={m.imageUrl} alt="shared" className="rounded-2xl rounded-bl-sm max-w-full h-auto max-h-64 object-cover" />
              )}
              <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm text-sm text-gray-200 leading-relaxed"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {m.text}
              </div>
              <span className="text-[10px] text-gray-600 pl-1">{m.time}</span>
            </div>
          </div>
        )
      ))}
      <div ref={chatBottomRef} />
    </div>

        {/* History Modal */}
        {showHistory && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60">
                <div className="bg-white rounded-xl p-4 w-[320px] max-h-[60vh] overflow-y-auto">
                    <h3 className="font-semibold mb-2">Your support conversations</h3>
                    {historyTickets.length === 0 && <p className="text-sm text-gray-600">No past conversations.</p>}
                    {historyTickets.map(t => (
                        <button key={t.ticket_id} className="w-full text-left p-2 rounded hover:bg-gray-100" onClick={() => openHistoryTicket(t.ticket_id)}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold">{t.from_name || 'Support'}</div>
                                    <div className="text-xs text-gray-500">{t.last_time ? new Date(t.last_time).toLocaleString() : ''}</div>
                                </div>
                                <div className="text-xs text-gray-500">{t.status}</div>
                            </div>
                        </button>
                    ))}
                    <div className="mt-3 text-right">
                        <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setShowHistory(false)}>Close</button>
                    </div>
                </div>
            </div>
        )}

    {/* Input */}
    {chatTicketStatus === 'resolved' ? (
      <div className="mt-3 px-3.5 py-2.5 rounded-xl text-center text-sm text-gray-400"
        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
        ✓ This conversation is resolved
      </div>
    ) : (
      <div className="mt-3 flex flex-col gap-2">
        {selectedImage && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-300"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            📎 {selectedImage.name}
            <button onClick={() => setSelectedImage(null)} className="ml-auto text-gray-500 hover:text-gray-300">✕</button>
          </div>
        )}
        <div className="flex items-center gap-2 pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <input type="file" ref={imageInputRef} hidden accept="image/*" onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
          <button
            onClick={() => imageInputRef.current?.click()}
            disabled={uploading}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.08)' }}
            title="Upload image"
          >
            📷
          </button>
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
            placeholder="Type a message..."
            disabled={chatLoading || uploading}
            className="flex-1 px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none disabled:opacity-40"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(255,77,109,0.4)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
          <button
            onClick={sendChatMessage}
            disabled={chatLoading || uploading || (!chatInput.trim() && !selectedImage)}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 active:scale-95 disabled:opacity-40 transition-all"
            style={{ background: 'linear-gradient(135deg,#ff4d6d,#e63c5a)' }}
          >
            {uploading ? (
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
      </div>
    )}

    <p className="text-center text-gray-700 text-[10px] pt-2.5">
      Support hours: 9 AM – 10 PM, 7 days a week
    </p>
  </div>
)}



                        <div ref={bottomRef} />
                    </div>

                    {/* ── Footer ── */}
                    <div
                        className="px-4 py-2.5 text-center shrink-0"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <p className="text-gray-700 text-[10px]">
                            Powered by <span className="text-[#ff4d6d]/60 font-semibold">FreshCart Support</span>
                        </p>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes botSlideUp {
          from { opacity:0; transform:translateY(16px) scale(0.97); }
          to { opacity:1; transform:translateY(0) scale(1); }
        }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>

        </>
    )
}