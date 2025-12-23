import { z } from 'zod';

export const onboardingSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters"),
    birth_date: z.string().refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 18;
    }, "You must be at least 18 years old"),
    gender: z.enum(['male', 'female', 'other']),
    looking_for: z.enum(['male', 'female', 'all']),
    interests: z.array(z.string()).min(3, "Select at least 3 interests").max(10, "Select up to 10 interests"),
    location: z.object({
        lat: z.number(),
        lng: z.number(),
    }).optional(),
    avatar_url: z.string().min(1, "Please upload a photo"),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
