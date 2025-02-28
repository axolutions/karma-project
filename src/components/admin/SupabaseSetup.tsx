
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkConnection, setupDatabase, attemptReconnect } from '@/lib/supabase';
import { AlertCircle, Check, Database, RefreshCw, Wifi, WifiOff, ExternalLink, Server } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const SupabaseSetup: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [setupAttempted, setSetupAttempted] = useState(false);
  const [lastAttemptTime, setLastAttemptTime] = useState<string | null>(null);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    setIsLoading(true);
    const status = await checkConnection();
    setIsConnected(status);
    setLastAttemptTime(new Date().toLocaleTimeString());
    setIsLoading(false);
  };

  const handleSetupDatabase = async () => {
    setIsLoading(true);
    setSetupAttempted(true);
    toast({
      title: "Tentando configurar banco de dados",
      description: "Aguarde enquanto tentamos configurar a conexão...",
    });

    const success = await setupDatabase();
    
    if (success) {
      await checkConnectionStatus();
      toast({
        title: "Configuração concluída",
        description: "Banco de dados configurado com sucesso!",
        variant: "default",
      });
    } else {
      toast({
        title: "Configuração falhou",
        description: "Não foi possível configurar o banco de dados automaticamente. Verifique o console para mais detalhes.",
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

  const checkSupabaseCredentials = () => {
    // Verificar se as credenciais do Supabase estão definidas
    if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return true;
    }
    return false;
  };

  const testInternet = async () => {
    try {
      const response = await fetch('https://www.google.com', { method: 'HEAD', mode: 'no-cors' });
      return true;
    } catch (error) {
      console.error('Teste de internet falhou:', error);
      return false;
    }
  };

  const runNetworkDiagnostic = async () => {
    setIsLoading(true);
    toast({
      title: "Diagnóstico de rede",
      description: "Executando testes de conectividade...",
    });

    // Verificar conexão com a internet
    const hasInternet = await testInternet();
    
    // Verificar credenciais do Supabase
    const hasCredentials = checkSupabaseCredentials();
    
    // Tentar conectar ao Supabase novamente
    const canConnectSupabase = await checkConnection();

    setIsConnected(canConnectSupabase);
    setLastAttemptTime(new Date().toLocaleTimeString());
    setIsLoading(false);

    toast({
      title: "Resultado do diagnóstico",
      description: `Internet: ${hasInternet ? '✅' : '❌'}, 
                   Credenciais: ${hasCredentials ? '✅' : '❌'}, 
                   Supabase: ${canConnectSupabase ? '✅' : '❌'}`,
      variant: hasInternet && hasCredentials && canConnectSupabase ? "default" : "destructive",
    });
  };

  const renderConnectionStatus = () => {
    if (isConnected === null) {
      return (
        <Alert className="bg-blue-50 border-blue-200">
          <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
          <AlertTitle>Verificando conexão com o Supabase...</AlertTitle>
          <AlertDescription>
            Aguarde enquanto verificamos a conexão com o seu banco de dados.
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
            Sua aplicação está conectada ao Supabase e a tabela de interpretações está configurada corretamente.
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
          <p>Não foi possível conectar ao Supabase ou a tabela de interpretações não existe.</p>
          {setupAttempted && <p className="text-red-600 font-medium">A tentativa automática de configuração falhou.</p>}
          {lastAttemptTime && <div className="text-xs mt-1 text-red-600">Última tentativa: {lastAttemptTime}</div>}
          <p className="mt-2 text-sm">
            Isso pode ocorrer por vários motivos:
          </p>
          <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
            <li>Problemas de conexão com a internet</li>
            <li>Servidor do Supabase indisponível</li>
            <li>Credenciais incorretas do Supabase</li>
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
          Configuração do Supabase
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
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-2">Instruções para configuração manual:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Acesse o painel do Supabase em <a href="https://app.supabase.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">app.supabase.io</a></li>
                  <li>Selecione seu projeto</li>
                  <li>Vá para a seção "SQL Editor"</li>
                  <li>Crie uma nova query</li>
                  <li>Cole o seguinte SQL e execute:</li>
                </ol>
                
                <div className="mt-2 bg-gray-100 p-3 rounded-md text-sm font-mono whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS public.interpretations (
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
  WITH CHECK (true);`}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={checkConnectionStatus}
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
                      <>Verificar novamente</>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href="https://app.supabase.io" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-4 w-4" /> Abrir Supabase
                    </a>
                  </Button>
                </div>
                
                <p className="mt-4 text-sm text-gray-600">
                  <strong>Nota:</strong> Mesmo sem conexão com o Supabase, suas interpretações estão salvas 
                  localmente no navegador. Você pode continuar trabalhando normalmente e tentar reconectar mais tarde.
                </p>
              </div>
            </div>
          )}
          
          {isConnected && (
            <div className="flex gap-3">
              <Button
                onClick={checkConnectionStatus}
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
                asChild
              >
                <a href="https://app.supabase.io" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-4 w-4" /> Abrir Supabase
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetup;
