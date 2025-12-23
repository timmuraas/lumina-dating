'use client';

import React from 'react';
import { Compass, MessageSquare, User, Radar } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/lib/translations';

export const BottomNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { language } = useUserStore();
    const t = translations[language];

    const items = [
        { icon: Compass, label: t.nav_discovery, path: '/discovery' },
        { icon: Radar, label: t.nav_radar, path: '/radar' },
        { icon: MessageSquare, label: t.nav_chat, path: '/chat' },
        { icon: User, label: t.nav_profile, path: '/profile' }
    ];

    return (
        <nav className="p-4 pb-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-3xl border-t border-slate-100 dark:border-white/5 z-50 fixed bottom-0 left-0 right-0">
            <div className="max-w-md mx-auto flex items-center justify-around gap-2">
                {items.map((item) => {
                    // Discovery is the home page after onboarding, but handle specific active state
                    const isActive = item.path === '/discovery'
                        ? pathname === '/discovery'
                        : pathname.startsWith(item.path);
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={cn(
                                "flex-1 flex flex-col items-center gap-1 p-3 transition-all relative group",
                                isActive ? "text-primary" : "text-slate-300 dark:text-slate-600 hover:text-slate-400"
                            )}
                        >
                            <Icon className={cn(
                                "w-7 h-7 transition-all",
                                isActive ? "scale-110" : "group-hover:scale-105"
                            )} />
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full blur-[2px]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
