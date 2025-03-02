
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { syncYampiCustomers, configureYampi, loadYampiConfig, getYampiWebhookUrl } from '@/lib/yampi';
import { Loader2, RefreshCw, Save, Plus, Trash2, Copy } from 'lucide-react';

const YampiIntegration: React.FC = () => {
  const [yampiApiKey, setYampiApiKey] = useState('');
  const [yampiProductIds, setYampiProductIds] = useState<string[]>(['']);
  const [yampiCheckoutUrl, setYampiCheckoutUrl] = useState('');
  const [yampiStoreId, setYampiStoreId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const webhookUrl = getYampiWebhookUrl();
  
  // Carregar configurações salvas quando o componente é montado
  useEffect(() => {
    const config = loadYampiConfig();
    if (config) {
      setYampiApiKey(config.apiKey);
      setYampiProductIds(config.productIds);
      if (config.checkoutUrl) {
        setYampiCheckoutUrl(config.checkoutUrl);
      }
      if (config.storeId) {
        setYampiStoreId(config.storeId);
      }
    }
  }, []);
  
  const handleAddProductId = () => {
    setYampiProductIds([...yampiProductIds, '']);
  };
  
  const handleRemoveProductId = (index: number) => {
    if (yampiProductIds.length > 1) {
      const newProductIds = [...yampiProductIds];
      newProductIds.splice(index, 1);
      setYampiProductIds(newProductIds);
    }
  };
  
  const handleProductIdChange = (index: number, value: string) => {
    const newProductIds = [...yampiProductIds];
    newProductIds[index] = value;
    setYampiProductIds(newProductIds);
  };
  
  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      title: "URL copiada",
      description: "URL do webhook copiada para a área de transferência."
    });
  };
  
  const handleSaveConfig = () => {
    setIsSaving(true);
    
    // Validar campos
    if (!yampiApiKey || yampiProductIds.some(id => !id)) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha a chave de API e todos os IDs de produtos.",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }
    
    // Filtrar IDs vazios (caso existam)
    const filteredProductIds = yampiProductIds.filter(id => id.trim() !== '');
    
    // Salvar configurações
    configureYampi({
      apiKey: yampiApiKey,
      productIds: filteredProductIds,
      checkoutUrl: yampiCheckoutUrl || undefined,
      storeId: yampiStoreId || undefined
    });
    
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
              ID da Loja Yampi (opcional)
            </label>
            <Input
              id="yampi_store_id"
              placeholder="Ex: minhaloja"
              value={yampiStoreId}
              onChange={(e) => setYampiStoreId(e.target.value)}
            />
            <p className="text-xs text-karmic-500 mt-1">
              Nome da sua loja na Yampi, geralmente o subdomínio (exemplo.yampi.io).
            </p>
          </div>
          
          <div>
            <label htmlFor="yampi_checkout_url" className="text-sm font-medium text-karmic-700 block mb-2">
              URL do Checkout Yampi (opcional)
            </label>
            <Input
              id="yampi_checkout_url"
              placeholder="Ex: https://checkout.yampi.com.br/seu-checkout"
              value={yampiCheckoutUrl}
              onChange={(e) => setYampiCheckoutUrl(e.target.value)}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-karmic-700">
                IDs dos Produtos
              </label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddProductId}
                className="text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Adicionar
              </Button>
            </div>
            
            {yampiProductIds.map((productId, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder={`ID do produto ${index + 1}`}
                  value={productId}
                  onChange={(e) => handleProductIdChange(index, e.target.value)}
                />
                {yampiProductIds.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveProductId(index)}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div>
            <label className="text-sm font-medium text-karmic-700 block mb-2">
              URL do Webhook para Notificações
            </label>
            <div className="flex gap-2">
              <Input
                value={webhookUrl}
                readOnly
                className="bg-gray-50"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={handleCopyWebhook}
                className="flex-shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-karmic-500 mt-1">
              Configure este URL no painel da Yampi para receber notificações de pedidos.
            </p>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              onClick={handleSyncCustomers}
              disabled={isSyncing || !yampiApiKey || yampiProductIds.some(id => !id)}
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
          <li>Configure a chave de API da Yampi</li>
          <li>Opcionalmente, adicione o ID da sua loja na Yampi</li>
          <li>Adicione os IDs dos produtos que devem ser verificados (pode ser mais de um)</li>
          <li>Opcionalmente, adicione a URL do seu checkout Yampi</li>
          <li>Configure o webhook em sua conta Yampi para receber notificações de pedidos</li>
          <li>Quando um cliente compra qualquer um dos produtos configurados, seu email é automaticamente autorizado</li>
          <li>Use "Sincronizar Clientes" para atualizar todos os compradores de uma vez</li>
        </ul>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Configuração do Webhook na Yampi</h4>
        <p className="text-sm text-yellow-700 mb-3">
          Para que a liberação automática funcione, você precisa configurar um webhook na sua conta Yampi:
        </p>
        <ol className="text-sm text-yellow-700 space-y-1 list-decimal pl-4">
          <li>Acesse sua conta Yampi e vá para "Configurações"</li>
          <li>Procure por "Webhooks" ou "Integrações" ou "Notificações"</li>
          <li>Adicione um novo webhook com a URL mostrada acima</li>
          <li>Selecione os eventos de "Pedido" relacionados a "Pagamento aprovado" ou similar</li>
          <li>Salve as configurações</li>
        </ol>
        <p className="text-sm text-yellow-700 mt-3">
          Em caso de dúvidas, entre em contato com o suporte da Yampi para orientações específicas sobre como configurar webhooks.
        </p>
      </div>
    </div>
  );
};

export default YampiIntegration;
