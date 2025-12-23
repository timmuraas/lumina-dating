'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Wine, Film, Moon, Check, X, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '../hooks/useChat';

interface DateInviteBubbleProps {
    message: Message;
    isMe: boolean;
}

export const DateInviteBubble: React.FC<DateInviteBubbleProps> = ({ message, isMe }) => {
    const inviteIcons = {
        coffee: Coffee,
        drinks: Wine,
        cinema: Film,
        walk: Moon
    };

    const colors = {
        coffee: 'from-orange-400 to-rose-400',
        drinks: 'from-purple-500 to-indigo-500',
        cinema: 'from-blue-500 to-cyan-500',
        walk: 'from-slate-700 to-slate-900'
    };

    const Icon = inviteIcons[message.inviteType || 'coffee'];
    const bgGradient = colors[message.inviteType || 'coffee'];
    const isAccepted = message.inviteStatus === 'accepted';

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isAccepted
                ? { scale: [1, 1.05, 1], rotate: [0, 1, -1, 0], opacity: 1 }
                : { scale: 1, opacity: 1 }
            }
            transition={isAccepted ? { duration: 0.5, repeat: 1 } : {}}
            className={cn(
                "w-full max-w-[280px] rounded-[2.5rem] overflow-hidden shadow-xl shadow-primary/10",
                isMe ? "ml-auto" : "mr-auto"
            )}
        >
            <div className={cn("p-6 bg-gradient-to-br text-white relative overflow-hidden", bgGradient)}>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8" />
                    </div>

                    <h3 className="text-lg font-black italic uppercase tracking-tighter leading-tight mb-1">
                        {message.text}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                        {isAccepted ? "Invitation Accepted" : "Interactive Invite"}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 border-t border-slate-100 dark:border-white/5">
                {isAccepted ? (
                    <div className="flex items-center justify-center gap-2 py-2 text-green-500 font-black text-[10px] uppercase tracking-[0.2em]">
                        <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                        </div>
                        Accepted ✅
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <button className="py-3 bg-red-500/10 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all">
                            <X className="w-4 h-4" /> Decline
                        </button>
                        <button className="py-3 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-all">
                            <Check className="w-4 h-4" /> Accept
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
