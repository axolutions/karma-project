
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailManager from '@/components/admin/EmailManager';
import InterpretationEditor from '@/components/admin/InterpretationEditor';
import SupabaseSetup from '@/components/admin/SupabaseSetup';
import { Users, Book, Info, Cloud, Database, Download, Upload, WifiOff, RefreshCw } from 'lucide-react';
import { exportInterpretations, importInterpretations } from '@/lib/interpretations';
import { toast } from "@/components/ui/use-toast";
import { isInOfflineMode, attemptReconnect } from '@/lib/supabase';

const Admin = () => {
  const [showInfoBox, setShowInfoBox] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  
  // Verificar estado offline a cada 5 segundos
  useEffect(() => {
    const checkOfflineStatus = () => {
      setIsOffline(isInOfflineMode());
    };
    
    checkOfflineStatus();
    const interval = setInterval(checkOfflineStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
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
    </div>
  );
};

export default Admin;
