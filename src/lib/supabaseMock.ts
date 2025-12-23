// src/lib/supabaseMock.ts
console.log("🔶 LOADED: MOCK SUPABASE CLIENT");

export const supabase = {
    auth: {
        getUser: async () => ({ data: { user: { id: 'mock-user-1', email: 'demo@user.com' } }, error: null }),
        getSession: async () => ({ data: { session: { access_token: 'fake-token' } }, error: null }),
        signInWithPassword: async () => ({ data: { user: {} }, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: (callback: any) => {
            callback('SIGNED_IN', { user: { id: 'mock-1' } });
            return { data: { subscription: { unsubscribe: () => { } } } };
        },
    },
    from: (table: string) => ({
        select: () => ({
            eq: () => ({
                single: async () => ({ data: { id: 'mock-1', name: 'Demo User', interests: ['Code', 'Chill'] }, error: null }),
                order: () => ({ data: [], error: null }),
            }),
            order: () => ({ data: [], error: null }),
            insert: async () => ({ error: null }),
        }),
        upload: async () => ({ data: { path: 'mock.jpg' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' } }),
        insert: async () => ({ error: null }),
    }),
    storage: {
        from: () => ({
            upload: async () => ({ data: {}, error: null }),
            getPublicUrl: () => ({ data: { publicUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' } })
        })
    }
};
