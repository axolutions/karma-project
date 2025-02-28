
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
      
      // Se o erro for porque a tabela não existe, vamos tentar criar
      if (error.code === '42P01') {  // Código para "relação não existe"
        await setupDatabase();
        return await checkConnection(); // Tenta novamente após criar tabela
      }
      
      return false;
    }
    
    return true;
  } catch (e) {
    console.error("Erro ao conectar com Supabase:", e);
    return false;
  }
}

// Configurar o banco de dados Supabase
export async function setupDatabase(): Promise<boolean> {
  try {
    console.log("Tentando criar tabela interpretations no Supabase...");
    
    // SQL para criar a tabela interpretations se ela não existir
    const { error } = await supabaseClient.rpc('setup_interpretations_table');
    
    if (error) {
      console.error("Erro ao configurar banco de dados:", error);
      
      // Tentativa alternativa: criar a tabela diretamente com SQL
      const createTableResult = await supabaseClient.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS public.interpretations (
            id VARCHAR PRIMARY KEY,
            title VARCHAR NOT NULL,
            content TEXT NOT NULL,
            updated_at TIMESTAMPTZ DEFAULT now()
          );
          
          -- Configurar RLS (Row Level Security)
          ALTER TABLE public.interpretations ENABLE ROW LEVEL SECURITY;
          
          -- Política para permitir operações anônimas
          CREATE POLICY "Allow anonymous access" ON public.interpretations
            FOR ALL
            USING (true)
            WITH CHECK (true);
        `
      });
      
      if (createTableResult.error) {
        console.error("Erro ao criar tabela diretamente:", createTableResult.error);
        
        // Última tentativa: usar SQL bruto através da extensão pg_raw
        const rawSqlResult = await supabaseClient.from('_postgrest_rpc').select().eq('name', 'execute_sql');
        if (rawSqlResult.error) {
          console.error("Todas as tentativas falharam, não foi possível criar a tabela.");
          return false;
        }
      }
    }
    
    console.log("Tabela interpretations configurada com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro crítico ao configurar banco de dados:", error);
    return false;
  }
}

// Executar setup imediatamente ao carregar
setupDatabase().then(success => {
  if (success) {
    console.log("Banco de dados configurado com sucesso!");
  } else {
    console.warn("Não foi possível configurar o banco de dados automaticamente. Pode ser necessário criá-lo manualmente.");
  }
});
