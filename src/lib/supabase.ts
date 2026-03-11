import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://scnnyocsilnsblaswsnq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjbm55b2NzaWxuc2JsYXN3c25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjIwOTUsImV4cCI6MjA4ODc5ODA5NX0.sQll4Zt6M6m0lTqeM3sqqOSoyFC-alwqodPna8aDmrs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
