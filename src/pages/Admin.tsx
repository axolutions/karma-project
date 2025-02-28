
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailManager from '@/components/admin/EmailManager';
import InterpretationEditor from '@/components/admin/InterpretationEditor';
import SupabaseSetup from '@/components/admin/SupabaseSetup';
import { Users, Book, Info, Cloud, Database, Download, Upload, WifiOff, RefreshCw, List, ClipboardList } from 'lucide-react';
import { exportInterpretations, importInterpretations, getAllInterpretations, getAllCategories, getCategoryDisplayName } from '@/lib/interpretations';
import { toast } from "@/components/ui/use-toast";
import { isInOfflineMode, attemptReconnect } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const Admin = () => {
  const [showInfoBox, setShowInfoBox] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [showAllInterpretations, setShowAllInterpretations] = useState(false);
  const [interpretationsList, setInterpretationsList] = useState<any[]>([]);
  const [interpretationsCount, setInterpretationsCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  
  // Verificar estado offline a cada 5 segundos
  useEffect(() => {
    const checkOfflineStatus = () => {
      setIsOffline(isInOfflineMode());
    };
    
    checkOfflineStatus();
    const interval = setInterval(checkOfflineStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Atualizar contagens ao abrir a página
    updateInterpretationStats();
  }, []);
  
  // Função para atualizar estatísticas
  const updateInterpretationStats = () => {
    try {
      const allInterpretations = getAllInterpretations();
      setInterpretationsList(allInterpretations);
      setInterpretationsCount(allInterpretations.length);
      
      // Contar por categoria
      const counts: Record<string, number> = {};
      const categories = getAllCategories();
      
      categories.forEach(cat => {
        counts[cat] = 0;
      });
      
      allInterpretations.forEach(interp => {
        const [category] = interp.id.split('-');
        if (counts[category] !== undefined) {
          counts[category]++;
        }
      });
      
      setCategoryCounts(counts);
      
    } catch (error) {
      console.error("Erro ao atualizar estatísticas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as estatísticas das interpretações.",
        variant: "destructive"
      });
    }
  };
  
  // Função para diagnosticar o estado dos dados
  const runDiagnostics = () => {
    try {
      // Verificar interpretações no localStorage
      const localStorageData = localStorage.getItem('karmicInterpretations');
      const parsedData = localStorageData ? JSON.parse(localStorageData) : {};
      const interpretationCount = Object.keys(parsedData).length;
      
      console.log("Diagnóstico de dados:");
      console.log("Interpretações em localStorage:", interpretationCount);
      console.log("Dados brutos:", parsedData);
      
      // Exportar para console
      const exportedData = exportInterpretations();
      console.log("Dados exportados:", exportedData);
      
      // Atualizar estatísticas
      updateInterpretationStats();
      
      toast({
        title: "Diagnóstico concluído",
        description: `Encontradas ${interpretationCount} interpretações no localStorage. Detalhes no console.`
      });
    } catch (error) {
      console.error("Erro ao executar diagnóstico:", error);
      toast({
        title: "Erro de diagnóstico",
        description: "Ocorreu um erro ao analisar os dados. Veja o console para detalhes.",
        variant: "destructive"
      });
    }
  };
  
  // Função para fazer backup de emergência
  const emergencyExport = () => {
    try {
      const data = exportInterpretations();
      
      if (Object.keys(data).length === 0) {
        toast({
          title: "Nada para exportar",
          description: "Não há interpretações para exportar no armazenamento.",
          variant: "destructive"
        });
        return;
      }
      
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportName = `backup-emergencial-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
      
      toast({
        title: "Backup de emergência concluído",
        description: `${Object.keys(data).length} interpretações exportadas com sucesso.`
      });
    } catch (error) {
      console.error("Erro ao fazer backup de emergência:", error);
      
      // Tentar recuperar dados brutos do localStorage
      try {
        const rawData = localStorage.getItem('karmicInterpretations');
        if (rawData) {
          const blob = new Blob([rawData], {type: 'application/json'});
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `localStorage-raw-backup-${new Date().toISOString().slice(0, 10)}.json`;
          link.click();
          
          toast({
            title: "Backup bruto realizado",
            description: "Os dados brutos do localStorage foram exportados com sucesso."
          });
        }
      } catch (e) {
        console.error("Erro na tentativa de backup bruto:", e);
        toast({
          title: "Falha completa no backup",
          description: "Não foi possível realizar nenhum tipo de backup.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Função para tentar reconectar com Supabase
  const handleReconnect = async () => {
    const success = await attemptReconnect();
    setIsOffline(!success);
  };
  
  // Função para exibir lista completa de interpretações
  const showInterpretationsList = () => {
    updateInterpretationStats();
    setShowAllInterpretations(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-medium text-karmic-800 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-karmic-600">
            Gerencie emails autorizados e interpretações da Matriz Kármica.
          </p>
          
          {/* Indicador de offline e botão de reconexão */}
          {isOffline && (
            <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <WifiOff className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-amber-700">Modo offline ativo. Dados salvos apenas localmente.</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReconnect}
                className="bg-white text-amber-600 border-amber-300 hover:bg-amber-50"
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Reconectar
              </Button>
            </div>
          )}
          
          {/* Estatísticas das interpretações */}
          <div className="mt-4 bg-white p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Estatísticas das Interpretações</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={updateInterpretationStats}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-1" /> Atualizar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={showInterpretationsList}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <List className="h-4 w-4 mr-1" /> Listar Todas
                </Button>
              </div>
            </div>
            <p className="text-sm mb-2">Total de interpretações: <strong>{interpretationsCount}</strong></p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div key={category} className="bg-gray-50 p-2 rounded">
                  <span>{getCategoryDisplayName(category)}: <strong>{count}</strong></span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Botões de diagnóstico de emergência */}
          <div className="mt-4 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runDiagnostics}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Info className="h-4 w-4 mr-1" /> Diagnóstico
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={emergencyExport}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Download className="h-4 w-4 mr-1" /> Backup de Emergência
            </Button>
          </div>
        </div>
        
        {showInfoBox && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <Cloud className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Armazenamento seguro:</strong> Suas interpretações são salvas na nuvem automaticamente quando possível, e também localmente. 
                  Para segurança adicional, utilize as funções "Exportar" e "Importar" para fazer backup das suas interpretações.
                </p>
              </div>
              <button 
                onClick={() => setShowInfoBox(false)} 
                className="ml-auto flex-shrink-0 text-blue-400 hover:text-blue-500"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-karmic-200 mb-6">
          <SupabaseSetup />
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-karmic-200">
          <Tabs defaultValue="interpretations" className="space-y-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="emails" className="flex items-center justify-center">
                <Users className="h-4 w-4 mr-2" />
                Emails Autorizados
              </TabsTrigger>
              <TabsTrigger value="interpretations" className="flex items-center justify-center">
                <Book className="h-4 w-4 mr-2" />
                Interpretações
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center justify-center">
                <Database className="h-4 w-4 mr-2" />
                Banco de Dados
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="emails">
              <EmailManager />
            </TabsContent>
            
            <TabsContent value="interpretations">
              <InterpretationEditor />
            </TabsContent>
            
            <TabsContent value="database">
              <SupabaseSetup />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Dialog para listar todas as interpretações */}
      <Dialog open={showAllInterpretations} onOpenChange={setShowAllInterpretations}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Lista Completa de Interpretações</DialogTitle>
            <DialogDescription>
              Total de {interpretationsList.length} interpretações armazenadas no sistema.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] rounded-md border p-4">
            <div className="space-y-4">
              {getAllCategories().map(category => {
                const categoryItems = interpretationsList.filter(item => item.id.startsWith(`${category}-`));
                
                if (categoryItems.length === 0) return null;
                
                return (
                  <div key={category} className="pb-4 border-b border-gray-200 last:border-0">
                    <h3 className="font-medium text-gray-900 mb-2">{getCategoryDisplayName(category)} ({categoryItems.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categoryItems.map(item => {
                        const numberPart = item.id.split('-')[1];
                        return (
                          <div key={item.id} className="p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium">{getCategoryDisplayName(category)} {numberPart}</div>
                            <div className="text-xs text-gray-500 truncate">{item.title}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              
              {interpretationsList.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  <ClipboardList className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma interpretação encontrada no sistema.</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAllInterpretations(false)}>
              Fechar
            </Button>
            <Button onClick={emergencyExport}>
              <Download className="h-4 w-4 mr-1" /> Exportar Todas
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
