import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


const isConfigured = Boolean(
  supabaseUrl && supabaseAnonKey &&
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) &&
  supabaseAnonKey.length > 10
);


const createMockClient = () => ({
  rpc: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
}) as unknown as SupabaseClient;

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

export function createServerSupabaseClient() {
  if (!isConfigured) {
    console.warn('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
    return createMockClient();
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}
