import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xxxx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIs...";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
