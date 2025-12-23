'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, Calendar, X } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

export const LevelUpNotification = () => {
    const { level, dailyBonusReceived, resetDailyBonusNotification, checkDailyLogin } = useUserStore();
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showDailyBonus, setShowDailyBonus] = useState(false);
    const [displayLevel, setDisplayLevel] = useState(level);

    // Initial check for daily login
    useEffect(() => {
        checkDailyLogin();
    }, []);

    // Monitor for Level Up
    useEffect(() => {
        if (level > displayLevel) {
            setShowLevelUp(true);
            setDisplayLevel(level);

            const timer = setTimeout(() => {
                setShowLevelUp(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [level, displayLevel]);

    // Monitor for Daily Bonus
    useEffect(() => {
        if (dailyBonusReceived) {
            setShowDailyBonus(true);

            const timer = setTimeout(() => {
                setShowDailyBonus(false);
                resetDailyBonusNotification();
            }, 4000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [dailyBonusReceived, resetDailyBonusNotification]);

    return (
        <>
            {/* Level Up Notification */}
            <AnimatePresence>
                {showLevelUp && (
                    <div className="fixed top-24 inset-x-0 z-[2000] flex justify-center p-6 pointer-events-none">
                        <motion.div
                            initial={{ y: -100, opacity: 0, scale: 0.5 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -100, opacity: 0, scale: 0.8 }}
                            onClick={() => setShowLevelUp(false)}
                            className="bg-primary shadow-[0_20px_50px_rgba(var(--primary-rgb),0.5)] border-2 border-white/20 px-8 py-5 rounded-[2.5rem] flex items-center gap-5 pointer-events-auto cursor-pointer group"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute -inset-2 border border-dashed border-white/30 rounded-full"
                                />
                                <div className="w-14 h-14 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md">
                                    <Trophy className="w-8 h-8 text-white fill-white/20" />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">🎉 Achievement</span>
                                    <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                                </div>
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
                                    Level Up! <span className="text-white/60">Stage {level}</span>
                                </h3>
                                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">
                                    New Perks Unlocked in Profile
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-2 ml-2">
                                <Sparkles className="w-6 h-6 text-white animate-pulse" />
                                <X className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Daily Bonus Notification */}
            <AnimatePresence>
                {showDailyBonus && !showLevelUp && (
                    <div className="fixed top-24 inset-x-0 z-[2000] flex justify-center p-6 pointer-events-none">
                        <motion.div
                            initial={{ y: -100, opacity: 0, scale: 0.5 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -100, opacity: 0, scale: 0.8 }}
                            onClick={() => { setShowDailyBonus(false); resetDailyBonusNotification(); }}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl border-2 border-slate-800 dark:border-slate-100 px-6 py-4 rounded-[2rem] flex items-center gap-4 pointer-events-auto cursor-pointer group"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Daily Login Bonus</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-black italic tracking-tighter uppercase">+50 XP Received</span>
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                </div>
                            </div>
                            <X className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity ml-2" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
