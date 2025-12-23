export interface Profile {
    id: string;
    name: string;
    age: number;
    bio: string;
    images: string[];
    interests: string[];
    distance: string;
    prompt?: string;
    promptQuestion?: string;
}
