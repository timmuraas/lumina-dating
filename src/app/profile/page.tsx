'use client';

import React from 'react';
import { useUserStore } from '@/store/useUserStore';
import {
    Heart,
    Eye,
    Zap,
    Crown,
    Bell,
    ShieldCheck,
    LogOut,
    CheckCircle2,
    ChevronRight,
    Search,
    Moon,
    Languages,
    Globe,
    Sun,
    ChevronDown,
    Lock,
    Unlock,
    Gift,
    Sparkles,
    Star,
    Coins as CoinsIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { EditProfileModal } from '@/features/profile/components/EditProfileModal';
import { NotificationSettingsModal } from '@/features/profile/components/NotificationSettingsModal';
import { SecuritySettingsModal } from '@/features/profile/components/SecuritySettingsModal';
import { translations, Language } from '@/lib/translations';

const LEVEL_THRESHOLDS = [0, 500, 2000, 10000];
const LEVEL_NAMES = [
    'Newcomer',
    'Active Soul',
    'Vibe Master',
    'Lumina Legend'
];

export default function ProfilePage() {
    const { profile, logout, language, setLanguage, xp, level } = useUserStore();
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    React.useEffect(() => {
        const session = localStorage.getItem('lumina_session');
        if (!session) {
            router.push('/');
        }
    }, [router]);

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [activeModal, setActiveModal] = React.useState<'notifications' | 'security' | null>(null);
    const [isLangMenuOpen, setIsLangMenuOpen] = React.useState(false);

    // Derived dark mode state for UI consistency
    const isDarkMode = theme === 'dark';

    const t = translations[language];

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const stats = [
        { label: t.stats_likes, value: '86', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: t.stats_views, value: '1.2k', icon: Eye, color: 'text-primary', bg: 'bg-primary/10' },
        { label: t.stats_matches, value: '12', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' }
    ];

    const languages: { code: Language, label: string, flag: string }[] = [
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'ru', label: 'Русский', flag: '🇷🇺' },
        { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
        { code: 'ar', label: 'العربية', flag: '🇦🇪' }
    ];

    const currentLang = languages.find(l => l.code === language) || languages[0];

    const prevThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[level] || 10000;
    const progress = Math.min(((xp - prevThreshold) / (nextThreshold - prevThreshold)) * 100, 100);

    const perks = [
        { id: 1, label: '100 Free Coins', icon: CoinsIcon, minLevel: 2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 2, label: 'Shop Discount', icon: Gift, minLevel: 3, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { id: 3, label: 'Early Access', icon: Sparkles, minLevel: 4, color: 'text-amber-500', bg: 'bg-amber-500/10' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-32 overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header / Identity */}
            <header className="px-6 pt-12 pb-10 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-white/5 rounded-b-[4rem] shadow-sm">
                <div className="flex flex-col items-center">
                    <div className="relative group mb-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={cn(
                                "relative w-32 h-32 rounded-[3.5rem] overflow-hidden border-[6px] transition-all duration-500 shadow-2xl",
                                level >= 3 ? "border-amber-400" : level >= 2 ? "border-slate-300 dark:border-slate-600" : "border-slate-50 dark:border-slate-800"
                            )}
                        >
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="You" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                    <Star className="w-12 h-12 text-slate-300" />
                                </div>
                            )}
                        </motion.div>

                        {/* Level Badge Hook */}
                        {level >= 3 && (
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="absolute -top-4 -right-2 bg-gradient-to-br from-amber-300 to-amber-500 p-2 rounded-2xl shadow-xl shadow-amber-500/20 z-10"
                            >
                                <Crown className="w-6 h-6 text-white fill-white/20" />
                            </motion.div>
                        )}

                        <div className={cn("absolute -bottom-1 bg-blue-500 p-1.5 rounded-2xl border-4 border-white dark:border-slate-950 shadow-lg z-10", language === 'ar' ? "-left-1" : "-right-1")}>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <div className="text-center mb-8 w-full max-w-xs">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
                                {profile?.name || t.explorer}{profile?.age ? `, ${profile.age}` : ''}
                            </h1>
                        </div>

                        {profile?.contactValue && (
                            <div className="flex items-center justify-center gap-1.5 mb-1 opacity-60">
                                <span className="text-[9px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">
                                    {profile.contactType === 'email' ? 'ID:' : 'COMM:'} {
                                        profile.contactType === 'email'
                                            ? `${profile.contactValue.split('@')[0].slice(0, 2)}***@${profile.contactValue.split('@')[1]}`
                                            : `${profile.contactValue.slice(0, 4)} *** *** ${profile.contactValue.slice(-2)}`
                                    }
                                </span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                            </div>
                        )}

                        {/* XP Progress Section */}
                        <div className="mt-4 px-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">
                                    Level {level}: {LEVEL_NAMES[level - 1]}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 capitalize">
                                    {xp} / {nextThreshold} XP
                                </span>
                            </div>
                            <div className="h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ type: "spring", bounce: 0, duration: 1 }}
                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-8 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]"
                    >
                        {t.edit_profile}
                    </button>
                </div>
            </header>

            <main className="px-6 -mt-8 relative z-10 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm text-center"
                        >
                            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-3", stat.bg)}>
                                <stat.icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                            <span className={cn("text-xl font-black block leading-none mb-1", stat.color)}>
                                {stat.value}
                            </span>
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Perks Section */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">My Level Perks</h3>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map(l => (
                                <div key={l} className={cn("w-1.5 h-1.5 rounded-full", level >= l ? "bg-primary" : "bg-slate-100 dark:bg-white/5")} />
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {perks.map((perk) => (
                            <div
                                key={perk.id}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 p-4 rounded-[2.5rem] border transition-all duration-500",
                                    level >= perk.minLevel
                                        ? "bg-white dark:bg-white/5 border-slate-100 dark:border-white/10 opacity-100"
                                        : "bg-slate-50/50 dark:bg-black/20 border-transparent opacity-40 grayscale"
                                )}
                            >
                                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-1 shadow-inner", perk.bg)}>
                                    <perk.icon className={cn("w-5 h-5", perk.color)} />
                                </div>
                                <span className="text-[7px] font-black uppercase tracking-widest text-center leading-tight">
                                    {perk.label}
                                </span>
                                {level < perk.minLevel ? (
                                    <Lock className="w-3 h-3 text-slate-400 mt-1" />
                                ) : (
                                    <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                        <Unlock className="w-1.5 h-1.5 text-white" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Monetization Banner */}
                <button
                    className="w-full relative overflow-hidden p-6 rounded-[3rem] bg-gradient-to-br from-primary via-accent to-primary shadow-xl shadow-primary/20 group text-left"
                >
                    <div className="absolute inset-x-0 inset-y-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className={cn(language === 'ar' ? 'text-right' : 'text-left')}>
                            <h3 className="text-white font-black text-lg italic uppercase leading-tight tracking-tighter">
                                {t.upgrade_pro}
                            </h3>
                            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">
                                {t.see_likes}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <Crown className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </button>

                {/* iOS Style Settings Menu */}
                <section className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
                    {/* Language Option */}
                    <div className="p-2">
                        <button
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-[2.5rem] transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-blue-500" />
                                </div>
                                <span className="font-bold text-sm tracking-tight">{t.lang_select}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{currentLang.flag}</span>
                                <motion.div animate={{ rotate: isLangMenuOpen ? 180 : 0 }}>
                                    <ChevronDown className="w-4 h-4 text-slate-300" />
                                </motion.div>
                            </div>
                        </button>

                        <AnimatePresence>
                            {isLangMenuOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden px-2 mb-2"
                                >
                                    <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50/50 dark:bg-white/5 rounded-[2rem]">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => {
                                                    setLanguage(lang.code);
                                                    setIsLangMenuOpen(false);
                                                }}
                                                className={cn(
                                                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all active:scale-95",
                                                    language === lang.code
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                        : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500"
                                                )}
                                            >
                                                <span className="text-xs font-black uppercase tracking-tighter">{lang.label}</span>
                                                <span>{lang.flag}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="h-px bg-slate-100 dark:bg-white/5 mx-6" />

                        {/* Theme Toggle */}
                        <div className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-[2.5rem] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                    {isDarkMode ? <Moon className="w-5 h-5 text-amber-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                                </div>
                                <span className="font-bold text-sm tracking-tight">{t.dark_mode}</span>
                            </div>
                            <button
                                onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                                className={cn(
                                    "w-12 h-6 rounded-full p-1 transition-colors duration-300",
                                    isDarkMode ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                )}
                            >
                                <motion.div
                                    animate={{ x: isDarkMode ? 24 : 0 }}
                                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Additional Menu Items */}
                <section className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
                    <button
                        onClick={() => setActiveModal('notifications')}
                        className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-amber-500" />
                            </div>
                            <span className="font-bold text-sm tracking-tight">{t.notifications}</span>
                        </div>
                        <ChevronRight className={cn("w-5 h-5 text-slate-300", language === 'ar' && "rotate-180")} />
                    </button>
                    <button
                        onClick={() => setActiveModal('security')}
                        className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                            </div>
                            <span className="font-bold text-sm tracking-tight">{t.safety_center}</span>
                        </div>
                        <ChevronRight className={cn("w-5 h-5 text-slate-300", language === 'ar' && "rotate-180")} />
                    </button>
                </section>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 p-6 bg-red-500/5 text-red-500 rounded-[3rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-500/10 transition-all border-2 border-red-500/5 mb-10"
                >
                    <LogOut className="w-4 h-4" />
                    {t.logout}
                </button>

                <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
                <NotificationSettingsModal isOpen={activeModal === 'notifications'} onClose={() => setActiveModal(null)} />
                <SecuritySettingsModal isOpen={activeModal === 'security'} onClose={() => setActiveModal(null)} />
            </main>
        </div>
    );
}
