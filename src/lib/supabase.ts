// src/lib/supabase.ts
// Proxy file to use the mock client instead of the real Supabase SDK
export * from './supabaseMock';

export const isSupabaseConfigured = () => true;
