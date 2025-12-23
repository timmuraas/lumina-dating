'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { SwipeDeck } from "@/features/dating/components/SwipeDeck";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Bell, LogOut, Compass, MessageSquare, User, X, Settings } from "lucide-react";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { DiscoveryFilters } from "@/features/dating/components/DiscoveryFilters";
import { CreditsModal } from "@/features/wallet/components/CreditsModal";
import { Coins } from "lucide-react";

import { translations } from '@/lib/translations';

export default function DiscoveryPage() {
    const { profile, credits, language } = useUserStore();
    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);
    const [showCredits, setShowCredits] = useState(false);
    const t = translations[language];

    React.useEffect(() => {
        const session = localStorage.getItem('lumina_session');
        if (!session) {
            router.push('/');
        }
    }, [router]);

    return (
        <div className="flex flex-col h-[100dvh] bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-500 pb-28" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Grease */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[50%] bg-primary/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-accent/5 rounded-full blur-[140px]" />
            </div>

            {/* Premium Glass Header */}
            <header className="px-6 py-5 flex items-center justify-between bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl border-b border-slate-100 dark:border-white/5 sticky top-0 z-[100]">
                <div className="flex items-center gap-3 active:scale-95 transition-transform cursor-pointer">
                    <div className="p-2 bg-primary/10 rounded-2xl">
                        <BrandLogo size={28} />
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter italic uppercase text-slate-900 dark:text-white">Lumina</h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowCredits(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-amber-400/10 text-amber-500 rounded-2xl border border-amber-400/20 hover:bg-amber-400/20 transition-all active:scale-90"
                    >
                        <Coins className="w-5 h-5 shrink-0" />
                        <span className="text-xs font-black tracking-tighter">{credits}</span>
                    </button>
                    <button
                        onClick={() => setShowFilters(true)}
                        className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-primary transition-all active:scale-90"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => router.push('/profile')}
                        className="group relative w-11 h-11 rounded-3xl overflow-hidden ring-2 ring-primary/20 hover:ring-primary transition-all active:scale-90"
                    >
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="You" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-white/10"><User className="w-5 h-5" /></div>
                        )}
                    </button>
                </div>
            </header>

            <main className="flex-1 relative flex items-center justify-center p-6 overflow-hidden">
                <div className="w-full h-full max-w-md">
                    <SwipeDeck key={Date.now().toString()} />
                </div>
            </main>

            <DiscoveryFilters isOpen={showFilters} onClose={() => setShowFilters(false)} />
            <CreditsModal isOpen={showCredits} onClose={() => setShowCredits(false)} />
        </div>
    );
}
