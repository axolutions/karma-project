
import { createClient } from '@supabase/supabase-js';
import { toast } from "@/components/ui/use-toast";

// Constantes para Supabase
const SUPABASE_URL = 'https://szmqkpzasopsdhdjtehc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6bXFrcHphc29wc2RoZGp0ZWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0Mjk5MzQsImV4cCI6MjAzMzAwNTkzNH0.1uQHgwcFNdHSMSa1lIvP2L2C6ZQxfB1e0oGOYSxo1ec';

// Flag para controlar o modo offline
let isOfflineMode = false;

// Criar cliente do Supabase com opções de timeout aumentadas
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (...args) => {
      // Aqui controlamos o timeout da requisição
      const [url, config] = args;
      return fetch(url, {
        ...config,
        signal: AbortSignal.timeout(10000), // 10 segundos de timeout
      }).catch(error => {
        console.warn("Erro na requisição Supabase:", error);
        isOfflineMode = true;
        throw error;
      });
    }
  }
});

// Verificar se estamos em modo offline
export function isInOfflineMode(): boolean {
  return isOfflineMode;
}

// Forçar modo offline
export function setOfflineMode(value: boolean): void {
  isOfflineMode = value;
  if (value) {
    console.log("Modo offline ativado forçadamente.");
  } else {
    console.log("Tentando reconectar com Supabase...");
  }
}

// Status da conexão
export async function checkConnection(): Promise<boolean> {
  // Se já sabemos que estamos offline, não tentar novamente
  if (isOfflineMode) {
    console.log("Estamos em modo offline, pulando verificação de conexão.");
    return false;
  }
  
  try {
    const { data, error } = await supabaseClient.from('interpretations').select('id').limit(1);
    
    if (error) {
      console.error("Erro ao verificar conexão com Supabase:", error);
      
      // Se o erro for porque a tabela não existe, vamos tentar criar
      if (error.code === '42P01') {  // Código para "relação não existe"
        await setupDatabase();
        return await checkConnection(); // Tenta novamente após criar tabela
      }
      
      isOfflineMode = true;
      return false;
    }
    
    // Se chegou aqui, estamos online
    isOfflineMode = false;
    return true;
  } catch (e) {
    console.error("Erro ao conectar com Supabase:", e);
    isOfflineMode = true;
    return false;
  }
}

// Configurar o banco de dados Supabase
export async function setupDatabase(): Promise<boolean> {
  if (isOfflineMode) {
    console.log("Estamos em modo offline, pulando setup de database.");
    return false;
  }
  
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
          isOfflineMode = true;
          return false;
        }
      }
    }
    
    console.log("Tabela interpretations configurada com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro crítico ao configurar banco de dados:", error);
    isOfflineMode = true;
    return false;
  }
}

// Função para tentar reconectar
export async function attemptReconnect(): Promise<boolean> {
  isOfflineMode = false; // Resetar flag para tentar nova conexão
  toast({
    title: "Tentando reconectar...",
    description: "Verificando conexão com o banco de dados.",
  });
  
  const connectionResult = await checkConnection();
  
  if (connectionResult) {
    toast({
      title: "Conexão restabelecida!",
      description: "A conexão com o Supabase foi restaurada com sucesso.",
    });
    return true;
  } else {
    toast({
      title: "Falha na reconexão",
      description: "Não foi possível conectar ao Supabase. Continuando em modo offline.",
      variant: "destructive"
    });
    return false;
  }
}

// Executar setup imediatamente ao carregar
setupDatabase().then(success => {
  if (success) {
    console.log("Banco de dados configurado com sucesso!");
  } else {
    console.warn("Não foi possível configurar o banco de dados automaticamente. Operando em modo offline.");
    
    // Notificar usuário
    if (isOfflineMode) {
      setTimeout(() => {
        toast({
          title: "Modo Offline Ativado",
          description: "Não foi possível conectar ao banco de dados. Dados serão salvos localmente.",
          duration: 6000,
        });
      }, 2000); // Atraso para garantir que os toasts já foram inicializados
    }
  }
});

