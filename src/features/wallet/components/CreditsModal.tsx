'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coins, Sparkles, Zap, Crown, Star } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

interface CreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
    const { addCredits, addXp } = useUserStore();

    const packages = [
        { id: '1', units: 100, price: '$1.99', label: 'Handful', icon: Coins, color: 'text-orange-400', xpBonus: 100 },
        { id: '2', units: 500, price: '$4.99', label: 'Bag', icon: Zap, color: 'text-primary', xpBonus: 600 },
        { id: '3', units: 1500, price: '$14.99', label: 'Vault', icon: Crown, color: 'text-amber-400', xpBonus: 2000 }
    ];

    const handleBuy = (credits: number, xp: number) => {
        addCredits(credits);
        addXp(xp);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] p-8 z-[1001] shadow-2xl border border-white/5"
                    >
                        <header className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Get Credits</h2>
                            <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </header>

                        <div className="space-y-4">
                            {packages.map((pkg) => (
                                <button
                                    key={pkg.id}
                                    onClick={() => handleBuy(pkg.units, pkg.xpBonus)}
                                    className="relative w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border-2 border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-slate-950 transition-all group overflow-hidden"
                                >
                                    {pkg.id === '3' && (
                                        <div className="absolute top-0 right-12 bg-amber-400 text-slate-900 text-[8px] font-black px-3 py-1 rounded-b-xl uppercase tracking-widest shadow-lg">
                                            Best Value
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm">
                                            <pkg.icon className={`w-6 h-6 ${pkg.color}`} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-lg font-black tracking-tight">{pkg.units} Credits</div>
                                            <div className="flex items-center gap-1.5">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary">+{pkg.xpBonus} XP Bonus</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-5 py-2 bg-primary text-white text-xs font-black rounded-full shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                        {pkg.price}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                            Upgrade your status and unlock premium features
                        </p>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
