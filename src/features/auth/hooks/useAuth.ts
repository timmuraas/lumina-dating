'use client';

import { useEffect, useState } from 'react';

// Mock types
interface MockUser {
    id: string;
    email: string;
}

interface MockProfile {
    id: string;
    full_name?: string;
    birth_date?: string;
    gender?: string;
    looking_for?: string;
    bio?: string;
    avatar_url?: string;
    location?: any;
}

export function useAuth() {
    const [user, setUser] = useState<MockUser | null>(null);
    const [profile, setProfile] = useState<MockProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial load from localStorage
        const savedUser = localStorage.getItem('lumina_mock_user');
        const savedProfile = localStorage.getItem('lumina_mock_profile');

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
        }
        setLoading(false);
    }, []);

    const signIn = async (email: string) => {
        setLoading(true);
        // Simulate API delay
        await new Promise(r => setTimeout(r, 800));

        const newUser = { id: 'current-mock-user', email };
        setUser(newUser);
        localStorage.setItem('lumina_mock_user', JSON.stringify(newUser));

        // Check if profile already exists for this ID
        const savedProfile = localStorage.getItem('lumina_mock_profile');
        if (savedProfile) setProfile(JSON.parse(savedProfile));

        setLoading(false);
        return { error: null };
    };

    const signOut = async () => {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('lumina_mock_user');
        // localStorage.removeItem('lumina_mock_profile'); // Optional: keep profile for persistence testing
    };

    const updateProfile = async (updates: Partial<MockProfile>) => {
        if (!user) return { error: new Error('Not logged in') };

        const newProfile = {
            ...(profile || { id: user.id }),
            ...updates
        };

        setProfile(newProfile);
        localStorage.setItem('lumina_mock_profile', JSON.stringify(newProfile));

        return { data: newProfile, error: null };
    };

    return {
        user,
        profile,
        loading,
        signIn,
        signOut,
        updateProfile,
        refreshProfile: () => { } // Not needed in mock mode
    };
}
