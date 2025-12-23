'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiscoveryFiltersProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DiscoveryFilters: React.FC<DiscoveryFiltersProps> = ({ isOpen, onClose }) => {
    const [ageRange, setAgeRange] = useState([18, 30]);
    const [distance, setDistance] = useState(25);
    const [gender, setGender] = useState<'women' | 'men' | 'all'>('women');

    const handleApply = () => {
        // Just close and show a fake reload in the parent (already handled by key change in DiscoveryPage)
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
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-[3rem] z-[1001] p-8 pb-12 shadow-2xl"
                    >
                        <header className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Filters</h2>
                            <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </header>

                        <div className="space-y-10">
                            {/* Gender Selection */}
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 px-1">Show Me</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['women', 'men', 'all'] as const).map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setGender(option)}
                                            className={cn(
                                                "py-3 rounded-2xl font-bold text-xs uppercase transition-all tracking-wider border-2",
                                                gender === option
                                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                                    : "bg-slate-50 dark:bg-white/5 border-transparent text-slate-400"
                                            )}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Age Range */}
                            <section>
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Age Range</h3>
                                    <span className="text-xs font-black text-primary uppercase">{ageRange[0]} - {ageRange[1]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="18"
                                    max="50"
                                    value={ageRange[1]}
                                    onChange={(e) => setAgeRange([18, parseInt(e.target.value)])}
                                    className="w-full accent-primary h-1 bg-slate-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer"
                                />
                            </section>

                            {/* Distance */}
                            <section>
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Distance</h3>
                                    <span className="text-xs font-black text-primary uppercase">{distance} km</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={distance}
                                    onChange={(e) => setDistance(parseInt(e.target.value))}
                                    className="w-full accent-primary h-1 bg-slate-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer"
                                />
                            </section>
                        </div>

                        <button
                            onClick={handleApply}
                            className="w-full mt-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Apply Filters
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
