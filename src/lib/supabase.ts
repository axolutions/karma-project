
import { createClient } from '@supabase/supabase-js';

// Constantes para Supabase
const SUPABASE_URL = 'https://szmqkpzasopsdhdjtehc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bXFrcHphc29wc2RoZGp0ZWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0Mjk5MzQsImV4cCI6MjAzMzAwNTkzNH0.1uQHgwcFNdHSMSa1lIvP2L2C6ZQxfB1e0oGOYSxo1ec';

// Criar cliente do Supabase
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Status da conexão
export async function checkConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabaseClient.from('interpretations').select('id').limit(1);
    
    if (error) {
      console.error("Erro ao verificar conexão com Supabase:", error);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error("Erro ao conectar com Supabase:", e);
    return false;
  }
}
