'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/lib/translations';
import { Sparkles, ArrowRight, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { language, login, isLoading } = useUserStore();
    const router = useRouter();
    const t = translations[language];

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const storedEmail = localStorage.getItem('user_contact');
        const storedPass = localStorage.getItem('user_password');

        // Logic: If no stored password, allow any (demo). If stored, check strictly.
        const isSuccess = !storedPass || (id === storedEmail && password === storedPass);

        if (isSuccess) {
            localStorage.setItem('lumina_session', 'active');
            setShowSuccess(true);

            // Hard redirect for reliability
            setTimeout(() => {
                window.location.href = '/discovery';
            }, 1000);
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-slate-950 flex items-center justify-center p-6 text-white overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">
                        Lumina
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                        Welcome back, Explorer
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="Email or Phone"
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-8 py-5 text-sm font-bold outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Terminal Password"
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-8 py-5 text-sm font-bold outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {isLoading ? 'Decrypting...' : 'Establish Connection'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors"
                    >
                        No account? Initialize Profile
                    </button>
                </div>
            </motion.div>

            {/* Success Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-[2100] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-primary/40"
                        >
                            <Sparkles className="w-12 h-12 text-white" />
                        </motion.div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
                            Welcome back!
                        </h2>
                        <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                            Neural Link Established
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
