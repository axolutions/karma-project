
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailManager from '@/components/admin/EmailManager';
import InterpretationEditor from '@/components/admin/InterpretationEditor';
import YampiIntegration from '@/components/admin/YampiIntegration';
import { Users, Book, LockKeyhole, ShoppingCart, Download, Code } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { getUserData } from '@/lib/auth';

// Constante para armazenar a senha de administrador
const ADMIN_PASSWORD = "matrizkarmicaADMIN2025"; // Esta senha deve ser alterada para produção

const Admin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já está autenticado na sessão
    const adminAuth = sessionStorage.getItem('adminAuthorized');
    if (adminAuth === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Verificar a senha
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthorized(true);
        sessionStorage.setItem('adminAuthorized', 'true');
        toast({
          title: "Acesso autorizado",
          description: "Bem-vindo ao painel administrativo."
        });
      } else {
        toast({
          title: "Acesso negado",
          description: "Senha incorreta. Tente novamente.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    sessionStorage.removeItem('adminAuthorized');
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo."
    });
  };

  const handleDownloadFullHTML = () => {
    try {
      // Capturar o HTML atual da página principal (matriz kármica)
      // Vamos abrir a página em uma nova aba e capturar seu HTML
      window.open('/matrix', '_blank');
      
      toast({
        title: "Página aberta",
        description: "A página da matriz foi aberta em uma nova aba. Você pode salvar o HTML usando o menu do navegador (Ctrl+S)."
      });
    } catch (err) {
      console.error("Erro ao tentar abrir página:", err);
      toast({
        title: "Erro",
        description: "Não foi possível abrir a página da matriz em uma nova aba.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-karmic-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-karmic-100 rounded-full mb-4">
                <LockKeyhole className="h-8 w-8 text-karmic-700" />
              </div>
              <h1 className="text-2xl font-serif font-medium text-karmic-800 mb-2">
                Acesso Administrativo
              </h1>
              <p className="text-karmic-600">
                Digite a senha para acessar o painel.
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="text-sm font-medium text-karmic-700 block mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-karmic-300 rounded-md focus:ring-karmic-500 focus:border-karmic-500"
                  placeholder="••••••••••••"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="karmic-button w-full"
                disabled={isLoading}
              >
                {isLoading ? "Verificando..." : "Acessar Painel"}
              </Button>
              
              <div className="text-center mt-4">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => navigate('/')}
                  className="text-karmic-600 hover:text-karmic-800"
                >
                  Voltar para o site
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-medium text-karmic-800 mb-2">
              Painel Administrativo
            </h1>
            <p className="text-karmic-600">
              Gerencie emails autorizados e interpretações da Matriz Kármica.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={handleDownloadFullHTML} 
              variant="outline" 
              className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
            >
              <Code className="h-4 w-4" />
              Ver Matriz em Nova Aba
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="karmic-button-outline"
            >
              Sair
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-karmic-200">
          <Tabs defaultValue="emails" className="space-y-6">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="emails" className="flex items-center justify-center">
                <Users className="h-4 w-4 mr-2" />
                Emails Autorizados
              </TabsTrigger>
              <TabsTrigger value="interpretations" className="flex items-center justify-center">
                <Book className="h-4 w-4 mr-2" />
                Interpretações
              </TabsTrigger>
              <TabsTrigger value="yampi" className="flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Integração Yampi
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="emails">
              <EmailManager />
            </TabsContent>
            
            <TabsContent value="interpretations">
              <InterpretationEditor />
            </TabsContent>
            
            <TabsContent value="yampi">
              <YampiIntegration />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
