// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ojxgyaylosexrbvvllzg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qeGd5YXlsb3NleHJidnZsbHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzY0MzUsImV4cCI6MjA2NjU1MjQzNX0.xuT96Cxn_DAZTm4Vxoeehs7r3lV1P1iTdD76ZR6i9rs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);