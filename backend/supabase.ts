import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe environment access in both Vite client and Node server
const getEnvVar = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch {
    // ignore
  }
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] || '';
    }
  } catch {
    // ignore
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('SUPABASE_ANON_KEY');

let supabaseClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return (
    Boolean(supabaseUrl) &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    Boolean(supabaseAnonKey) &&
    supabaseAnonKey !== 'your-anon-key-here'
  );
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseClient) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
      console.warn('Erro ao inicializar cliente Supabase:', err);
      supabaseClient = null;
    }
  }
  return supabaseClient;
}

export const supabaseConfigInfo = {
  url: supabaseUrl || 'Não configurado',
  isConfigured: isSupabaseConfigured(),
};
