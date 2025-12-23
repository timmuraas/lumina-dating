'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Heart, Gift, MoreVertical, CheckCheck, Plus, Coffee, Wine, Film, Moon } from 'lucide-react';
import { Profile } from '@/types';
import { cn } from '@/lib/utils';
import { useChat } from '../hooks/useChat';
import { DateInviteBubble } from './DateInviteBubble';
import { useUserStore } from '@/store/useUserStore';
import { CreditsModal } from '@/features/wallet/components/CreditsModal';
import { Coins } from 'lucide-react';
import { translations } from '@/lib/translations';

interface ChatRoomProps {
    profile: Profile;
    onBack: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ profile, onBack }) => {
    const { messages, sendMessage, sendInvite, sendGift, isTyping } = useChat(profile.id);
    const { credits, spendCredits, language } = useUserStore();
    const t = translations[language];
    const [inputValue, setInputValue] = useState('');
    const [showInviteMenu, setShowInviteMenu] = useState(false);
    const [showGiftMenu, setShowGiftMenu] = useState(false);
    const [showCreditsModal, setShowCreditsModal] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const gifts = [
        { id: 'rose', emoji: '🌹', name: 'Rose', cost: 10 },
        { id: 'bear', emoji: '🧸', name: 'Teddy', cost: 50 },
        { id: 'diamond', emoji: '💎', name: 'Diamond', cost: 100 }
    ];

    const handleSendGift = (gift: typeof gifts[0]) => {
        if (spendCredits(gift.cost)) {
            sendGift(gift.name, gift.emoji);
            setShowGiftMenu(false);
        } else {
            setShowGiftMenu(false);
            setShowCreditsModal(true);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    const handleInviteSelect = (type: 'coffee' | 'drinks' | 'cinema' | 'walk') => {
        sendInvite(type);
        setShowInviteMenu(false);
    };

    const inviteOptions = [
        { type: 'coffee' as const, icon: Coffee, label: 'Coffee', color: 'bg-orange-500' },
        { type: 'drinks' as const, icon: Wine, label: 'Drinks', color: 'bg-purple-500' },
        { type: 'cinema' as const, icon: Film, label: 'Cinema', color: 'bg-blue-500' },
        { type: 'walk' as const, icon: Moon, label: 'Walk', color: 'bg-slate-700' }
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Premium Header */}
            <header className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-primary transition-all active:scale-90">
                        <ArrowLeft className={cn("w-5 h-5", language === 'ar' && "rotate-180")} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-3xl overflow-hidden ring-2 ring-primary/20">
                                <img src={profile.images[0]} alt={profile.name} className="w-full h-full object-cover" />
                            </div>
                            <div className={cn("absolute -bottom-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full", language === 'ar' ? "-left-0.5" : "-right-0.5")} />
                        </div>
                        <div className={cn(language === 'ar' ? "text-right" : "text-left")}>
                            <h3 className="font-black text-slate-900 dark:text-white leading-none uppercase italic tracking-tighter">{profile.name}</h3>
                            <span className="text-[9px] text-green-500 font-bold uppercase tracking-[0.2em] mt-1 block">{t.active_now}</span>
                        </div>
                    </div>
                </div>
                <button className="p-2.5 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </header>

            {/* Messages Content */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
                <div className="flex flex-col items-center justify-center py-10 opacity-30">
                    <div className="w-20 h-20 rounded-[3rem] overflow-hidden mb-4 border-4 border-primary/20">
                        <img src={profile.images[0]} alt={profile.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        {t.matched_days_ago.replace('{{days}}', '2')}
                    </p>
                </div>

                <AnimatePresence mode="popLayout">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === 'me' || msg.senderId === 'current-user-id';

                        if (msg.type === 'invite') {
                            return <DateInviteBubble key={msg.id} message={msg} isMe={isMe} />;
                        }

                        if (msg.type === 'gift') {
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={cn(
                                        "flex flex-col gap-2 p-6 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 items-center justify-center text-center",
                                        isMe ? "ml-auto" : "mr-auto"
                                    )}
                                >
                                    <div className="text-5xl mb-3 drop-shadow-xl animate-bounce">
                                        {msg.text.split(': ')[1]}
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                        {isMe ? t.gift_sent : t.gift_received}
                                    </div>
                                </motion.div>
                            );
                        }

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                key={msg.id}
                                className={cn(
                                    "flex flex-col max-w-[85%] relative group",
                                    isMe ? "ml-auto items-end" : "mr-auto items-start"
                                )}
                            >
                                <div
                                    className={cn(
                                        "px-5 py-4 rounded-[2.2rem] text-[14px] font-bold transition-all shadow-sm leading-relaxed",
                                        isMe
                                            ? "bg-primary text-white rounded-tr-none shadow-primary/20"
                                            : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-tl-none border border-slate-100 dark:border-white/5"
                                    )}
                                >
                                    {msg.text}
                                </div>

                                <div className="flex items-center gap-1.5 mt-2 px-3">
                                    <span className="text-[9px] text-slate-300 dark:text-slate-600 font-black uppercase tracking-widest">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-primary" />}
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 mr-auto"
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 dark:border-white/5">
                                <img src={profile.images[0]} alt={profile.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-slate-100 dark:bg-white/5 py-4 px-5 rounded-[1.5rem] rounded-tl-none flex gap-1 items-center">
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Invite Menu Overlay */}
            <AnimatePresence>
                {showInviteMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-32 left-6 right-6 z-[110] bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl border border-slate-100 dark:border-white/5"
                    >
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-6 text-slate-400">{t.chat_invite}</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {inviteOptions.map((opt) => (
                                <button
                                    key={opt.type}
                                    onClick={() => handleInviteSelect(opt.type)}
                                    className="flex flex-col items-center gap-3 p-4 rounded-3xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 group"
                                >
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20", opt.color)}>
                                        <opt.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Gift Menu Overlay */}
            <AnimatePresence>
                {showGiftMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-32 left-6 right-6 z-[110] bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl border border-slate-100 dark:border-white/5"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t.chat_gift}</h4>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 text-amber-500 rounded-full border border-amber-400/20">
                                <Coins className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-black">{credits}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {gifts.map((gift) => (
                                <button
                                    key={gift.id}
                                    onClick={() => handleSendGift(gift)}
                                    className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95 group"
                                >
                                    <div className="text-3xl mb-1 group-hover:scale-125 transition-transform">{gift.emoji}</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest">{gift.name}</span>
                                    <span className="text-[8px] font-bold text-primary">{gift.cost} 🪙</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CreditsModal isOpen={showCreditsModal} onClose={() => setShowCreditsModal(false)} />

            {/* Premium Input Area */}
            <footer className="px-6 pb-12 pt-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-t border-slate-100 dark:border-white/5">
                <div className="max-w-md mx-auto relative flex items-center gap-4">
                    <button
                        onClick={() => { setShowInviteMenu(!showInviteMenu); setShowGiftMenu(false); }}
                        className={cn(
                            "p-4 rounded-3xl transition-all active:scale-90",
                            showInviteMenu ? "bg-primary text-white" : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-primary"
                        )}
                    >
                        <Plus className="w-6 h-6" />
                    </button>

                    <button
                        onClick={() => { setShowGiftMenu(!showGiftMenu); setShowInviteMenu(false); }}
                        className={cn(
                            "p-4 rounded-3xl transition-all active:scale-90",
                            showGiftMenu ? "bg-primary text-white" : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-primary"
                        )}
                    >
                        <Gift className="w-6 h-6" />
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder={t.chat_type}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            className="w-full bg-slate-100 dark:bg-white/5 border-transparent border-2 focus:border-primary/20 focus:bg-white dark:focus:bg-slate-950 rounded-[2rem] px-6 py-5 text-sm font-bold transition-all outline-none text-left"
                        />
                        <button
                            disabled={!inputValue.trim()}
                            onClick={handleSend}
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-2xl disabled:opacity-30 transition-all active:scale-90 shadow-xl shadow-primary/20",
                                language === 'ar' ? "left-2" : "right-2"
                            )}
                        >
                            <Send className={cn("w-5 h-5", language === 'ar' && "rotate-180")} />
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};
