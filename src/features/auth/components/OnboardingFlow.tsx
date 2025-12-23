'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Camera, Sparkles, MapPin, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { onboardingSchema, OnboardingData } from '../types/onboarding';
import { useAuth } from '../hooks/useAuth';
import { uploadAvatar } from '@/lib/storage';

const INTERESTS = [
    'Travel', 'Fitness', 'Music', 'Gaming', 'Cooking',
    'Art', 'Photography', 'Business', 'Tech', 'Nature',
    'Wine', 'Coffee', 'Pets', 'Movies', 'Fashion',
    'Yoga', 'Dancing', 'Reading', 'Sports', 'Cars'
];

interface OnboardingWizardProps {
    onComplete: () => void;
}

import { useUserStore } from '@/store/useUserStore';

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const { completeOnboarding, isLoading: isStoreLoading } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const methods = useForm<OnboardingData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            full_name: '',
            birth_date: '',
            gender: 'other',
            looking_for: 'all',
            interests: [],
            avatar_url: '',
        },
        mode: 'onChange',
    });

    const nextStep = async () => {
        // Validation logic
        let fieldsToValidate: (keyof OnboardingData)[] = [];
        if (step === 1) fieldsToValidate = ['full_name', 'birth_date', 'gender'];
        if (step === 2) fieldsToValidate = ['interests'];
        if (step === 3) fieldsToValidate = ['avatar_url'];

        const isValid = await methods.trigger(fieldsToValidate);

        if (isValid && step < 4) {
            setDirection(1);
            setStep(step + 1);
        } else if (isValid && step === 4) {
            onSubmit(methods.getValues());
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setDirection(-1);
            setStep(step - 1);
        }
    };

    const onSubmit = async (data: OnboardingData) => {
        setIsSubmitting(true);

        try {
            // Calculate age from birth_date
            const birthDate = data.birth_date ? new Date(data.birth_date) : new Date(2000, 0, 1);
            const age = new Date().getFullYear() - birthDate.getFullYear();

            // Attempt to save to store, but don't let it block if it's slow/failed
            await Promise.race([
                completeOnboarding({
                    name: data.full_name || 'Explorer',
                    age: !isNaN(age) ? age : 25,
                    interests: data.interests || [],
                    avatar_url: data.avatar_url || '',
                    bio: "New Lumina member",
                }),
                new Promise((resolve) => setTimeout(resolve, 2000)) // Force continue after 2 seconds
            ]);
        } catch (error) {
            console.error('Onboarding sync error, continuing as guest:', error);
            // Even if it fails, we want them in discovery
        } finally {
            onComplete();
            setIsSubmitting(false);
        }
    };

    const stepVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0,
        }),
    };

    return (
        <div className="min-h-[100dvh] bg-white dark:bg-slate-950 flex flex-col relative overflow-hidden transition-colors duration-500">
            {/* Dynamic Background Grease */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-accent/5 dark:bg-accent/10 rounded-full blur-[120px]" />
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
                <button
                    onClick={prevStep}
                    className={cn(
                        "p-2.5 bg-slate-50 dark:bg-white/5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all active:scale-90",
                        step === 1 && "invisible"
                    )}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-500",
                                i === step ? "w-12 bg-primary" : i < step ? "w-6 bg-primary/30" : "w-6 bg-slate-100"
                            )}
                        />
                    ))}
                </div>
                <div className="w-10 h-10" />
            </div>

            <FormProvider {...methods}>
                <div className="flex-1 relative">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                            className="absolute inset-0 px-8 py-6 flex flex-col overflow-y-auto scrollbar-hide"
                        >
                            {step === 1 && <IdentityStep />}
                            {step === 2 && <VibeStep />}
                            {step === 3 && <VisualsStep />}
                            {step === 4 && <LocationStep />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </FormProvider>

            {/* Footer Nav */}
            <div className="p-8 pb-12 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 mt-auto">
                <button
                    type="button"
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className="group w-full py-5 bg-slate-900 dark:bg-primary text-white rounded-full font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-800 dark:hover:bg-primary/90 disabled:opacity-30 transition-all shadow-2xl active:scale-95"
                >
                    {isSubmitting || isStoreLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            <span>{step === 4 ? "Start Swiping" : "Next Vibe"}</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                {/* Secondary Help Text */}
                <p className="text-center mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-50">
                    Step {step} of 4 • Your Privacy is Priority
                </p>
            </div>
        </div>
    );
};

/* --- STEP COMPONENTS --- */

const IdentityStep = () => {
    const { register, formState: { errors } } = useFormContext<OnboardingData>();
    return (
        <div className="flex-1">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter italic">The Basics.</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium text-lg">How should we introduce you?</p>

            <div className="space-y-8">
                <div className="group space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-4 group-focus-within:text-primary transition-colors">Full Name</label>
                    <input
                        {...register('full_name')}
                        placeholder="e.g. Alex Rivera"
                        className={cn(
                            "w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-white/10 p-6 rounded-[2.5rem] text-xl font-bold transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600",
                            errors.full_name && "border-red-500/20 bg-red-500/5"
                        )}
                    />
                    {errors.full_name && <p className="text-xs text-red-500 ml-6 font-bold">{errors.full_name.message}</p>}
                </div>

                <div className="group space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-4 group-focus-within:text-primary transition-colors">Birth Date</label>
                    <input
                        type="date"
                        {...register('birth_date')}
                        className={cn(
                            "w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-white/10 p-6 rounded-[2.5rem] text-xl font-bold transition-all outline-none text-slate-900 dark:text-white",
                            errors.birth_date && "border-red-500/20 bg-red-500/5"
                        )}
                    />
                    {errors.birth_date && <p className="text-xs text-red-500 ml-6 font-bold">{errors.birth_date.message}</p>}
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-4">Gender Identity</label>
                    <div className="grid grid-cols-3 gap-4">
                        {['male', 'female', 'other'].map((g) => (
                            <label key={g} className="cursor-pointer group">
                                <input {...register('gender')} type="radio" value={g} className="hidden peer" />
                                <div className="p-5 rounded-3xl border-2 border-slate-50 dark:border-white/5 bg-slate-50 dark:bg-white/5 text-center font-black text-sm text-slate-400 dark:text-slate-500 peer-checked:border-primary peer-checked:bg-primary/5 dark:peer-checked:bg-primary/10 peer-checked:text-primary transition-all uppercase tracking-tighter capitalize group-active:scale-95 shadow-sm group-hover:border-primary/10">
                                    {g}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const VibeStep = () => {
    const { watch, setValue, formState: { errors } } = useFormContext<OnboardingData>();
    const selected = watch('interests');

    const toggle = (interest: string) => {
        if (selected.includes(interest)) {
            setValue('interests', selected.filter(i => i !== interest), { shouldValidate: true });
        } else if (selected.length < 10) {
            setValue('interests', [...selected, interest], { shouldValidate: true });
        }
    };

    return (
        <div className="flex-1">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter italic">Vibe Check.</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium text-lg">Select 3-10 tags that define you.</p>

            <div className="flex flex-wrap gap-3 overflow-y-auto max-h-[55vh] pb-12 scrollbar-hide">
                {INTERESTS.map(interest => (
                    <button
                        key={interest}
                        type="button"
                        onClick={() => toggle(interest)}
                        className={cn(
                            "px-6 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-90",
                            selected.includes(interest)
                                ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105"
                                : "bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-500 hover:border-primary/20 dark:hover:border-primary/20"
                        )}
                    >
                        {interest}
                    </button>
                ))}
            </div>
            {errors.interests && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{errors.interests.message}</p>
                </div>
            )}
        </div>
    );
};

const VisualsStep = () => {
    const { setValue, watch, formState: { errors } } = useFormContext<OnboardingData>();
    const avatarUrl = watch('avatar_url');
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(avatarUrl || null);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setPreview(base64);
            setValue('avatar_url', base64, { shouldValidate: true });
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex-1 text-center">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter italic">Your Face.</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium text-lg">Clear photos get 10x more attention.</p>

            <div className="relative w-full aspect-[3/4] max-w-[340px] mx-auto group">
                <input type="file" onChange={handleFile} className="hidden" id="photo-upload" accept="image/*" />
                <label
                    htmlFor="photo-upload"
                    className={cn(
                        "block w-full h-full rounded-[4rem] border-4 border-dashed transition-all cursor-pointer overflow-hidden relative shadow-2xl",
                        preview ? "border-primary/20 bg-slate-50 dark:bg-white/5" : "border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-200"
                    )}
                >
                    {preview ? (
                        <>
                            <motion.img
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            {uploading && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-slate-300 dark:text-slate-700">
                            <div className="p-8 bg-white dark:bg-white/5 rounded-[2.5rem] shadow-xl group-hover:scale-110 transition-transform ring-1 ring-black/5">
                                <Camera className="w-12 h-12" />
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black">Tap to Upload</span>
                        </div>
                    )}

                    {/* Inner Edge Glow */}
                    <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/20 dark:ring-white/5 rounded-[4rem]" />
                </label>

                {preview && !uploading && (
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -bottom-6 -right-6 bg-primary text-white p-5 rounded-[2rem] shadow-2xl shadow-primary/40 border-4 border-white dark:border-slate-950"
                    >
                        <Check className="w-8 h-8" />
                    </motion.div>
                )}
            </div>

            {errors.avatar_url && (
                <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-3 w-fit mx-auto">
                    <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{errors.avatar_url.message}</p>
                </div>
            )}

            <div className="mt-14 p-8 bg-primary/5 dark:bg-primary/10 rounded-[3rem] border border-primary/20 dark:border-primary/10 flex items-start gap-5 text-left backdrop-blur-sm">
                <div className="p-3 bg-white dark:bg-white/10 rounded-2xl shadow-sm">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tighter italic">Pro Vibe</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1">Genuine smiles work best. Avoid filters to attract real, high-quality connections.</p>
                </div>
            </div>
        </div>
    );
};

const LocationStep = () => {
    const { setValue, watch } = useFormContext<OnboardingData>();
    const loc = watch('location');
    const [denied, setDenied] = useState(false);

    const getLoc = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setValue('location', { lat: pos.coords.latitude, lng: pos.coords.longitude });
                setDenied(false);
            },
            () => setDenied(true)
        );
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 mb-10">
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.1, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                />
                <div className="relative w-full h-full bg-white dark:bg-white/5 rounded-full flex items-center justify-center shadow-2xl border border-primary/10">
                    <MapPin className="w-14 h-14 text-primary" />
                </div>
            </div>

            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter italic uppercase">Safe Travel.</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium text-lg max-w-[320px]">Matches near you, kept private. Your exact spot is never shared.</p>

            {loc ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="px-10 py-5 bg-primary/5 dark:bg-primary/20 text-primary rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] border-2 border-primary/20 shadow-xl shadow-primary/5">
                        GPS Locked
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-300 dark:text-slate-600 font-black uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                    </div>
                </motion.div>
            ) : (
                <button
                    onClick={getLoc}
                    className="group relative"
                >
                    <div className="px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl group-hover:scale-105 active:scale-95 transition-all">
                        Allow Access
                    </div>
                    {denied && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-10 left-0 right-0 text-[10px] text-red-500 font-bold uppercase tracking-widest"
                        >
                            Permission denied by system
                        </motion.p>
                    )}
                </button>
            )}

            <div className="mt-auto w-full p-8 bg-slate-50 dark:bg-white/5 rounded-[3rem] text-left border border-slate-100 dark:border-white/5 backdrop-blur-sm">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-relaxed uppercase tracking-widest opacity-60">
                    Lumina uses bank-level encryption (AES-256) for all geographical data. We only find who's close, never where you sleep.
                </p>
            </div>
        </div>
    );
};
