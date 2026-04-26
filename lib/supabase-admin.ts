import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// This key MUST be kept secret and only used on the server
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.vibecam_live_render;

if (!supabaseServiceKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY (or vibecam_live_render) is missing. Background renders might fail due to RLS.');
}

/**
 * Admin client that bypasses RLS.
 * USE ONLY ON THE SERVER (API Routes, Server actions).
 */
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);
