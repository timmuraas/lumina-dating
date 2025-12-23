'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Key, Smartphone, Users, ChevronRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/lib/translations';

interface SecuritySettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SecuritySettingsModal: React.FC<SecuritySettingsModalProps> = ({ isOpen, onClose }) => {
    const { language } = useUserStore();
    const t = translations[language];
    const [twoFactor, setTwoFactor] = useState(true);

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
                                    {t.modal_security_title}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {t.sec_desc}
                                </p>
                            </div>
                            <button onClick={onClose} className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </header>

                        <div className="space-y-4">
                            {/* Change Password */}
                            <button className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-[2.2rem] border border-transparent hover:border-primary/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                        <Key className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <span className="font-bold tracking-tight text-left">
                                        {t.sec_change_pass}
                                    </span>
                                </div>
                                <ChevronRight className={cn("w-5 h-5 text-slate-300 group-hover:text-primary transition-colors", language === 'ar' && "rotate-180")} />
                            </button>

                            {/* 2FA Toggle */}
                            <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-[2.2rem] border border-transparent">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Smartphone className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <span className="font-bold tracking-tight block leading-none">
                                            {t.sec_2fa}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1 block">
                                            {t.sec_2fa_desc}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setTwoFactor(!twoFactor)}
                                    className={cn(
                                        "w-14 h-8 rounded-full p-1 transition-colors duration-300 relative",
                                        twoFactor ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                    )}
                                >
                                    <motion.div
                                        animate={{ x: twoFactor ? 24 : 0 }}
                                        className="w-6 h-6 bg-white rounded-full shadow-lg"
                                    />
                                </button>
                            </div>

                            {/* Blocked Users */}
                            <button className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-[2.2rem] border border-transparent hover:border-primary/20 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-rose-500" />
                                    </div>
                                    <span className="font-bold tracking-tight text-left">
                                        {t.sec_blocked}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full text-slate-400 group-hover:text-primary transition-colors">12</span>
                                    <ChevronRight className={cn("w-5 h-5 text-slate-300 group-hover:text-primary transition-colors", language === 'ar' && "rotate-180")} />
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full mt-8 py-5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all"
                        >
                            {t.btn_close}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
