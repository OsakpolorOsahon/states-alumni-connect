
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = "https://ojxgyaylosexrbvvllzg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeGd5YXlsb3NleHJidnZsbHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzY0MzUsImV4cCI6MjA2NjU1MjQzNX0.xuT96Cxn_DAZTm4Vxoeehs7r3lV1P1iTdD76ZR6i9rs";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
