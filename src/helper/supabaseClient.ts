import {createClient} from "@supabase/supabase-js";

const supabaseUrl = "https://qbmfeqyqahhxqzsygukc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibWZlcXlxYWhoeHF6c3lndWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MjM0NzcsImV4cCI6MjA1Njk5OTQ3N30.ZFdxAnKaPUbmpwvcSQhQxXZAdrtDBzfzIuIt_2gKgjA";

const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;