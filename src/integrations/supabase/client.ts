// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ubinygiroepdswfpvvze.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViaW55Z2lyb2VwZHN3ZnB2dnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMzk3MjAsImV4cCI6MjA1ODkxNTcyMH0.NRCgtZEkdtFAh9y_cZbatoG5eb5a8-rDuVO4qc9gv30";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);