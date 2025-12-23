'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNavigation } from './BottomNavigation';
import { LevelUpNotification } from '@/components/notifications/LevelUpNotification';
import { OnboardingFlow } from '@/features/onboarding/components/OnboardingFlow';
import { useUserStore } from '@/store/useUserStore';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { profile, isAuthenticated, checkDailyLogin } = useUserStore();

    useEffect(() => {
        checkDailyLogin();
    }, []);

    useEffect(() => {
        // Redirect to login if not authenticated and not on whitelist
        const whitelistedPaths = ['/login', '/', '/onboarding'];
        const isActuallyAuthenticated = localStorage.getItem('lumina_session') === 'active';

        if (!isActuallyAuthenticated && !whitelistedPaths.includes(pathname)) {
            router.push('/login');
        }
    }, [pathname, router]);

    // Hide BottomNavigation on specific pages
    const showBottomNav = ['/discovery', '/radar', '/chat', '/profile'].some(path => pathname.startsWith(path));

    const showOnboarding = pathname === '/onboarding' || (isAuthenticated && !profile?.isOnboarded);

    return (
        <div className="min-h-screen">
            <LevelUpNotification />
            {showOnboarding ? (
                <OnboardingFlow />
            ) : (
                <>
                    {children}
                    {showBottomNav && <BottomNavigation />}
                </>
            )}
        </div>
    );
};
