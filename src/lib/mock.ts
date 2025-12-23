import { Profile } from "@/types";

export const MOCK_PROFILES: Profile[] = [
    {
        id: '1',
        name: 'Alexandra',
        age: 24,
        bio: 'Architect by day, salsa dancer by night. Looking for someone to explore the city with and share a good bottle of wine.',
        images: [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
        ],
        interests: ['Architecture', 'Salsa', 'Wine Tasting'],
        distance: '2.5 km'
    },
    {
        id: '2',
        name: 'Julian',
        age: 27,
        bio: 'Coffee enthusiast and mountain biker. I spent my weekends either in a coffee shop or on a trail.',
        images: [
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
        ],
        interests: ['MTB', 'Coffee', 'Hiking'],
        distance: '4.8 km'
    },
    {
        id: '3',
        name: 'Elena',
        age: 26,
        bio: 'Visual artist and ocean lover. My perfect date involves sunset, sketches, and deep conversations.',
        images: [
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
        ],
        interests: ['Painting', 'Surfing', 'Philosophy'],
        distance: '1.2 km'
    }
];
