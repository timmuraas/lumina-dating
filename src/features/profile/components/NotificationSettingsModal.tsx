'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Mail, Heart, Gift, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/lib/translations';

interface NotificationSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ isOpen, onClose }) => {
    const { language } = useUserStore();
    const t = translations[language];

    const [settings, setSettings] = useState({
        messages: true,
        matches: true,
        gifts: false
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-[3rem] sm:rounded-[3rem] p-8 pb-12 sm:pb-8 shadow-2xl border-t border-white/10"
                    >
                        <header className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                                    {t.modal_notifications_title}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {t.notif_desc}
                                </p>
                            </div>
                            <button onClick={onClose} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </header>

                        <div className="space-y-4">
                            {[
                                { id: 'messages', label: t.notif_new_msg, icon: Mail, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                { id: 'matches', label: t.notif_new_match, icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                                { id: 'gifts', label: t.notif_gifts, icon: Gift, color: 'text-amber-500', bg: 'bg-amber-500/10' }
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-transparent transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.bg)}>
                                            <item.icon className={cn("w-6 h-6", item.color)} />
                                        </div>
                                        <span className="font-bold tracking-tight">{item.label}</span>
                                    </div>
                                    <button
                                        onClick={() => toggle(item.id as keyof typeof settings)}
                                        className={cn(
                                            "w-14 h-8 rounded-full p-1 transition-colors duration-300 relative",
                                            settings[item.id as keyof typeof settings] ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                        )}
                                    >
                                        <motion.div
                                            animate={{ x: settings[item.id as keyof typeof settings] ? 24 : 0 }}
                                            className="w-6 h-6 bg-white rounded-full shadow-lg"
                                        />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full mt-8 py-5 bg-primary text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-primary/20 active:scale-95 transition-all"
                        >
                            {t.btn_close}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
