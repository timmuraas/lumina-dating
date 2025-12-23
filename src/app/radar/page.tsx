'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, X, MapPin, Scan } from 'lucide-react';
import { MOCK_PROFILES } from '@/lib/mock';
import { Profile } from '@/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/lib/translations';

export default function RadarPage() {
    const router = useRouter();
    const { language } = useUserStore();
    const t = translations[language];
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [positions, setPositions] = useState<{ [key: string]: { x: number, y: number } }>({});

    useEffect(() => {
        const newPositions: { [key: string]: { x: number, y: number } } = {};
        MOCK_PROFILES.forEach(profile => {
            const radius = 15 + Math.random() * 30;
            const angle = Math.random() * Math.PI * 2;
            newPositions[profile.id] = {
                x: 50 + radius * Math.cos(angle),
                y: 50 + radius * Math.sin(angle)
            };
        });
        setPositions(newPositions);
    }, []);

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-950 text-white overflow-hidden selection:bg-primary/30" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <header className="px-6 py-6 flex items-center justify-between bg-slate-950/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-2xl">
                        <Scan className="w-6 h-6 text-primary animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{t.radar_title}</h1>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 mt-1 block">{t.radar_scan}</span>
                    </div>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live</span>
                </div>
            </header>

            {/* Radar View */}
            <main className="flex-1 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 4, opacity: 0 }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 1.3,
                                ease: "linear"
                            }}
                            className="absolute w-40 h-40 border border-primary/20 rounded-full"
                        />
                    ))}
                    <div className="absolute w-[300px] h-[300px] border border-white/5 rounded-full" />
                    <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full" />
                </div>

                <div className="relative z-10">
                    <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(255,46,144,0.8)] animate-pulse" />
                    <div className="absolute inset-0 w-4 h-4 bg-primary rounded-full animate-ping opacity-40" />
                </div>

                {MOCK_PROFILES.map((profile) => {
                    const pos = positions[profile.id];
                    if (!pos) return null;

                    return (
                        <motion.button
                            key={profile.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedProfile(profile)}
                            className="absolute z-20 group"
                            style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/40 ring-4 ring-primary/5 transition-all group-hover:border-primary group-hover:ring-primary/20">
                                    <img src={profile.images[0]} alt={profile.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                    <span className="bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter border border-white/10 group-hover:bg-primary transition-colors">
                                        {profile.distance}
                                    </span>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </main>

            <AnimatePresence>
                {selectedProfile && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProfile(null)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 z-[101] bg-slate-900 rounded-t-[3rem] p-8 pb-32 border-t border-white/5 shadow-2xl"
                        >
                            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-xl">
                                    <img src={selectedProfile.images[0]} alt={selectedProfile.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">
                                        {selectedProfile.name}, {selectedProfile.age}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 text-slate-400">
                                        <MapPin className="w-3 h-3" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{selectedProfile.distance} from you</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedProfile(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-slate-400 font-medium mb-8 leading-relaxed text-left">
                                {selectedProfile.bio}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex-1 flex items-center justify-center gap-3 py-5 bg-white/5 hover:bg-white/10 rounded-[2rem] border border-white/5 font-black text-xs uppercase tracking-[0.2em]">
                                    <Heart className="w-5 h-5" /> Like
                                </button>
                                <button onClick={() => router.push(`/chat`)} className="flex-1 flex items-center justify-center gap-3 py-5 bg-primary text-white rounded-[2rem] shadow-xl shadow-primary/20 font-black text-xs uppercase tracking-[0.2em]">
                                    <MessageSquare className="w-5 h-5" /> {t.nav_chat}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
