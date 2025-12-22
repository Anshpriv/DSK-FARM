import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yztiagogrursfczdwdqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6dGlhZ29ncnVyc2ZjemR3ZHFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzODg5MDksImV4cCI6MjA4MTk2NDkwOX0.bAQm2PG42ePrtJXCDu465NlXag77sf3JLw5bmNBkpes';

export const supabase = createClient(supabaseUrl, supabaseKey);
