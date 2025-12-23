'use client';

import React, { useState } from 'react';
import { ChatList } from '@/features/chat/components/ChatList';
import { ChatRoom } from '@/features/chat/components/ChatRoom';
import { Profile } from '@/types';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User } from 'lucide-react';

import { BottomNavigation } from '@/components/layout/BottomNavigation';

export default function ChatPage() {
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        const session = localStorage.getItem('lumina_session');
        if (!session) {
            router.push('/');
        }
    }, [router]);

    return (
        <div className="flex flex-col h-[100dvh] bg-white dark:bg-slate-950">
            {selectedProfile ? (
                <ChatRoom
                    profile={selectedProfile}
                    onBack={() => setSelectedProfile(null)}
                />
            ) : (
                <div className="flex flex-col h-full overflow-hidden pb-28">
                    <header className="px-6 py-6 flex items-center justify-between bg-white dark:bg-slate-950 sticky top-0 z-50">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push('/discovery')}
                                className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-primary transition-all active:scale-90"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">Social Hub</h1>
                        </div>
                        <button className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400">
                            <User className="w-6 h-6" />
                        </button>
                    </header>
                    <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                        <ChatList onSelectProfile={(p) => setSelectedProfile(p)} />
                    </main>
                    <BottomNavigation />
                </div>
            )}
        </div>
    );
}
