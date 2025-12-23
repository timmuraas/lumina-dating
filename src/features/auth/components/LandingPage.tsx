'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BrandLogo } from '@/components/ui/BrandLogo';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Heart } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
    onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
    return (
        <div className="relative min-h-[100dvh] flex flex-col bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">
            {/* Dynamic Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center px-8 text-center pt-20">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8"
                >
                    <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-[2.5rem] shadow-2xl flex items-center justify-center mx-auto mb-6 border border-slate-50 dark:border-white/5 transition-all">
                        <BrandLogo size={48} className="text-primary" />
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-4 italic">
                        LUMINA
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-[280px] mx-auto leading-relaxed">
                        Discovery, connection, and <span className="text-primary italic">genuine</span> chemistry.
                    </p>
                </motion.div>

                {/* Feature Highlights */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 gap-4 mb-12 w-full max-w-xs"
                >
                    <div className="flex items-center gap-3 p-4 rounded-3xl bg-slate-50/50 dark:bg-white/5 border border-white dark:border-white/5 shadow-sm">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Interest-based matching</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-3xl bg-slate-50/50 dark:bg-white/5 border border-white dark:border-white/5 shadow-sm">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Verified & Safe Community</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="w-full max-w-xs space-y-4"
                >
                    <button
                        onClick={onStart}
                        className="group w-full py-5 bg-primary text-white rounded-full font-black text-lg shadow-2xl shadow-primary/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Create account
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={onLogin}
                        className="w-full py-5 bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-full font-bold border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all font-black uppercase text-xs tracking-widest"
                    >
                        Sign in
                    </button>

                    <div className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        ALREADY HAVE AN ACCOUNT?{' '}
                        <Link
                            href="/login"
                            className="text-primary hover:text-accent transition-colors underline cursor-pointer ml-1"
                        >
                            LOGIN
                        </Link>
                    </div>
                </motion.div>
            </main>

            <footer className="p-8 text-center">
                <p className="text-xs text-slate-400 font-medium tracking-wide flex items-center justify-center gap-1.5 uppercase">
                    Made with <Heart className="w-3 h-3 text-primary fill-primary" /> for the modern romantic
                </p>
            </footer>
        </div>
    );
};
