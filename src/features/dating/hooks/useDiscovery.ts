'use client';

import { useState, useEffect } from 'react';
import { Profile } from '@/types';
import { MOCK_PROFILES } from '@/lib/mockData';
import { useUserStore } from '@/store/useUserStore';

export function useDiscovery() {
    const { addXp } = useUserStore();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfiles() {
            setLoading(true);
            // Simulate API delay
            await new Promise(r => setTimeout(r, 1000));

            // Get swiped IDs from local storage to filter them out
            const swipedData = localStorage.getItem('lumina_mock_swipes');
            const swipedIds = swipedData ? JSON.parse(swipedData).map((s: any) => s.targetId) : [];

            const availableProfiles = MOCK_PROFILES.filter(p => !swipedIds.includes(p.id));
            setProfiles(availableProfiles);
            setLoading(false);
        }

        fetchProfiles();
    }, []);

    const swipe = async (targetUserId: string, action: 'like' | 'skip' | 'superlike') => {
        // 1. Save swipe to local storage
        const swipedData = localStorage.getItem('lumina_mock_swipes');
        const swipes = swipedData ? JSON.parse(swipedData) : [];
        swipes.push({ targetId: targetUserId, action });
        localStorage.setItem('lumina_mock_swipes', JSON.stringify(swipes));

        // 2. Logic to simulate a match (30% chance on like)
        if (action === 'like' || action === 'superlike') {
            addXp(1);
            const isMatch = Math.random() > 0.7;
            if (isMatch) {
                // Save match to local storage
                const matchesData = localStorage.getItem('lumina_mock_matches');
                const matches = matchesData ? JSON.parse(matchesData) : [];
                const targetProfile = MOCK_PROFILES.find(p => p.id === targetUserId);
                if (targetProfile) {
                    matches.push({ id: `match-${Date.now()}`, profile: targetProfile });
                    localStorage.setItem('lumina_mock_matches', JSON.stringify(matches));
                }
                return true;
            }
        }

        return false;
    };

    return { profiles, loading, swipe };
}
