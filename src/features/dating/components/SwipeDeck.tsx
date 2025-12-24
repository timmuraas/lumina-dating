'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Profile } from '@/types';
import { SwipeCard } from './SwipeCard';
import { MatchOverlay } from './MatchOverlay';
import { useRouter } from 'next/navigation';

import { MOCK_PROFILES } from '@/lib/mockData';

export const SwipeDeck = () => {
    const [profiles, setProfiles] = useState(() => [...MOCK_PROFILES].sort(() => Math.random() - 0.5));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [rightSwipeCount, setRightSwipeCount] = useState(0);
    const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
    const router = useRouter();

    const handleSwipe = (direction: 'left' | 'right') => {
        const currentProfile = profiles[currentIndex];

        if (direction === 'right') {
            const newCount = rightSwipeCount + 1;
            setRightSwipeCount(newCount);

            // Fail-safe logic: match on every 2nd like
            if (newCount % 2 === 0) {
                setMatchedProfile(currentProfile);
                return; // Don't Advance yet, Overlay handles it or close it. 
            }
        }

        setCurrentIndex(prev => prev + 1);
    };

    const isOutOfProfiles = currentIndex >= profiles.length;

    return (
        <div className="relative w-full h-full max-w-sm mx-auto perspective-1000">
            <AnimatePresence mode="popLayout">
                {!isOutOfProfiles ? (
                    profiles
                        .slice(currentIndex, currentIndex + 2)
                        .reverse()
                        .map((profile, index) => {
                            const isTop = index === 1 || profiles.length - currentIndex === 1;
                            return (
                                <SwipeCard
                                    key={profile.id}
                                    profile={profile}
                                    onSwipe={handleSwipe}
                                    isTop={isTop}
                                />
                            );
                        })
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center h-full text-center p-12 bg-background dark:bg-slate-900 rounded-[3.5rem] border border-foreground/5 shadow-2xl"
                    >
                        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-8">
                            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                        </div>
                        <h3 className="text-3xl font-black text-foreground mb-4 italic uppercase tracking-tight">The end.</h3>
                        <p className="text-foreground/40 font-bold max-w-[200px] mb-10 leading-relaxed uppercase text-[10px] tracking-widest">You've explored all the vibes in your area.</p>
                        <button
                            onClick={() => {
                                setCurrentIndex(0);
                                setRightSwipeCount(0);
                            }}
                            className="w-full py-5 bg-foreground text-background rounded-full font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                        >
                            Refill Deck
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {matchedProfile && (
                    <MatchOverlay
                        profile={matchedProfile}
                        onClose={() => {
                            setMatchedProfile(null);
                            setCurrentIndex(i => i + 1);
                        }}
                        onMessage={() => {
                            setMatchedProfile(null);
                            setCurrentIndex(i => i + 1);
                            router.push('/chat');
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
