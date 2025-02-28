
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  checkConnection, 
  setupDatabase, 
  attemptReconnect, 
  diagnoseConnection 
} from '@/lib/supabase';
import { 
  AlertCircle, Check, Database, RefreshCw, Wifi, WifiOff, 
  ExternalLink, Server, Shield, CheckCircle, Settings 
} from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { supabaseClient } from '@/lib/supabase';

const SupabaseSetup: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [setupAttempted, setSetupAttempted] = useState(false);
  const [lastAttemptTime, setLastAttemptTime] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);

  useEffect(() => {
    checkConnectionStatus();
    
    // Verificar a cada 30 segundos
    const interval = setInterval(() => {
      checkConnectionStatus(false);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkConnectionStatus = async (showToast = true) => {
    setIsLoading(true);
    const status = await checkConnection();
    setIsConnected(status);
    setLastAttemptTime(new Date().toLocaleTimeString());
    
    if (showToast) {
      if (status) {
        toast({
          title: "Conexão estabelecida",
          description: "Conectado ao banco de dados com sucesso.",
        });
      } else {
        toast({
          title: "Sem conexão",
          description: "Não foi possível conectar ao banco de dados. Os dados estão sendo salvos localmente.",
          variant: "destructive"
        });
      }
    }
    
    setIsLoading(false);
  };

  const handleCheckConnection = () => {
    checkConnectionStatus(true);
  };

  const handleSetupDatabase = async () => {
    setIsLoading(true);
    setSetupAttempted(true);
    toast({
      title: "Configurando banco de dados",
      description: "Aguarde enquanto tentamos estabelecer conexão...",
    });

    const success = await setupDatabase();
    
    if (success) {
      await checkConnectionStatus(false);
      toast({
        title: "Configuração concluída",
        description: "Banco de dados configurado com sucesso!",
        variant: "default",
      });
    } else {
      toast({
        title: "Configuração falhou",
        description: "Não foi possível configurar o banco de dados. Verifique sua conexão e tente novamente.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleReconnect = async () => {
    setIsLoading(true);
    toast({
      title: "Tentando reconectar",
      description: "Aguarde enquanto tentamos restabelecer a conexão...",
    });

    const success = await attemptReconnect();
    setIsConnected(success);
    
    setIsLoading(false);
    setLastAttemptTime(new Date().toLocaleTimeString());
  };

  const runNetworkDiagnostic = async () => {
    setIsLoading(true);
    toast({
      title: "Diagnóstico de rede",
      description: "Executando testes de conectividade...",
    });

    // Diagnóstico completo
    const diagnosis = await diagnoseConnection();
    setDiagnosisResult(diagnosis);
    
    setIsConnected(diagnosis.canReachSupabase && diagnosis.setupSuccess);
    setLastAttemptTime(new Date().toLocaleTimeString());
    setIsLoading(false);

    toast({
      title: "Resultado do diagnóstico",
      description: `Internet: ${diagnosis.hasInternet ? '✅' : '❌'}, 
                   Supabase: ${diagnosis.canReachSupabase ? '✅' : '❌'}, 
                   Banco: ${diagnosis.setupSuccess ? '✅' : '❌'}`,
      variant: diagnosis.hasInternet && diagnosis.canReachSupabase && diagnosis.setupSuccess ? "default" : "destructive",
    });
  };
  
  const testDirectConnection = async () => {
    setIsLoading(true);
    toast({
      title: "Teste direto",
      description: "Tentando conexão direta com o servidor...",
    });
    
    try {
      // Testar com função de tabela
      const { error } = await supabaseClient.from('interpretations').select('count(*)');
      
      if (!error) {
        toast({
          title: "Conexão direta bem-sucedida",
          description: "Conseguimos conectar diretamente ao servidor. Recomendamos que você atualize a página agora.",
          duration: 8000
        });
        setIsConnected(true);
      } else {
        console.error("Erro na conexão direta:", error);
        toast({
          title: "Falha na conexão direta",
          description: `Erro: ${error.message}`,
          variant: "destructive"
        });
      }
    } catch (e) {
      console.error("Exceção na conexão direta:", e);
      toast({
        title: "Erro na conexão direta",
        description: "Ocorreu um erro ao tentar conexão direta.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const forceReset = () => {
    if (window.confirm("Isso irá reiniciar todas as configurações de conexão. Continuar?")) {
      localStorage.removeItem('supabase-connection');
      window.location.reload();
    }
  };

  const renderConnectionStatus = () => {
    if (isConnected === null) {
      return (
        <Alert className="bg-blue-50 border-blue-200">
          <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
          <AlertTitle>Verificando conexão com o banco de dados...</AlertTitle>
          <AlertDescription>
            Aguarde enquanto verificamos a conexão.
          </AlertDescription>
        </Alert>
      );
    }

    if (isConnected) {
      return (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-5 w-5 text-green-500" />
          <AlertTitle>Conexão estabelecida!</AlertTitle>
          <AlertDescription>
            Sua aplicação está conectada ao banco de dados e a sincronização está funcionando corretamente.
            {lastAttemptTime && <div className="text-xs mt-1 text-green-600">Última verificação: {lastAttemptTime}</div>}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <AlertTitle>Problemas com a conexão</AlertTitle>
        <AlertDescription>
          <p>Não foi possível conectar ao banco de dados. Seus dados estão sendo salvos localmente para evitar perdas.</p>
          {setupAttempted && <p className="text-red-600 font-medium">A tentativa automática de configuração falhou.</p>}
          {lastAttemptTime && <div className="text-xs mt-1 text-red-600">Última tentativa: {lastAttemptTime}</div>}
          <p className="mt-2 text-sm">
            Isso pode ocorrer por vários motivos:
          </p>
          <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
            <li>Problemas com a conexão de internet</li>
            <li>Servidor indisponível temporariamente</li>
            <li>Erro de configuração no servidor</li>
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Database className="mr-2 h-5 w-5 text-karmic-600" />
          Configuração do Banco de Dados
        </h2>
        
        <div className="mb-6">
          {renderConnectionStatus()}
        </div>
        
        <div className="space-y-4">
          {!isConnected && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={handleSetupDatabase} 
                  disabled={isLoading}
                  className="bg-karmic-600 hover:bg-karmic-700"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Configurando...
                    </>
                  ) : (
                    <><Server className="mr-2 h-4 w-4" /> Configurar Banco de Dados</>
                  )}
                </Button>
                
                <Button 
                  onClick={handleReconnect}
                  disabled={isLoading}
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Reconectando...
                    </>
                  ) : (
                    <><Wifi className="mr-2 h-4 w-4" /> Reconectar</>
                  )}
                </Button>
                
                <Button
                  onClick={runNetworkDiagnostic}
                  disabled={isLoading}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Diagnosticando...
                    </>
                  ) : (
                    <>Diagnóstico de Rede</>
                  )}
                </Button>
                
                <Button
                  onClick={testDirectConnection}
                  disabled={isLoading}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    <><Shield className="mr-2 h-4 w-4" /> Teste Direto</>
                  )}
                </Button>
              </div>
              
              {diagnosisResult && (
                <div className="bg-gray-50 border rounded-md p-4 mt-4">
                  <h3 className="font-medium mb-2 text-sm">Resultado do diagnóstico:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      {diagnosisResult.hasInternet ? 
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : 
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />}
                      Internet: {diagnosisResult.hasInternet ? 'Conectado' : 'Sem conexão'}
                    </li>
                    <li className="flex items-center">
                      {diagnosisResult.canReachSupabase ? 
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : 
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />}
                      Servidor: {diagnosisResult.canReachSupabase ? 'Acessível' : 'Inacessível'}
                    </li>
                    <li className="flex items-center">
                      {diagnosisResult.setupSuccess ? 
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : 
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />}
                      Banco de dados: {diagnosisResult.setupSuccess ? 'Configurado' : 'Não configurado'}
                    </li>
                    <li className="flex items-center">
                      <Settings className="h-4 w-4 text-gray-500 mr-2" />
                      Tentativas: {diagnosisResult.errorCount}
                    </li>
                  </ul>
                </div>
              )}
              
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-2">Instruções para resolução de problemas:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Verifique se sua conexão com a internet está funcionando</li>
                  <li>Tente recarregar a página (F5 ou Ctrl+R)</li>
                  <li>Clique nos botões "Reconectar" ou "Teste Direto" acima</li>
                  <li>Se o problema persistir, tente o botão "Configurar Banco de Dados"</li>
                  <li>Em último caso, limpe o cache do navegador e tente novamente</li>
                </ol>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    onClick={handleCheckConnection}
                    variant="outline"
                    disabled={isLoading}
                    size="sm"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>Verificar conexão novamente</>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={forceReset}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Reiniciar configurações
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href="https://app.supabase.io" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-4 w-4" /> Abrir Dashboard
                    </a>
                  </Button>
                </div>
                
                <p className="mt-4 text-sm text-gray-600">
                  <strong>Nota:</strong> Mesmo sem conexão com o banco de dados, suas interpretações estão salvas 
                  localmente no navegador. Você pode continuar trabalhando normalmente e a 
                  sincronização ocorrerá automaticamente quando a conexão for restabelecida.
                </p>
              </div>
            </div>
          )}
          
          {isConnected && (
            <div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleCheckConnection}
                  variant="outline"
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>Verificar conexão</>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runNetworkDiagnostic}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Diagnosticando...
                    </>
                  ) : (
                    <>Diagnóstico completo</>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href="https://app.supabase.io" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1 h-4 w-4" /> Abrir Dashboard
                  </a>
                </Button>
              </div>
              
              <Alert className="mt-4 bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-700">Tudo funcionando corretamente</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Seu banco de dados está configurado e funcionando normalmente. Todos os dados estão sendo sincronizados automaticamente.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetup;
