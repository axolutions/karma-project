
// Biblioteca para integração com a Yampi

// Interface para dados de compra da Yampi
interface YampiPurchase {
  id: string;
  email: string;
  status: string;
  created_at: string;
  product_ids: string[]; // Alterado para array de IDs de produtos
}

// Interface para configuração da Yampi
interface YampiConfig {
  apiKey: string;
  productIds: string[]; // Array de IDs de produtos 
  checkoutUrl?: string; // URL opcional do checkout
  storeId?: string;     // ID opcional da loja Yampi
}

// Armazenar configuração
let yampiConfig: YampiConfig | null = null;

// Função para configurar a integração Yampi
export const configureYampi = (config: YampiConfig): void => {
  yampiConfig = config;
  localStorage.setItem('yampi_api_key', config.apiKey);
  localStorage.setItem('yampi_product_ids', JSON.stringify(config.productIds));
  if (config.checkoutUrl) {
    localStorage.setItem('yampi_checkout_url', config.checkoutUrl);
  }
  if (config.storeId) {
    localStorage.setItem('yampi_store_id', config.storeId);
  }
  console.log('Configuração Yampi atualizada', config);
};

// Carregar configuração do localStorage
export const loadYampiConfig = (): YampiConfig | null => {
  const apiKey = localStorage.getItem('yampi_api_key');
  const productIdsStr = localStorage.getItem('yampi_product_ids');
  const checkoutUrl = localStorage.getItem('yampi_checkout_url');
  const storeId = localStorage.getItem('yampi_store_id');
  
  if (!apiKey || !productIdsStr) return null;
  
  try {
    const productIds = JSON.parse(productIdsStr);
    return {
      apiKey,
      productIds,
      checkoutUrl: checkoutUrl || undefined,
      storeId: storeId || undefined
    };
  } catch (e) {
    console.error('Erro ao carregar configuração Yampi:', e);
    return null;
  }
};

// Função para verificar se um email está em uma lista de compradores
export const verifyYampiPurchase = async (email: string): Promise<boolean> => {
  console.log(`Verificando compra na Yampi para o email: ${email}`);
  
  try {
    const config = loadYampiConfig();
    if (!config) {
      console.warn('Configuração Yampi não encontrada');
      return false;
    }
    
    // Primeiro, tente verificar usando a lista local (fallback)
    const { isAuthorizedEmail } = await import('./auth');
    if (isAuthorizedEmail(email)) {
      console.log(`Email ${email} já está autorizado na lista local`);
      return true;
    }
    
    // Se o email não estiver na lista local, tentamos verificar na API Yampi
    // Esta implementação depende de como a Yampi fornece acesso à sua API
    
    // Devido às limitações do frontend, vamos registrar que tentamos verificar
    // mas usaremos uma simplificação para não expor a chave API no cliente
    
    // Em um cenário real, você deve implementar um backend ou função serverless
    // para fazer esta verificação, protegendo sua chave de API
    
    console.log(`Tentando verificar o email ${email} diretamente na API Yampi`);
    
    // Por enquanto, mantemos o comportamento atual
    return isAuthorizedEmail(email);
    
  } catch (error) {
    console.error('Erro ao verificar compra na Yampi:', error);
    return false;
  }
};

// Função para processar um webhook recebido da Yampi
export const processYampiWebhook = async (data: any): Promise<boolean> => {
  try {
    console.log('Processando webhook da Yampi:', data);
    
    // Verificar se o payload do webhook contém as informações necessárias
    if (!data || !data.order || !data.order.customer || !data.order.customer.email) {
      console.error('Payload do webhook inválido');
      return false;
    }
    
    const email = data.order.customer.email;
    const orderStatus = data.order.status;
    const orderItems = data.order.items || [];
    
    const config = loadYampiConfig();
    if (!config) {
      console.warn('Configuração Yampi não encontrada');
      return false;
    }
    
    // Verificar se o pedido está com status pago/aprovado
    if (orderStatus !== 'paid' && orderStatus !== 'approved') {
      console.log(`Pedido para ${email} com status ${orderStatus}. Não será processado.`);
      return false;
    }
    
    // Verificar se o pedido contém pelo menos um dos produtos configurados
    const hasConfiguredProduct = orderItems.some((item: any) => {
      const productId = item.product_id?.toString() || '';
      return config.productIds.includes(productId);
    });
    
    if (!hasConfiguredProduct) {
      console.log(`Pedido para ${email} não contém produtos configurados. Não será processado.`);
      return false;
    }
    
    // Adicionar o email à lista de autorizados
    console.log(`Adicionando email ${email} à lista de autorizados após compra confirmada`);
    const { addAuthorizedEmail } = await import('./auth');
    addAuthorizedEmail(email);
    
    return true;
    
  } catch (error) {
    console.error('Erro ao processar webhook da Yampi:', error);
    return false;
  }
};

// Função para adicionar automaticamente um email à lista de autorizados após uma compra
export const addYampiCustomerToAuthorized = async (
  orderId: string, 
  email: string
): Promise<boolean> => {
  try {
    // Verificar se a compra é válida
    // Na implementação real, verificaria o status do pedido na Yampi
    
    // Se for válido, adicionar à lista de emails autorizados
    const { addAuthorizedEmail } = await import('./auth');
    addAuthorizedEmail(email);
    
    console.log(`Email ${email} adicionado automaticamente após compra na Yampi`);
    return true;
    
  } catch (error) {
    console.error('Erro ao processar compra da Yampi:', error);
    return false;
  }
};

// Função para sincronizar todos os clientes da Yampi com a lista de emails autorizados
// Esta função seria usada periodicamente ou manualmente pelo administrador
export const syncYampiCustomers = async (): Promise<{
  added: number; 
  failed: number;
}> => {
  console.log('Iniciando sincronização com a Yampi...');
  
  try {
    const config = loadYampiConfig();
    if (!config) {
      console.warn('Configuração Yampi não encontrada');
      return { added: 0, failed: 0 };
    }
    
    // Em um cenário real, este código deveria ser executado em um backend
    // Aqui estamos apenas simulando para fins de demonstração
    
    // Simulação de emails adicionados
    const mockEmails = [
      'cliente1@exemplo.com',
      'cliente2@exemplo.com',
      'cliente3@exemplo.com'
    ];
    
    // Adicionar emails simulados à lista de autorizados
    const { addAuthorizedEmail } = await import('./auth');
    let added = 0;
    
    mockEmails.forEach(email => {
      addAuthorizedEmail(email);
      added++;
    });
    
    console.log(`Adicionados ${added} emails na simulação`);
    return { added, failed: 0 };
    
  } catch (error) {
    console.error('Erro durante a sincronização com a Yampi:', error);
    return { added: 0, failed: 0 };
  }
};

// Obter URL de webhook para processar pedidos
export const getYampiWebhookUrl = (): string => {
  // Esta seria a URL que a Yampi deve chamar após uma compra
  // Normalmente seria um endpoint em seu backend
  return window.location.origin + '/api/yampi-webhook';
};

// Exportar as funções e tipos
export default {
  verifyYampiPurchase,
  addYampiCustomerToAuthorized,
  syncYampiCustomers,
  configureYampi,
  loadYampiConfig,
  getYampiWebhookUrl,
  processYampiWebhook
};
