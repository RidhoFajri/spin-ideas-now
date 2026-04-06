import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Validation environment variables
const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string().min(1),
});

const _ = envSchema.safeParse({ SUPABASE_URL, SUPABASE_KEY });
if (!_.success) {
  throw new Error(`Invalid environment variables: ${_.error.format()}`);
}

// Create a Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
