'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Sparkles } from 'lucide-react';
import { Profile } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/lib/translations';

interface MatchOverlayProps {
    profile: Profile | null;
    onClose: () => void;
    onMessage: () => void;
}

export const MatchOverlay: React.FC<MatchOverlayProps> = ({ profile, onClose, onMessage }) => {
    const { profile: userProfile, language } = useUserStore();
    const t = translations[language];

    if (!profile) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
            {/* Cinematic Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * 1000 - 500,
                            y: Math.random() * 1000 - 500,
                            opacity: 0,
                            scale: 0
                        }}
                        animate={{
                            y: [null, Math.random() * -500],
                            opacity: [0, 1, 0],
                            scale: [0, Math.random() * 1.5, 0],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: Math.random() * 5 + 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 5
                        }}
                        className="absolute text-primary/30"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    >
                        {i % 2 === 0 ? <Heart className="w-4 h-4 fill-current" /> : <Sparkles className="w-4 h-4" />}
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-white/20 dark:border-white/5 rounded-[4.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden p-10 text-center"
            >
                {/* Radiant Success Glow */}
                <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-primary/30 via-primary/5 to-transparent -z-10" />

                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="relative inline-block mb-10">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="bg-primary p-6 rounded-[2rem] shadow-2xl shadow-primary/30"
                        >
                            <Heart className="w-14 h-14 text-white fill-white" />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-4 border-2 border-dashed border-primary/20 rounded-full"
                        />
                    </div>

                    <h2 className="text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter mb-3 uppercase leading-none">
                        {t.match_title.split('!')[0]}<br />{t.match_title.split('!')[1] || '!'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-12 leading-relaxed font-bold uppercase tracking-widest opacity-80">
                        A new spark has been found.
                    </p>
                </motion.div>

                {/* Cinematic Photo Meeting */}
                <div className="relative h-44 flex items-center justify-center mb-14 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    <motion.div
                        initial={{ x: -200, rotate: -45, opacity: 0, scale: 0.5 }}
                        animate={{ x: -35, rotate: -12, opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.6 }}
                        className="w-36 h-36 rounded-full border-[8px] border-white dark:border-slate-800 shadow-2xl overflow-hidden ring-1 ring-black/5 z-10"
                    >
                        <img
                            src={userProfile?.avatar_url || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400"}
                            alt="You"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ x: 200, rotate: 45, opacity: 0, scale: 0.5 }}
                        animate={{ x: 35, rotate: 12, opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.7 }}
                        className="w-36 h-36 rounded-full border-[8px] border-white dark:border-slate-800 shadow-2xl overflow-hidden ring-1 ring-black/5 z-20"
                    >
                        <img
                            src={profile.images[0]}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -180 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ delay: 1.2, type: 'spring', damping: 10 }}
                        className="absolute z-30 bg-primary p-4 rounded-full shadow-[0_15px_40px_rgba(var(--primary-rgb),0.6)] border-4 border-white dark:border-slate-800"
                    >
                        <Sparkles className="w-9 h-9 text-white" />
                    </motion.div>
                </div>

                <div className="space-y-4 relative z-10">
                    <button
                        onClick={onMessage}
                        className="group w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <MessageCircle className="w-5 h-5 fill-current" />
                        {t.send_message}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-5 bg-transparent text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] transition-all"
                    >
                        {t.keep_swiping}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
