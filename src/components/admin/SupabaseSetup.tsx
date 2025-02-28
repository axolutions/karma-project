
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkConnection, setupDatabase } from '@/lib/supabase';
import { AlertCircle, Check, Database, RefreshCw } from 'lucide-react';

const SupabaseSetup: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [setupAttempted, setSetupAttempted] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    setIsLoading(true);
    const status = await checkConnection();
    setIsConnected(status);
    setIsLoading(false);
  };

  const handleSetupDatabase = async () => {
    setIsLoading(true);
    setSetupAttempted(true);
    const success = await setupDatabase();
    
    if (success) {
      await checkConnectionStatus();
    }
    
    setIsLoading(false);
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
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <AlertTitle>Problemas com a conexão</AlertTitle>
        <AlertDescription>
          Não foi possível conectar ao Supabase ou a tabela de interpretações não existe.
          {setupAttempted ? ' A tentativa automática de configuração falhou.' : ' Tente configurar automaticamente abaixo.'}
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
            <div>
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
                  <>Configurar Banco de Dados Automaticamente</>
                )}
              </Button>
              
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
                
                <Button
                  onClick={checkConnectionStatus}
                  variant="outline"
                  className="mt-4"
                  disabled={isLoading}
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
              </div>
            </div>
          )}
          
          {isConnected && (
            <Button
              onClick={checkConnectionStatus}
              variant="outline"
              disabled={isLoading}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetup;
