
import React, { useEffect, useState } from 'react';
import InterpretationEditor from '@/components/admin/InterpretationEditor';
import InterpretationRecovery from '@/components/admin/InterpretationRecovery';
import SupabaseSetup from '@/components/admin/SupabaseSetup';
import EmailManager from '@/components/admin/EmailManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut, Database, Settings } from 'lucide-react';
import { checkConnection } from '@/lib/supabase';

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const email = getCurrentUser();
        
        if (!email) {
          console.log("Admin access denied: No user logged in");
          toast({
            title: "Acesso negado",
            description: "Faça login para acessar esta página.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        
        // Allowing any logged-in user to access the admin panel
        console.log("Admin access granted to:", email);
        setCurrentUser(email);
        setLoading(false);
        
        toast({
          title: "Acesso concedido",
          description: `Bem-vindo(a) ao painel administrativo, ${email}.`
        });
        
        // Verificar status da conexão
        const isConnected = await checkConnection();
        setConnectionStatus(isConnected);
        
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Erro de autenticação",
          description: "Ocorreu um erro ao verificar suas permissões.",
          variant: "destructive"
        });
        navigate('/');
      }
    };
    
    checkAuth();
    
    // Verificar conexão periodicamente
    const interval = setInterval(async () => {
      const isConnected = await checkConnection();
      setConnectionStatus(isConnected);
    }, 60000); // A cada minuto
    
    return () => clearInterval(interval);
  }, [navigate]);
  
  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair da área administrativa?")) {
      logout();
      navigate('/');
      toast({
        title: "Logout realizado",
        description: "Você saiu da área administrativa com sucesso."
      });
    }
  };
  
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Carregando...</h1>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto p-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel de Administração</h1>
        
        <div className="flex items-center gap-2">
          {connectionStatus !== null && (
            <div className={`text-sm ${connectionStatus ? 'text-green-600' : 'text-amber-600'} mr-2`}>
              {connectionStatus ? 'Conectado' : 'Modo Offline'}
            </div>
          )}
          
          {currentUser && (
            <div className="text-sm text-gray-600 mr-4">
              {currentUser}
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-1.5" /> Sair
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="interpretations">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="interpretations" className="flex-1">Interpretações</TabsTrigger>
          <TabsTrigger value="database" className="flex-1">
            <Database className="h-4 w-4 mr-1.5" /> Banco de Dados
          </TabsTrigger>
          <TabsTrigger value="email" className="flex-1">Email</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            <Settings className="h-4 w-4 mr-1.5" /> Configurações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="interpretations" className="space-y-6">
          <InterpretationEditor />
          <InterpretationRecovery />
        </TabsContent>
        
        <TabsContent value="database">
          <SupabaseSetup />
        </TabsContent>
        
        <TabsContent value="email">
          <EmailManager />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Configurações do Sistema</h2>
            
            <div className="space-y-4">
              <h3 className="font-medium">Informações do Usuário</h3>
              {currentUser && (
                <div className="bg-gray-50 p-3 rounded">
                  <p><strong>Email:</strong> {currentUser}</p>
                </div>
              )}
              
              <h3 className="font-medium mt-4">Ações</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (window.confirm("Limpar cache do navegador? Isso não afetará seus dados salvos.")) {
                      localStorage.removeItem('supabase-connection-status');
                      toast({
                        title: "Cache limpo",
                        description: "Cache de conexão limpo com sucesso."
                      });
                    }
                  }}
                >
                  Limpar Cache de Conexão
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Voltar para a Home
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-1.5" /> Encerrar Sessão
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
