
import { toast } from "@/components/ui/use-toast";
import { supabaseClient } from '@/lib/supabase';

// Interface para interpretações
interface StoredInterpretation {
  id: string;
  title: string;
  content: string;
  updated_at?: string;
}

// Função principal para realizar diagnóstico completo
export async function performFullRecovery(): Promise<{
  localStorage: StoredInterpretation[];
  supabase: StoredInterpretation[];
  recovered: StoredInterpretation[];
}> {
  console.log("Iniciando recuperação completa das interpretações...");
  
  // Resultado do diagnóstico
  const result = {
    localStorage: [] as StoredInterpretation[],
    supabase: [] as StoredInterpretation[],
    recovered: [] as StoredInterpretation[]
  };
  
  // 1. Verificar localStorage atual
  try {
    const localData = localStorage.getItem('karmicInterpretations');
    if (localData) {
      const parsed = JSON.parse(localData);
      result.localStorage = Object.values(parsed);
      console.log(`Encontradas ${result.localStorage.length} interpretações no localStorage atual`);
    }
  } catch (e) {
    console.error("Erro ao ler localStorage atual:", e);
  }
  
  // 2. Procurar por backups automáticos no localStorage
  try {
    // Procurar por qualquer chave que contenha 'karmicInterpretations'
    const allBackups: Record<string, StoredInterpretation[]> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('karmicInterpretations') && key !== 'karmicInterpretations') {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            const items = Object.values(parsed) as StoredInterpretation[];
            allBackups[key] = items;
            console.log(`Backup encontrado em "${key}": ${items.length} interpretações`);
          }
        } catch (e) {
          console.error(`Erro ao ler backup "${key}":`, e);
        }
      }
    }
    
    // Encontrar o backup com mais interpretações
    let bestBackupKey = '';
    let maxCount = 0;
    
    Object.entries(allBackups).forEach(([key, items]) => {
      if (items.length > maxCount) {
        maxCount = items.length;
        bestBackupKey = key;
      }
    });
    
    if (bestBackupKey && allBackups[bestBackupKey].length > result.localStorage.length) {
      console.log(`Encontrado melhor backup em "${bestBackupKey}" com ${maxCount} interpretações`);
      
      // Criar uma cópia antes de substituir
      if (result.localStorage.length > 0) {
        localStorage.setItem('karmicInterpretations_before_recovery', JSON.stringify(result.localStorage));
      }
      
      // Restaurar do melhor backup para a memória
      result.recovered = allBackups[bestBackupKey];
    }
  } catch (e) {
    console.error("Erro ao procurar backups:", e);
  }
  
  // 3. Verificar dados no Supabase
  try {
    const { data, error } = await supabaseClient
      .from('interpretations')
      .select('*');
    
    if (error) {
      console.error("Erro ao buscar do Supabase:", error);
    } else if (data) {
      result.supabase = data as StoredInterpretation[];
      console.log(`Encontradas ${result.supabase.length} interpretações no Supabase`);
      
      // Se temos dados no Supabase e são mais numerosos que os locais, usá-los
      if (result.supabase.length > result.localStorage.length && 
          result.supabase.length > (result.recovered.length || 0)) {
        result.recovered = result.supabase;
      }
    }
  } catch (e) {
    console.error("Erro ao verificar Supabase:", e);
  }
  
  // 4. Se recuperamos dados, salvar no localStorage
  if (result.recovered.length > 0) {
    try {
      // Converter array para objeto indexado por ID
      const recoveredObj: Record<string, StoredInterpretation> = {};
      result.recovered.forEach(item => {
        if (item && item.id) {
          recoveredObj[item.id] = item;
        }
      });
      
      localStorage.setItem('karmicInterpretations', JSON.stringify(recoveredObj));
      console.log(`${result.recovered.length} interpretações recuperadas e salvas no localStorage`);
      
      toast({
        title: "Recuperação concluída!",
        description: `${result.recovered.length} interpretações foram recuperadas com sucesso.`
      });
    } catch (e) {
      console.error("Erro ao salvar interpretações recuperadas:", e);
    }
  } else if (result.localStorage.length > 0) {
    console.log(`Nenhuma recuperação necessária. ${result.localStorage.length} interpretações já disponíveis.`);
    toast({
      title: "Verificação concluída",
      description: `${result.localStorage.length} interpretações já estavam disponíveis no sistema.`
    });
  } else {
    console.warn("Nenhuma interpretação encontrada em nenhuma fonte.");
    toast({
      title: "Atenção",
      description: "Não foi possível encontrar interpretações em nenhuma fonte de dados.",
      variant: "destructive"
    });
  }
  
  return result;
}

// Função para recuperar todas as interpretações disponíveis
export function getAllStoredInterpretations(): StoredInterpretation[] {
  try {
    const localData = localStorage.getItem('karmicInterpretations');
    if (localData) {
      const parsed = JSON.parse(localData);
      return Object.values(parsed);
    }
  } catch (e) {
    console.error("Erro ao ler interpretações:", e);
  }
  
  return [];
}

// Função para criar um arquivo de backup
export function createBackupFile(): {success: boolean, filename?: string} {
  try {
    const interpretations = getAllStoredInterpretations();
    
    if (interpretations.length === 0) {
      toast({
        title: "Nada para exportar",
        description: "Não há interpretações para fazer backup.",
        variant: "destructive"
      });
      return {success: false};
    }
    
    // Converter para objeto indexado por ID para manter formato original
    const objFormat: Record<string, StoredInterpretation> = {};
    interpretations.forEach(item => {
      if (item && item.id) {
        objFormat[item.id] = item;
      }
    });
    
    const dataStr = JSON.stringify(objFormat, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const filename = `matriz-karmica-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.style.display = 'none';
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    
    toast({
      title: "Backup criado com sucesso",
      description: `${interpretations.length} interpretações exportadas para "${filename}"`
    });
    
    return {success: true, filename};
  } catch (e) {
    console.error("Erro ao criar backup:", e);
    toast({
      title: "Erro ao criar backup",
      description: "Não foi possível exportar as interpretações.",
      variant: "destructive"
    });
    return {success: false};
  }
}
