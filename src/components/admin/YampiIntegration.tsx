
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { syncYampiCustomers } from '@/lib/yampi';
import { Loader2, RefreshCw, Save } from 'lucide-react';

const YampiIntegration: React.FC = () => {
  const [yampiApiKey, setYampiApiKey] = useState('');
  const [yampiStoreId, setYampiStoreId] = useState('');
  const [yampiProductId, setYampiProductId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Carregar configurações salvas quando o componente é montado
  React.useEffect(() => {
    const savedApiKey = localStorage.getItem('yampi_api_key');
    const savedStoreId = localStorage.getItem('yampi_store_id');
    const savedProductId = localStorage.getItem('yampi_product_id');
    
    if (savedApiKey) setYampiApiKey(savedApiKey);
    if (savedStoreId) setYampiStoreId(savedStoreId);
    if (savedProductId) setYampiProductId(savedProductId);
  }, []);
  
  const handleSaveConfig = () => {
    setIsSaving(true);
    
    // Validar campos
    if (!yampiApiKey || !yampiStoreId || !yampiProductId) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos da configuração da Yampi.",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }
    
    // Salvar configurações no localStorage
    // Em uma implementação real, isso seria enviado para um backend seguro
    localStorage.setItem('yampi_api_key', yampiApiKey);
    localStorage.setItem('yampi_store_id', yampiStoreId);
    localStorage.setItem('yampi_product_id', yampiProductId);
    
    toast({
      title: "Configuração salva",
      description: "As informações da Yampi foram salvas com sucesso."
    });
    
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };
  
  const handleSyncCustomers = async () => {
    setIsSyncing(true);
    
    try {
      // Esta função será implementada para buscar clientes da Yampi
      // e adicionar seus emails à lista de autorizados
      const result = await syncYampiCustomers();
      
      toast({
        title: "Sincronização concluída",
        description: `${result.added} emails adicionados, ${result.failed} falhas.`
      });
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar os clientes da Yampi.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-karmic-800 mb-3">Configuração da Yampi</h3>
        <p className="text-sm text-karmic-600 mb-4">
          Configure a integração com a plataforma Yampi para verificação automática de compras.
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="yampi_api_key" className="text-sm font-medium text-karmic-700 block mb-2">
              Chave de API da Yampi
            </label>
            <Input
              id="yampi_api_key"
              type="password"
              placeholder="Insira a chave de API da Yampi"
              value={yampiApiKey}
              onChange={(e) => setYampiApiKey(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="yampi_store_id" className="text-sm font-medium text-karmic-700 block mb-2">
              ID da Loja
            </label>
            <Input
              id="yampi_store_id"
              placeholder="Ex: sua-loja"
              value={yampiStoreId}
              onChange={(e) => setYampiStoreId(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="yampi_product_id" className="text-sm font-medium text-karmic-700 block mb-2">
              ID do Produto
            </label>
            <Input
              id="yampi_product_id"
              placeholder="ID do produto da Matriz Kármica"
              value={yampiProductId}
              onChange={(e) => setYampiProductId(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              onClick={handleSyncCustomers}
              disabled={isSyncing || !yampiApiKey || !yampiStoreId || !yampiProductId}
              className="karmic-button-outline"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sincronizar Clientes
                </>
              )}
            </Button>
            
            <Button
              type="button"
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="bg-karmic-600 hover:bg-karmic-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configuração
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-karmic-200 pt-4 mt-4">
        <h4 className="text-sm font-medium text-karmic-700 mb-2">Como funciona</h4>
        <ul className="text-sm text-karmic-600 space-y-1 list-disc pl-4">
          <li>Configure os dados da sua loja Yampi</li>
          <li>Quando um cliente compra o produto, seu email é automaticamente autorizado</li>
          <li>Use "Sincronizar Clientes" para atualizar todos os compradores de uma vez</li>
          <li>Você pode sempre adicionar emails manualmente na aba "Emails Autorizados"</li>
        </ul>
      </div>
    </div>
  );
};

export default YampiIntegration;
