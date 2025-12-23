'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';

export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: string;
    type?: 'text' | 'invite' | 'gift';
    inviteType?: 'coffee' | 'drinks' | 'cinema' | 'walk';
    inviteStatus?: 'pending' | 'accepted' | 'declined';
    isGift?: boolean;
    giftType?: string | null;
}

export function useChat(matchId: string | null) {
    const { addXp } = useUserStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!matchId) return;

        const loadMessages = () => {
            const chatsData = localStorage.getItem(`lumina_mock_chat_${matchId}`);
            if (chatsData) {
                setMessages(JSON.parse(chatsData));
            } else {
                const greeting: Message = {
                    id: '1',
                    text: 'Hey! Glad we matched. How is your day going? 😊',
                    senderId: 'other',
                    timestamp: new Date().toISOString(),
                    type: 'text'
                };
                setMessages([greeting]);
                localStorage.setItem(`lumina_mock_chat_${matchId}`, JSON.stringify([greeting]));
            }
        };

        loadMessages();
        const interval = setInterval(loadMessages, 2000);
        return () => clearInterval(interval);
    }, [matchId]);

    const saveMessages = (updated: Message[]) => {
        setMessages(updated);
        localStorage.setItem(`lumina_mock_chat_${matchId}`, JSON.stringify(updated));
    };

    const sendMessage = async (content: string, type: 'text' | 'gift' = 'text', giftType: string | null = null) => {
        if (!matchId) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: 'me',
            text: content,
            timestamp: new Date().toISOString(),
            type,
            isGift: type === 'gift',
            giftType
        };

        const updated = [...messages, newMessage];
        saveMessages(updated);
        addXp(1); // Minimal reward for activity

        // Bot Response Logic for text
        if (type === 'text') {
            setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                    const response: Message = {
                        id: (Date.now() + 1).toString(),
                        senderId: 'other',
                        text: "That sounds amazing! I was just thinking about that. 😉",
                        timestamp: new Date().toISOString(),
                        type: 'text'
                    };
                    const currentMsgs = JSON.parse(localStorage.getItem(`lumina_mock_chat_${matchId}`) || '[]');
                    saveMessages([...currentMsgs, response]);
                    setIsTyping(false);
                }, 2500);
            }, 1000);
        }
    };

    const sendInvite = async (inviteType: NonNullable<Message['inviteType']>) => {
        if (!matchId || !inviteType) return;

        const inviteText = {
            coffee: "Let's grab a coffee?",
            drinks: "How about some drinks?",
            cinema: "Want to see a movie?",
            walk: "Let's go for a night walk?"
        }[inviteType];

        const newInvite: Message = {
            id: Date.now().toString(),
            senderId: 'me',
            text: inviteText,
            timestamp: new Date().toISOString(),
            type: 'invite',
            inviteType,
            inviteStatus: 'pending'
        };

        const updated = [...messages, newInvite];
        saveMessages(updated);

        // Bot Acceptance Logic
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                const currentMsgs: Message[] = JSON.parse(localStorage.getItem(`lumina_mock_chat_${matchId}`) || '[]');
                const inviteIndex = currentMsgs.findIndex(m => m.id === newInvite.id);

                if (inviteIndex !== -1) {
                    currentMsgs[inviteIndex].inviteStatus = 'accepted';
                }

                const response: Message = {
                    id: (Date.now() + 2).toString(),
                    senderId: 'other',
                    text: "I'd love to! When are you free? 😊",
                    timestamp: new Date().toISOString(),
                    type: 'text'
                };

                saveMessages([...currentMsgs, response]);
                setIsTyping(false);

                // Add a window event for confetti
                window.dispatchEvent(new CustomEvent('lumina:invite_accepted'));
            }, 3000);
        }, 1000);
    };

    const updateInviteStatus = (messageId: string, status: 'accepted' | 'declined') => {
        const updated = messages.map(m => m.id === messageId ? { ...m, inviteStatus: status } : m);
        saveMessages(updated);
    };

    const sendGift = async (giftType: string, giftEmoji: string) => {
        if (!matchId) return;

        const newGift: Message = {
            id: Date.now().toString(),
            senderId: 'me',
            text: `Sent a Gift: ${giftEmoji}`,
            timestamp: new Date().toISOString(),
            type: 'gift',
            isGift: true,
            giftType: giftType
        };

        const updated = [...messages, newGift];
        saveMessages(updated);

        // Bot Response to Gift
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
                const response: Message = {
                    id: (Date.now() + 5).toString(),
                    senderId: 'other',
                    text: `Wow, a ${giftType}! Thank you so much! 😍`,
                    timestamp: new Date().toISOString(),
                    type: 'text'
                };
                const currentMsgs = JSON.parse(localStorage.getItem(`lumina_mock_chat_${matchId}`) || '[]');
                saveMessages([...currentMsgs, response]);
                setIsTyping(false);
            }, 2000);
        }, 800);
    };

    return { messages, loading, isTyping, sendMessage, sendInvite, updateInviteStatus, sendGift };
}
