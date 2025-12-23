import { Profile } from '@/types';

export const MOCK_PROFILES: Profile[] = [
    {
        id: '1',
        name: 'Elena',
        age: 24,
        bio: 'Art director and coffee enthusiast. I love hiking and film photography. Looking for someone to share morning runs with.',
        images: [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600'
        ],
        interests: ['Art', 'Coffee', 'Nature', 'Fitness'],
        distance: '2 km',
        promptQuestion: 'MY SUPERPOWER',
        prompt: 'Finding the best local coffee spots ☕️'
    },
    {
        id: '2',
        name: 'Marcus',
        age: 28,
        bio: 'Software engineer by day, jazz pianist by night. Let’s talk about tech, music, or the best ramen spots in town.',
        images: [
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600'
        ],
        interests: ['Tech', 'Music', 'Cooking', 'Gaming'],
        distance: '5 km',
        promptQuestion: 'UNPOPULAR OPINION',
        prompt: 'Pineapple definitely belongs on pizza 🍕'
    },
    {
        id: '3',
        name: 'Sophia',
        age: 22,
        bio: 'Fashion student and part-time model. Always traveling and looking for the next big inspiration.',
        images: [
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600'
        ],
        interests: ['Fashion', 'Photography', 'Travel', 'Art'],
        distance: '10 km',
        promptQuestion: 'DREAM DATE',
        prompt: 'Rooftop sunset & vintage jazz records'
    },
    {
        id: '4',
        name: 'David',
        age: 31,
        bio: 'Chef. I believe everything in life is better with a good meal and great company.',
        images: [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'
        ],
        interests: ['Cooking', 'Wine', 'Business'],
        distance: '3 km',
        promptQuestion: 'MY RED FLAG',
        prompt: 'I will critique your choice of pasta shape'
    },
    {
        id: '5',
        name: 'Olivia',
        age: 26,
        bio: 'Yoga instructor and wellness coach. Helping you find your inner peace while exploring the outer world.',
        images: [
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600'
        ],
        interests: ['Yoga', 'Nature', 'Fitness', 'Coffee'],
        distance: '8 km',
        promptQuestion: 'OBSESSION',
        prompt: 'Collecting rare succulents and indie zines'
    }
];
