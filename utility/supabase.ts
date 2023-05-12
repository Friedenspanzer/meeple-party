import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_PROJECT_URL || !process.env.SUPABASE_ANON_KEY) {
  throw Error("File access not configured correctly");
}

export const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_ANON_KEY
);
