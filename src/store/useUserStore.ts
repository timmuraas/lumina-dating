import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Language } from '@/lib/translations';

interface UserProfile {
    id: string;
    name: string;
    age: number;
    bio: string;
    avatar_url: string;
    interests: string[];
    isOnboarded: boolean;
    birthDate?: string;
    contactType?: 'email' | 'phone';
    contactValue?: string;
    password?: string;
}

interface UserState {
    profile: UserProfile | null;
    isAuthenticated: boolean;
    credits: number;
    language: Language;
    isLoading: boolean;
    xp: number;
    level: number;
    lastLoginDate: string | null;
    dailyBonusReceived: boolean;
    setProfile: (profile: Partial<UserProfile>) => void;
    addCredits: (amount: number) => void;
    spendCredits: (amount: number) => boolean;
    setLanguage: (lang: Language) => void;
    addXp: (amount: number) => void;
    checkDailyLogin: () => void;
    resetDailyBonusNotification: () => void;
    completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
    login: (credentials: { login: string; pass: string }) => Promise<boolean>;
    logout: () => void;
}

const LEVEL_THRESHOLDS = [0, 500, 2000, 10000];

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            profile: (typeof window !== 'undefined' && localStorage.getItem('user_name')) ? {
                id: 'stored',
                name: localStorage.getItem('user_name') || '',
                age: parseInt(localStorage.getItem('user_age') || '18'),
                avatar_url: localStorage.getItem('user_avatar') || '',
                bio: '',
                interests: [],
                isOnboarded: true,
                contactValue: localStorage.getItem('user_contact') || '',
                birthDate: localStorage.getItem('user_birth_date') || '',
            } : null,
            isAuthenticated: typeof window !== 'undefined' ? localStorage.getItem('lumina_session') === 'active' : false,
            credits: 150,
            language: 'en',
            isLoading: false,
            xp: 350,
            level: 1,
            lastLoginDate: null,
            dailyBonusReceived: false,

            setProfile: (data) => {
                set((state) => ({
                    profile: state.profile ? { ...state.profile, ...data } : (data as UserProfile),
                }));
            },

            addCredits: (amount) => {
                set((state) => ({ credits: state.credits + amount }));
            },

            setLanguage: (lang) => {
                set({ language: lang });
            },

            spendCredits: (amount) => {
                const current = get().credits;
                if (current >= amount) {
                    set({ credits: current - amount });
                    return true;
                }
                return false;
            },

            addXp: (amount) => {
                const currentXp = get().xp + amount;
                const currentLevel = get().level;

                let newLevel = 1;
                for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
                    if (currentXp >= LEVEL_THRESHOLDS[i]) {
                        newLevel = i + 1;
                    }
                }

                set({ xp: currentXp, level: Math.min(newLevel, 4) });
            },

            checkDailyLogin: () => {
                const today = new Date().toISOString().split('T')[0];
                const lastLogin = get().lastLoginDate;

                if (lastLogin !== today) {
                    // It's a new day!
                    const currentXp = get().xp;
                    const amount = 50;
                    const newXp = currentXp + amount;

                    let newLevel = 1;
                    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
                        if (newXp >= LEVEL_THRESHOLDS[i]) {
                            newLevel = i + 1;
                        }
                    }

                    set({
                        lastLoginDate: today,
                        xp: newXp,
                        level: Math.min(newLevel, 4),
                        dailyBonusReceived: true
                    });
                }
            },

            resetDailyBonusNotification: () => {
                set({ dailyBonusReceived: false });
            },

            completeOnboarding: async (data) => {
                set({ isLoading: true });

                const newProfile: UserProfile = {
                    id: Math.random().toString(36).substring(7),
                    name: data.name || '',
                    age: data.age || 18,
                    bio: data.bio || '',
                    avatar_url: data.avatar_url || '',
                    interests: data.interests || [],
                    isOnboarded: true,
                    birthDate: data.birthDate,
                    contactType: data.contactType,
                    contactValue: data.contactValue,
                    password: data.password,
                };

                localStorage.setItem('lumina_session', 'active');
                set({ profile: newProfile, isAuthenticated: true, isLoading: false });
            },

            login: async ({ login, pass }) => {
                set({ isLoading: true });
                await new Promise(r => setTimeout(r, 1000));

                const storedContact = localStorage.getItem('user_contact');
                const storedPassword = localStorage.getItem('user_password');

                // If no account exists (demo mode), allow login. Otherwise check strictly.
                const isSuccess = !storedPassword || (login === storedContact && pass === storedPassword);

                if (isSuccess) {
                    localStorage.setItem('lumina_session', 'active');

                    // Recover profile from localStorage
                    const storedName = localStorage.getItem('user_name');
                    const storedAvatar = localStorage.getItem('user_avatar');
                    const storedAge = localStorage.getItem('user_age');
                    const storedBirthDate = localStorage.getItem('user_birth_date');

                    if (storedName) {
                        const recoveredProfile: UserProfile = {
                            id: Math.random().toString(36).substring(7),
                            name: storedName,
                            age: parseInt(storedAge || '18'),
                            avatar_url: storedAvatar || '',
                            bio: '',
                            interests: [],
                            isOnboarded: true,
                            birthDate: storedBirthDate || '',
                            contactType: storedContact?.includes('@') ? 'email' : 'phone',
                            contactValue: storedContact || login,
                        };
                        set({ profile: recoveredProfile });
                    }

                    set({ isAuthenticated: true, isLoading: false });
                    return true;
                }

                set({ isLoading: false });
                return false;
            },

            logout: () => {
                set({ profile: null, isAuthenticated: false, xp: 350, level: 1, lastLoginDate: null, dailyBonusReceived: false });
                localStorage.removeItem('lumina_session');
                localStorage.removeItem('lumina-user-storage');
            },
        }),
        {
            name: 'lumina-user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
