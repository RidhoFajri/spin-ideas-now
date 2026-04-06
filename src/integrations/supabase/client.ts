import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xxxx.supabase.co"; // dari Supabase
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIs..."; // anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
