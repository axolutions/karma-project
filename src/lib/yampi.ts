
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
  console.log('Configuração Yampi atualizada', config);
};

// Carregar configuração do localStorage
export const loadYampiConfig = (): YampiConfig | null => {
  const apiKey = localStorage.getItem('yampi_api_key');
  const productIdsStr = localStorage.getItem('yampi_product_ids');
  const checkoutUrl = localStorage.getItem('yampi_checkout_url');
  
  if (!apiKey || !productIdsStr) return null;
  
  try {
    const productIds = JSON.parse(productIdsStr);
    return {
      apiKey,
      productIds,
      checkoutUrl: checkoutUrl || undefined
    };
  } catch (e) {
    console.error('Erro ao carregar configuração Yampi:', e);
    return null;
  }
};

// Função para verificar se um email está em uma lista de compradores
// Na implementação real, isso faria uma chamada à API da Yampi
export const verifyYampiPurchase = async (email: string): Promise<boolean> => {
  // IMPORTANTE: Esta é uma implementação simulada
  // Na integração real, você deve conectar à API da Yampi
  console.log(`Verificando compra na Yampi para o email: ${email}`);
  
  try {
    const config = loadYampiConfig();
    if (!config) {
      console.warn('Configuração Yampi não encontrada');
      return false;
    }
    
    // Simular uma chamada à API
    // Em produção, substitua por uma chamada real à API da Yampi
    
    // Exemplo de código para implementação futura:
    /*
    const response = await fetch('https://api.yampi.com.br/v1/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Falha ao verificar compra na Yampi');
    }
    
    const data = await response.json();
    return data.some(order => 
      order.customer.email.toLowerCase() === email.toLowerCase() && 
      order.status === 'paid' &&
      order.items.some(item => config.productIds.includes(item.product_id))
    );
    */
    
    // Por enquanto, vamos apenas verificar a lista local de emails autorizados
    // Este código será substituído pela integração com a API Yampi
    const { isAuthorizedEmail } = await import('./auth');
    return isAuthorizedEmail(email);
    
  } catch (error) {
    console.error('Erro ao verificar compra na Yampi:', error);
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
  // IMPORTANTE: Esta é uma implementação simulada
  console.log('Iniciando sincronização com a Yampi...');
  
  try {
    const config = loadYampiConfig();
    if (!config) {
      console.warn('Configuração Yampi não encontrada');
      return { added: 0, failed: 0 };
    }
    
    // Aqui faria uma chamada à API da Yampi para obter todos os clientes
    // com compras válidas do produto específico
    
    // Exemplo (código a ser implementado):
    /*
    const response = await fetch('https://api.yampi.com.br/v1/customers', {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Falha ao sincronizar clientes da Yampi');
    }
    
    const customers = await response.json();
    
    // Filtrar apenas clientes com compras válidas
    const validCustomers = [];
    for (const customer of customers) {
      // Verificar se tem compra paga do produto específico
      const ordersResponse = await fetch(`https://api.yampi.com.br/v1/customers/${customer.id}/orders`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (ordersResponse.ok) {
        const orders = await ordersResponse.json();
        if (orders.some(order => 
          order.status === 'paid' && 
          order.items.some(item => config.productIds.includes(item.product_id))
        )) {
          validCustomers.push(customer);
        }
      }
    }
    
    // Adicionar emails à lista de autorizados
    let added = 0;
    let failed = 0;
    
    for (const customer of validCustomers) {
      const success = addAuthorizedEmail(customer.email);
      if (success) {
        added++;
      } else {
        failed++;
      }
    }
    
    return { added, failed };
    */
    
    // Implementação simulada para teste
    return { added: 0, failed: 0 };
    
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
  getYampiWebhookUrl
};
