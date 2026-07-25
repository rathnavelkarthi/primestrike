import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the SERVICE ROLE key.
// NEVER import this into a client component or expose the key with NEXT_PUBLIC_.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "supabaseAdmin: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Bucket that holds the protected videos (private bucket).
export const VIDEO_BUCKET = process.env.SUPABASE_VIDEO_BUCKET || "videos";
