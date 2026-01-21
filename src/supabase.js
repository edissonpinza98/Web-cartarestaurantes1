import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Local storage fallback in effect.');
}

let supabaseClient = null;

try {
    const url = supabaseUrl || 'https://placeholder.supabase.co';
    const key = supabaseAnonKey || 'placeholder-key';

    if (supabaseUrl && supabaseAnonKey) {
        supabaseClient = createClient(url, key);
    }
} catch (e) {
    console.error('Supabase initialization failed:', e);
}

export const supabase = supabaseClient;
