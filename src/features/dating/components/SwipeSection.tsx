'use client';

import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SwipeCard } from './SwipeCard';
import { MatchOverlay } from './MatchOverlay';
import { useDiscovery } from '../hooks/useDiscovery';
import { RefreshCw, Heart, X, MessageCircle, Sparkles, Loader2 } from 'lucide-react';
import { Profile } from '@/types';
import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/lib/translations';

export const SwipeSection = () => {
    const { profiles, loading, swipe } = useDiscovery();
    const { language } = useUserStore();
    const t = translations[language];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);

    const handleSwipe = useCallback(async (direction: 'left' | 'right') => {
        if (currentIndex >= profiles.length) return;

        const currentProfile = profiles[currentIndex];
        const action: 'like' | 'skip' = direction === 'right' ? 'like' : 'skip';
        const isMatch = await swipe(currentProfile.id, action);

        if (isMatch) {
            setMatchedProfile(currentProfile);
        }

        setCurrentIndex((prev) => prev + 1);
    }, [currentIndex, profiles, swipe]);

    const handleReset = () => {
        setCurrentIndex(0);
        setMatchedProfile(null);
    };

    const isOutOfProfiles = currentIndex >= profiles.length;

    if (loading && profiles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100dvh-9rem)] w-full max-w-md mx-auto">
                <div className="w-full aspect-[3/4.6] bg-slate-50 rounded-[3rem] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100dvh-9rem)] w-full max-w-md mx-auto px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="relative w-full aspect-[3/4.6] max-h-[680px]">
                <AnimatePresence mode="popLayout">
                    {!isOutOfProfiles ? (
                        profiles.slice(currentIndex, currentIndex + 2).reverse().map((profile, index) => (
                            <SwipeCard
                                key={profile.id}
                                profile={profile}
                                onSwipe={handleSwipe}
                                isTop={index === 1 || profiles.length - currentIndex === 1}
                            />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[3rem] p-10 text-center shadow-sm"
                        >
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                                <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-xl border border-primary/10">
                                    <RefreshCw className="w-10 h-10 text-primary animate-spin-slow" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase italic">
                                {t.expanding_horizon}
                            </h2>
                            <p className="text-slate-400 dark:text-slate-500 mb-10 leading-relaxed font-bold uppercase text-[10px] tracking-widest">
                                {t.looking_for_more}
                            </p>

                            <button
                                onClick={handleReset}
                                className="group relative px-10 py-4 overflow-hidden rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95"
                            >
                                <div className="absolute inset-0 bg-primary group-hover:bg-primary/90 transition-colors" />
                                <div className="relative flex items-center justify-center gap-2 text-white">
                                    <Sparkles className="w-4 h-4" />
                                    <span>{t.refresh_discovery}</span>
                                </div>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!isOutOfProfiles && (
                <div className="flex items-center gap-6 mt-12 mb-4">
                    <button
                        onClick={() => handleSwipe('left')}
                        className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-300 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center transition-all shadow-xl shadow-slate-200/20 active:scale-90"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button className="w-14 h-14 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 text-slate-300 hover:text-sky-500 hover:border-sky-200 hover:bg-sky-50 flex items-center justify-center transition-all shadow-lg active:scale-90">
                        <MessageCircle className="w-6 h-6" />
                    </button>

                    <button
                        onClick={() => handleSwipe('right')}
                        className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center transition-all shadow-2xl shadow-primary/30 active:scale-90 hover:scale-110"
                    >
                        <Heart className="w-10 h-10 fill-white" />
                    </button>
                </div>
            )}

            <MatchOverlay
                profile={matchedProfile}
                onClose={() => setMatchedProfile(null)}
                onMessage={() => setMatchedProfile(null)}
            />
        </div>
    );
};
