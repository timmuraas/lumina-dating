'use client';

/**
 * Mock storage service for autonomous mode.
 * In a real app, this would upload to Supabase.
 * Currently returns a random Unsplash placeholder or converts to data URL.
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
    // Simulate delay
    await new Promise(r => setTimeout(r, 1500));

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // In mock mode, we just return the base64 or a high-quality placeholder
            // Base64 can be heavy for localStorage if multiple large photos are used, 
            // but for a single avatar it is fine for testing.
            resolve(base64String);
        };
        reader.readAsDataURL(file);
    });
}
