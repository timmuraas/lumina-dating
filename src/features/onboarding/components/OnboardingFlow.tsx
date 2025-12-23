'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/lib/translations';
import { Sparkles, User, Camera, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useRouter } from 'next/navigation';

import { SmartPhotoUploader } from './SmartPhotoUploader';

export const OnboardingFlow = () => {
    const { language, completeOnboarding } = useUserStore();
    const router = useRouter();
    const t = translations[language];
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | null>(null);
    const [birthDate, setBirthDate] = useState('');
    const [contactType, setContactType] = useState<'email' | 'phone'>('email');
    const [contactValue, setContactValue] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [ageError, setAgeError] = useState(false);

    const calculateAge = (dob: string) => {
        if (!dob) return 0;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleNext = () => {
        if (step === 2) {
            const age = calculateAge(birthDate);
            if (age < 18) {
                setAgeError(true);
                return;
            }
            setAgeError(false);
        }
        if (step === 3) {
            localStorage.setItem('user_contact', contactValue);
        }
        setStep(prev => prev + 1);
    };

    const handleFinish = async () => {
        const calculatedAge = calculateAge(birthDate);
        localStorage.setItem('user_contact', contactValue);
        localStorage.setItem('user_password', password);
        localStorage.setItem('user_name', name);
        localStorage.setItem('user_age', calculatedAge.toString());
        localStorage.setItem('user_avatar', uploadedImage || '');
        localStorage.setItem('user_birth_date', birthDate);

        await completeOnboarding({
            name,
            age: calculatedAge,
            birthDate,
            contactType,
            contactValue,
            password,
            avatar_url: uploadedImage || '',
            isOnboarded: true
        });
        router.push('/discovery');
    };

    const containerVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-slate-950 flex items-center justify-center p-6 text-white overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full max-sm:px-4 max-w-sm text-center relative z-10"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20">
                            <Sparkles className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4 leading-none">
                            Lumina
                        </h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-12">
                            Initialize Registration
                        </p>
                        <button
                            onClick={handleNext}
                            className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                        >
                            Start Journey
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all group"
                        >
                            Already have an account? <span className="text-primary group-hover:text-accent transition-colors ml-1 cursor-pointer">Login</span>
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full max-w-sm relative z-10"
                    >
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            Identity
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t.onboarding_name_placeholder}
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-4 text-lg font-bold outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                                />
                            </div>

                            <div className="space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                                    Date of Birth
                                </span>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => {
                                        setBirthDate(e.target.value);
                                        setAgeError(false);
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-4 text-lg font-bold outline-none focus:border-primary/50 transition-all text-white/80"
                                />
                                {ageError && (
                                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-4 mt-2">
                                        Minimum age 18 required
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">
                                    Gender Vibe
                                </span>
                                <div className="grid grid-cols-2 gap-4">
                                    {['male', 'female'].map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setGender(g as any)}
                                            className={cn(
                                                "py-4 rounded-2xl font-black uppercase tracking-tighter text-xs transition-all border",
                                                gender === g ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-slate-400"
                                            )}
                                        >
                                            {g === 'male' ? 'Guy' : 'Girl'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={!name || !gender || !birthDate || calculateAge(birthDate) < 18}
                            onClick={handleNext}
                            className="w-full mt-10 py-5 bg-white text-slate-950 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl disabled:opacity-50 transition-all active:scale-95"
                        >
                            Next Milestone
                        </button>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full max-w-sm relative z-10"
                    >
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            Credentials
                        </h2>

                        <div className="space-y-6">
                            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                                <button
                                    onClick={() => { setContactType('email'); setContactValue(''); }}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl font-black uppercase tracking-tighter text-[10px] transition-all",
                                        contactType === 'email' ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-white"
                                    )}
                                >
                                    Email
                                </button>
                                <button
                                    onClick={() => { setContactType('phone'); setContactValue(''); }}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl font-black uppercase tracking-tighter text-[10px] transition-all",
                                        contactType === 'phone' ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-white"
                                    )}
                                >
                                    Phone
                                </button>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type={contactType === 'email' ? 'email' : 'tel'}
                                    value={contactValue}
                                    onChange={(e) => setContactValue(e.target.value)}
                                    placeholder={contactType === 'email' ? 'user@mail.com' : '+1 234 567 89'}
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-4 text-sm font-bold outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                                />

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Neural Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-4 text-sm font-bold outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                                />

                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Protocol"
                                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-4 text-sm font-bold outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                                />

                                {password && confirmPassword && password !== confirmPassword && (
                                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-4">
                                        Neural Mismatch
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            disabled={!contactValue || !password || password !== confirmPassword || (contactType === 'email' && !contactValue.includes('@'))}
                            onClick={handleNext}
                            className="w-full mt-10 py-5 bg-white text-slate-950 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl disabled:opacity-50 transition-all active:scale-95"
                        >
                            Secure Identity
                        </button>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        variants={containerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full max-w-sm text-center relative z-10"
                    >
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
                            Avatar
                        </h2>
                        <p className="text-slate-400 text-xs font-bold mb-12 uppercase tracking-widest">
                            Establish Visual Identity
                        </p>

                        <SmartPhotoUploader onUploadComplete={setUploadedImage} t={t} />

                        <button
                            disabled={!uploadedImage}
                            onClick={handleFinish}
                            className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 disabled:opacity-20 disabled:grayscale transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            Complete Registration
                            <Sparkles className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
