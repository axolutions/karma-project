import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://giremtxurrwgzcbhbiao.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpcmVtdHh1cnJ3Z3pjYmhiaWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MjAyNDYsImV4cCI6MjA1NzA5NjI0Nn0.d2qCOt8fBsd_n6df84-T3TtubcvspARWj2xUAU-zONo";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);