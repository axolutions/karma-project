import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { 
  getAllInterpretations, 
  getCategoryDisplayName, 
  getAllCategories,
  exportInterpretations,
  Interpretation
} from '@/lib/interpretations';
import { 
  RefreshCw, 
  FileText, 
  Save,
  CheckCircle2,
  List,
  Search,
  AlertTriangle,
  Download
} from 'lucide-react';
import { isInOfflineMode, attemptReconnect } from '@/lib/supabase';
import { 
  performFullRecovery, 
  getAllStoredInterpretations, 
  createBackupFile 
} from '@/lib/recovery';

const InterpretationRecovery = () => {
  const [interpretations, setInterpretations] = useState<Interpretation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const categories = getAllCategories();
  const [recoveryPerformed, setRecoveryPerformed] = useState(false);
  const [totalFound, setTotalFound] = useState(0);
  
  useEffect(() => {
    refreshInterpretations();
    
    // Executar diagnóstico ao carregar a página
    runDiagnostic();
  }, []);
  
  const runDiagnostic = async () => {
    setIsLoading(true);
    try {
      const results = await performFullRecovery();
      
      // Após recuperação, atualizar a lista de interpretações
      refreshInterpretations();
      
      setRecoveryPerformed(true);
      setTotalFound(results.recovered.length || results.localStorage.length);
    } catch (error) {
      console.error("Erro durante diagnóstico:", error);
      toast({
        title: "Erro no diagnóstico",
        description: "Ocorreu um erro ao tentar recuperar as interpretações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshInterpretations = () => {
    setIsLoading(true);
    try {
      // Obter todas as interpretações como array
      const allInterpretations = getAllInterpretations();
      setInterpretations(allInterpretations);
      
      // Calcular estatísticas por categoria
      const stats: Record<string, number> = {};
      categories.forEach(cat => { stats[cat] = 0; });
      
      allInterpretations.forEach(item => {
        const [category] = item.id.split('-');
        if (stats[category] !== undefined) {
          stats[category]++;
        }
      });
      
      setCategoryStats(stats);
      
      // Acessar localStorage diretamente para diagnóstico
      const rawData = localStorage.getItem('karmicInterpretations');
      if (rawData) {
        try {
          const parsedData = JSON.parse(rawData);
          const totalKeys = Object.keys(parsedData).length;
          console.log(`Total de interpretações no localStorage: ${totalKeys}`);
        } catch (e) {
          console.error("Erro ao analisar localStorage:", e);
        }
      }
      
      console.log(`Recuperadas ${allInterpretations.length} interpretações do sistema`);
    } catch (error) {
      console.error("Erro ao recuperar interpretações:", error);
      toast({
        title: "Erro ao recuperar interpretações",
        description: "Ocorreu um erro ao tentar recuperar as interpretações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReconnect = async () => {
    setIsLoading(true);
    
    toast({
      title: "Tentando reconectar...",
      description: "Tentando restabelecer conexão com o Supabase"
    });
    
    try {
      const success = await attemptReconnect();
      
      if (success) {
        toast({
          title: "Conexão restabelecida!",
          description: "A conexão com o Supabase foi restaurada com sucesso."
        });
      } else {
        toast({
          title: "Falha na reconexão",
          description: "Não foi possível conectar ao Supabase. Continuando em modo offline.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao tentar reconectar:", error);
      toast({
        title: "Erro na reconexão",
        description: "Ocorreu um erro ao tentar reconectar.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExportAll = () => {
    createBackupFile();
  };
  
  const getTotalInterpretations = (): number => {
    return Object.values(categoryStats).reduce((sum, count) => sum + count, 0);
  };
  
  return (
    <div className="space-y-4 mt-6 border-t pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-medium text-karmic-800">Recuperação de Interpretações</h2>
          <p className="text-sm text-karmic-600 mt-1">
            {isInOfflineMode() ? (
              <span className="text-red-500 font-medium">Desconectado do Supabase</span>
            ) : (
              <span className="text-green-600 font-medium">Conectado ao Supabase</span>
            )}
            {" - "}
            <span>{getTotalInterpretations()} interpretações encontradas</span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshInterpretations}
            disabled={isLoading}
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} /> 
            Atualizar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAll}
            className="text-green-600 border-green-300 hover:bg-green-50"
          >
            <FileText className="h-4 w-4 mr-1" /> 
            Backup
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReconnect}
            disabled={!isInOfflineMode() || isLoading}
            className="text-amber-600 border-amber-300 hover:bg-amber-50"
          >
            <Save className="h-4 w-4 mr-1" /> 
            Reconectar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={runDiagnostic}
            disabled={isLoading}
            className="text-purple-600 border-purple-300 hover:bg-purple-50"
          >
            <Search className="h-4 w-4 mr-1" /> 
            Recuperar Dados
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Download para backup adicional usando o antigo método
              try {
                const data = exportInterpretations();
                
                if (Object.keys(data).length === 0) {
                  toast({
                    title: "Nada para exportar",
                    description: "Não há interpretações para exportar.",
                    variant: "destructive"
                  });
                  return;
                }
                
                const dataStr = JSON.stringify(data, null, 2);
                const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                
                const exportName = `interpretacoes-karmicas-backup-extra-${new Date().toISOString().split('T')[0]}.json`;
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportName);
                linkElement.click();
                
                toast({
                  title: "Backup extra concluído",
                  description: `${Object.keys(data).length} interpretações exportadas com sucesso como backup.`
                });
              } catch (error) {
                console.error("Erro ao exportar backup:", error);
                toast({
                  title: "Erro no backup",
                  description: "Não foi possível exportar as interpretações para backup.",
                  variant: "destructive"
                });
              }
            }}
            className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
          >
            <Download className="h-4 w-4 mr-1" /> 
            Backup Extra
          </Button>
        </div>
      </div>
      
      {recoveryPerformed && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {totalFound > 0 ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                {totalFound > 0 
                  ? `Recuperação concluída! ${totalFound} interpretações encontradas.` 
                  : 'Verificação concluída sem encontrar dados adicionais.'}
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  {totalFound > 0 
                    ? 'Os textos foram recuperados com sucesso e estão disponíveis no sistema. Recomendamos fazer um backup para garantir que esses dados não sejam perdidos novamente.' 
                    : 'Não encontramos interpretações adicionais para recuperar. Se você tiver um arquivo de backup, use a opção de importação para restaurar seus dados.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map(category => (
          <div 
            key={category}
            className="bg-white border rounded-md p-3 shadow-sm"
          >
            <h3 className="font-medium text-sm text-karmic-700">{getCategoryDisplayName(category)}</h3>
            <div className="mt-1 flex justify-between items-center">
              <span className="text-2xl font-semibold text-karmic-800">
                {categoryStats[category] || 0}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                categoryStats[category] > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {categoryStats[category] > 0 ? 'Textos OK' : 'Sem textos'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white border rounded-md shadow-sm overflow-hidden">
        <div 
          className="p-3 bg-gray-50 border-b cursor-pointer flex justify-between items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center">
            <List className="h-4 w-4 mr-2 text-karmic-700" />
            <h3 className="font-medium text-karmic-800">
              Listar Todas as Interpretações
            </h3>
          </div>
          <span className="text-sm text-karmic-600">
            {isExpanded ? 'Ocultar' : 'Mostrar'} {interpretations.length} itens
          </span>
        </div>
        
        {isExpanded && (
          <div className="p-3 max-h-96 overflow-y-auto">
            {categories.map(category => {
              const categoryItems = interpretations.filter(item => item.id.startsWith(`${category}-`));
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={category} className="mb-4">
                  <h4 className="font-medium text-karmic-700 mb-2">
                    {getCategoryDisplayName(category)} ({categoryItems.length})
                  </h4>
                  <ul className="space-y-1">
                    {categoryItems.map(item => (
                      <li key={item.id} className="text-sm bg-gray-50 p-2 rounded flex items-center">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                        <span className="text-karmic-800">{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterpretationRecovery;
