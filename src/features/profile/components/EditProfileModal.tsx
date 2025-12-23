'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
    const { profile, setProfile } = useUserStore();
    const [name, setName] = useState(profile?.name || '');
    const [bio, setBio] = useState(profile?.bio || '');
    const [interests, setInterests] = useState<string[]>(profile?.interests || []);
    const [newInterest, setNewInterest] = useState('');

    const handleSave = () => {
        setProfile({ name, bio, interests });
        onClose();
    };

    const addInterest = () => {
        if (newInterest.trim() && !interests.includes(newInterest.trim())) {
            setInterests([...interests, newInterest.trim()]);
            setNewInterest('');
        }
    };

    const removeInterest = (tag: string) => {
        setInterests(interests.filter(i => i !== tag));
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
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white dark:bg-slate-900 rounded-[3rem] z-[1001] p-8 overflow-y-auto max-h-[90vh] shadow-2xl scrollbar-hide"
                    >
                        <header className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Edit Identity</h2>
                            <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </header>

                        <div className="space-y-8">
                            {/* Name Input */}
                            <section>
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block px-1">Display Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-slate-950 rounded-2xl px-5 py-4 font-bold outline-none transition-all"
                                />
                            </section>

                            {/* Bio Input */}
                            <section>
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 block px-1">About You</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell them your vibe..."
                                    rows={4}
                                    className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-slate-950 rounded-2xl px-5 py-4 font-medium outline-none transition-all resize-none"
                                />
                            </section>

                            {/* Interests Management */}
                            <section>
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 block px-1">Your Interests</label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {interests.map(tag => (
                                        <div
                                            key={tag}
                                            className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-black uppercase tracking-tight flex items-center gap-2 group"
                                        >
                                            {tag}
                                            <button onClick={() => removeInterest(tag)} className="hover:text-red-500 transition-colors">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newInterest}
                                        onChange={(e) => setNewInterest(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addInterest()}
                                        placeholder="Add tag..."
                                        className="flex-1 bg-slate-100 dark:bg-white/5 rounded-2xl px-5 py-3 text-xs font-bold outline-none"
                                    />
                                    <button
                                        onClick={addInterest}
                                        className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            </section>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full mt-10 py-5 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Save Changes
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
