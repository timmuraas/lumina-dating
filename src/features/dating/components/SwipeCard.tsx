'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { Heart, X, MapPin, Info, Sparkles } from 'lucide-react';
import { Profile } from '@/types';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/lib/translations';

interface SwipeCardProps {
    profile: Profile;
    onSwipe: (direction: 'left' | 'right') => void;
    isTop: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ profile, onSwipe, isTop }) => {
    const { language } = useUserStore();
    const t = translations[language];

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-250, 250], [-25, 25]);
    const opacity = useTransform(x, [-250, -200, 0, 200, 250], [0, 1, 1, 1, 0]);

    // Media states
    const [photoIndex, setPhotoIndex] = useState(0);
    const [matchScore] = useState(() => Math.floor(Math.random() * (99 - 70 + 1)) + 70);
    const [isFlipped, setIsFlipped] = useState(false);

    // Default prompt if missing
    const displayPromptQuestion = profile.promptQuestion || "MY RED FLAG";
    const displayPrompt = profile.prompt || "I reply in 3 seconds ⚡";

    // Enhanced Inertia & Weight Effects
    const scale = useTransform(x, [-150, 0, 150], [1.08, 1, 1.08]);

    // Visual Feedback Layers
    const likeOpacity = useTransform(x, [50, 150], [0, 1]);
    const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (isFlipped) return; // Disable swipe while viewing info
        const threshold = 120;
        const velocity = info.velocity.x;

        if (info.offset.x > threshold || velocity > 500) onSwipe('right');
        else if (info.offset.x < -threshold || velocity < -500) onSwipe('left');
    };

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (photoIndex < profile.images.length - 1) {
            setPhotoIndex(prev => prev + 1);
        }
    };

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (photoIndex > 0) {
            setPhotoIndex(prev => prev - 1);
        }
    };

    // Format distance: "2 km" -> "2 km away"
    const displayDistance = profile.distance.includes('km')
        ? profile.distance.replace('km', t.distance_km)
        : profile.distance;

    return (
        <motion.div
            style={{
                x,
                rotate,
                opacity,
                scale,
                zIndex: isTop ? 10 : 0,
                filter: isTop ? 'none' : 'blur(4px)',
                perspective: 1000,
            }}
            drag={isTop && !isFlipped ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            whileDrag={{
                scale: 1.05,
                transition: { type: 'spring', damping: 20, stiffness: 300 }
            }}
            transition={{
                type: 'spring',
                damping: 35,
                stiffness: 200
            }}
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{
                scale: isTop ? 1 : 0.9,
                opacity: 1,
                y: isTop ? 0 : 40,
                rotate: isTop ? 0 : (profile.id === '2' ? -4 : 4),
                rotateY: isFlipped ? 180 : 0
            }}
            exit={{
                x: x.get() > 0 ? 1000 : -1000,
                opacity: 0,
                rotate: x.get() > 0 ? 90 : -90,
                scale: 1.2,
                transition: { duration: 0.5, ease: "anticipate" }
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        >
            <div className="relative w-full h-full bg-white dark:bg-slate-900 rounded-[4rem] overflow-hidden border border-white/20 dark:border-white/5 shadow-2xl">

                {/* --- FRONT SIDE --- */}
                <div className={cn("absolute inset-0 transition-opacity duration-300", isFlipped ? "opacity-0 pointer-events-none" : "opacity-100")}>
                    {/* --- PHOTO CONTAINER --- */}
                    <div className="absolute inset-0 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={photoIndex}
                                src={profile.images[photoIndex]}
                                alt={profile.name}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="w-full h-full object-cover pointer-events-none select-none"
                            />
                        </AnimatePresence>

                        {/* Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-30" />
                    </div>

                    {/* --- STORIES PROGRESS BARS --- */}
                    <div className="absolute top-6 inset-x-8 flex gap-2 z-50">
                        {profile.images.map((_, i) => (
                            <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white"
                                    initial={false}
                                    animate={{
                                        width: i < photoIndex ? "100%" : i === photoIndex ? "100%" : "0%"
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        opacity: i <= photoIndex ? 1 : 0
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* --- MATCH SCORE BADGE --- */}
                    <div className={cn("absolute top-12 z-50", language === 'ar' ? "left-8" : "right-8")}>
                        <div className="bg-primary/20 backdrop-blur-xl border border-primary/40 px-4 py-2 rounded-2xl flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary fill-primary/20" />
                            <span className="text-sm font-black italic text-primary uppercase tracking-tighter">
                                🔥 {matchScore}% {t.match_percent}
                            </span>
                        </div>
                    </div>

                    {/* --- TAP ZONES FOR PHOTOS --- */}
                    <div className="absolute inset-x-0 top-0 bottom-48 flex pointer-events-auto z-40">
                        <div onClick={language === 'ar' ? nextPhoto : prevPhoto} className="flex-1 cursor-pointer" />
                        <div onClick={language === 'ar' ? prevPhoto : nextPhoto} className="flex-1 cursor-pointer" />
                    </div>

                    {/* --- FEEDBACK STICKERS --- */}
                    <motion.div
                        style={{ opacity: likeOpacity, rotate: -15 }}
                        className="absolute top-24 left-12 z-50 border-[6px] border-primary text-primary px-8 py-3 rounded-[2rem] font-black text-6xl italic tracking-tighter bg-white/10 backdrop-blur-2xl"
                    >
                        {t.swipe_like}
                    </motion.div>

                    <motion.div
                        style={{ opacity: nopeOpacity, rotate: 15 }}
                        className="absolute top-24 right-12 z-50 border-[6px] border-destructive text-destructive px-8 py-3 rounded-[2rem] font-black text-6xl italic tracking-tighter bg-white/10 backdrop-blur-2xl"
                    >
                        {t.swipe_nope}
                    </motion.div>

                    {/* --- INFO GLASS PANEL --- */}
                    <div className="absolute inset-x-4 bottom-4 p-8 bg-white/10 dark:bg-black/20 backdrop-blur-[40px] rounded-[3.5rem] border border-white/20 dark:border-white/5 pointer-events-none">
                        <div className="relative z-10">
                            {/* Icebreaker Prompt Widget */}
                            <div className="mb-6 pointer-events-auto cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}>
                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-primary/40" />
                                    <div className={cn("relative z-10", language === 'ar' ? "text-right" : "text-left")}>
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-1.5 block">
                                            {displayPromptQuestion}
                                        </span>
                                        <p className="text-lg font-bold text-white leading-tight italic tracking-tight">
                                            "{displayPrompt}"
                                        </p>
                                    </div>
                                    <Sparkles className="absolute bottom-4 right-6 w-5 h-5 text-white/10 group-hover:text-primary/40 transition-colors" />
                                </div>
                            </div>

                            <div className="flex items-end justify-between mb-2">
                                <div className={cn(language === 'ar' ? "text-right" : "text-left")}>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg">{profile.name}</h2>
                                        <span className="text-2xl font-bold text-white/50 tracking-tighter">{profile.age}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary/80 mt-2 bg-primary/10 w-fit px-3 py-1 rounded-full border border-primary/20 leading-none">
                                        <MapPin className="w-3 h-3" />
                                        <span>{displayDistance}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                                    className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center pointer-events-auto shadow-2xl hover:scale-110 active:scale-95 transition-all"
                                >
                                    <Info className="w-7 h-7" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BACK SIDE (Detailed Info) --- */}
                <div
                    className={cn(
                        "absolute inset-0 bg-slate-900 p-10 flex flex-col justify-center transition-opacity duration-300",
                        isFlipped ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div className="relative z-10 h-full flex flex-col pointer-events-auto">
                        <header className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Full Vibe</h3>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Deep Scan Results</p>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                                className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                            <section>
                                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-4">Transmission Bio</h4>
                                <p className="text-lg text-white font-medium leading-relaxed italic">
                                    "{profile.bio}"
                                </p>
                            </section>

                            <section>
                                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-4">Frequency Interests</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {profile.interests.map((interest: string) => (
                                        <span
                                            key={interest}
                                            className="px-5 py-2.5 bg-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20"
                                        >
                                            #{interest}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section className="p-6 bg-white/5 rounded-[2.5rem] border border-white/10">
                                <h4 className="text-[9px] font-black uppercase text-primary tracking-[0.3em] mb-2">{displayPromptQuestion}</h4>
                                <p className="text-xl font-bold text-white italic">"{displayPrompt}"</p>
                            </section>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                            className="w-full mt-8 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all"
                        >
                            Back to Scan
                        </button>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />
                </div>

            </div>
        </motion.div>
    );
};
