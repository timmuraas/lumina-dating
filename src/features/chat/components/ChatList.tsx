import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, MoreHorizontal, User } from 'lucide-react';
import { Profile } from '@/types';
import { MOCK_PROFILES } from '@/lib/mock';
import { useUserStore } from '@/store/useUserStore';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

type MatchWithProfile = {
    id: string;
    profile: Profile;
    lastMessage?: string;
    lastMessageTime?: string;
    unread?: boolean;
};

interface ChatListProps {
    onSelectProfile: (profile: Profile, matchId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onSelectProfile }) => {
    const { language } = useUserStore();
    const t = translations[language];
    const [matches, setMatches] = useState<MatchWithProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking some matches and last messages
        const initialMatches: MatchWithProfile[] = MOCK_PROFILES.map((p, i) => ({
            id: p.id,
            profile: p,
            lastMessage: i % 2 === 0 ? "That sounds amazing! Let's do it." : undefined,
            lastMessageTime: i % 2 === 0 ? "2m ago" : undefined,
            unread: i === 0
        }));

        setMatches(initialMatches);
        setLoading(false);
    }, []);

    const newMatches = matches.filter(m => !m.lastMessage);
    const activeChats = matches.filter(m => m.lastMessage);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Search Bar */}
            <div className="px-6 py-4">
                <div className="relative group">
                    <Search className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors", language === 'ar' ? "right-4" : "left-4")} />
                    <input
                        type="text"
                        placeholder={t.chat_type} // Reusing chat_type or could add search_placeholder
                        className={cn(
                            "w-full bg-slate-100 dark:bg-white/5 border-transparent border-2 focus:border-primary/20 focus:bg-white dark:focus:bg-slate-900 rounded-2xl py-3 text-sm font-medium transition-all outline-none",
                            language === 'ar' ? "pr-11 pl-4" : "pl-11 pr-4"
                        )}
                    />
                </div>
            </div>

            {/* New Matches (Stories) */}
            <section className="py-2">
                <div className="px-6 flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {t.new_matches_title}
                    </h3>
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                        {newMatches.length}
                    </span>
                </div>
                <div className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-hide">
                    {newMatches.map((m) => (
                        <motion.button
                            key={m.id}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onSelectProfile(m.profile, m.id)}
                            className="flex flex-col items-center gap-2 flex-shrink-0"
                        >
                            <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary to-accent">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-slate-950 p-0.5">
                                    <img src={m.profile.images[0]} alt={m.profile.name} className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div className={cn("absolute -bottom-1 w-5 h-5 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center p-0.5 shadow-sm", language === 'ar' ? "-left-1" : "-right-1")}>
                                    <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                                        <Heart className="w-2.5 h-2.5 fill-white text-white" />
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                {m.profile.name}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Messages List */}
            <section className="flex-1 mt-4">
                <div className="px-6 mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {t.messages_title}
                    </h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {activeChats.map((m) => (
                        <motion.button
                            key={m.id}
                            whileTap={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                            onClick={() => onSelectProfile(m.profile, m.id)}
                            className={cn(
                                "w-full flex items-center gap-4 px-6 py-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors",
                                language === 'ar' ? "text-right" : "text-left"
                            )}
                        >
                            <div className="w-16 h-16 rounded-[2rem] overflow-hidden shadow-sm flex-shrink-0 border border-slate-100 dark:border-white/5">
                                <img src={m.profile.images[0]} alt={m.profile.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                                        {m.profile.name}
                                    </h4>
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {m.lastMessageTime}
                                    </span>
                                </div>
                                <p className={cn(
                                    "text-xs truncate transition-all",
                                    m.unread ? "font-black text-slate-900 dark:text-white" : "font-medium text-slate-500"
                                )}>
                                    {m.lastMessage}
                                </p>
                            </div>
                            {m.unread && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/40 flex-shrink-0" />
                            )}
                        </motion.button>
                    ))}
                </div>
            </section>
        </div>
    );
};
