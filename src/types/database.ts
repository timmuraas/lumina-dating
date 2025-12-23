export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    bio: string | null
                    birth_date: string | null
                    gender: 'male' | 'female' | 'other' | null
                    looking_for: 'male' | 'female' | 'all' | null
                    location: any | null
                    is_verified: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    birth_date?: string | null
                    gender?: 'male' | 'female' | 'other' | null
                    looking_for?: 'male' | 'female' | 'all' | null
                    location?: any | null
                    is_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    birth_date?: string | null
                    gender?: 'male' | 'female' | 'other' | null
                    looking_for?: 'male' | 'female' | 'all' | null
                    location?: any | null
                    is_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            interests: {
                Row: {
                    id: number
                    name: string
                    icon: string | null
                }
                Insert: {
                    id?: number
                    name: string
                    icon?: string | null
                }
                Update: {
                    id?: number
                    name?: string
                    icon?: string | null
                }
            }
            profile_interests: {
                Row: {
                    profile_id: string
                    interest_id: number
                }
                Insert: {
                    profile_id: string
                    interest_id: number
                }
                Update: {
                    profile_id?: string
                    interest_id?: number
                }
            }
            swipes: {
                Row: {
                    id: number
                    user_id: string
                    target_user_id: string
                    action: 'like' | 'skip' | 'superlike'
                    created_at: string
                }
                Insert: {
                    id?: number
                    user_id: string
                    target_user_id: string
                    action: 'like' | 'skip' | 'superlike'
                    created_at?: string
                }
                Update: {
                    id?: number
                    user_id?: string
                    target_user_id?: string
                    action?: 'like' | 'skip' | 'superlike'
                    created_at?: string
                }
            }
            matches: {
                Row: {
                    id: string
                    user_1: string
                    user_2: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_1: string
                    user_2: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_1?: string
                    user_2?: string
                    created_at?: string
                }
            }
            messages: {
                Row: {
                    id: string
                    match_id: string
                    sender_id: string
                    content: string | null
                    is_gift: boolean
                    gift_type: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    match_id: string
                    sender_id: string
                    content?: string | null
                    is_gift?: boolean
                    gift_type?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    match_id?: string
                    sender_id?: string
                    content?: string | null
                    is_gift?: boolean
                    gift_type?: string | null
                    is_read?: boolean
                    created_at?: string
                }
            }
        }
    }
}
