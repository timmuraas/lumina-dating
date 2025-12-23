'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { LandingPage } from '@/features/auth/components/LandingPage';
import { motion } from 'framer-motion';
import { Compass, MessageCircle, Heart, User, Sparkles, MapPin, Info, X, Bell, Settings } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { SwipeCard } from '@/features/dating/components/SwipeCard';
import { MatchOverlay } from '@/features/dating/components/MatchOverlay';
import { cn } from '@/lib/utils';

import { useRouter } from 'next/navigation';

export default function AppRouter() {
  const { profile, isAuthenticated } = useUserStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
    if (isAuthenticated && profile?.isOnboarded) {
      router.push('/discovery');
    }
  }, [isAuthenticated, profile, router]);

  if (!isHydrated) return null;

  return (
    <LandingPage onStart={() => router.push('/onboarding')} onLogin={() => router.push('/login')} />
  );
}

