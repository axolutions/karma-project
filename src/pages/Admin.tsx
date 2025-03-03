
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import EmailManager from '../components/admin/EmailManager';
import InterpretationEditor from '../components/admin/InterpretationEditor';
import YampiIntegration from '../components/admin/YampiIntegration';
import ElementorExport from '../components/admin/ElementorExport';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { LogOut, Home } from 'lucide-react';
import { Input } from '../components/ui/input';

export default function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já está autenticado pelo localStorage
    const savedAuth = localStorage.getItem('adminAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    console.log("Admin page loaded. Auth status:", savedAuth === 'true');
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    setError(null);
    
    // Simplified password for testing
    const correctPassword = "admin123";
    
    if (adminPassword === correctPassword) {
      localStorage.setItem('adminAuthenticated', 'true');
      setIsAuthenticated(true);
      toast.success("Login administrativo realizado com sucesso");
    } else {
      setError("Senha incorreta! Tente novamente.");
      toast.error("Senha incorreta! Tente novamente.");
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    toast.success("Sessão administrativa encerrada");
    navigate('/');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-primary">Acesso Administrativo</h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha de Administrador
              </label>
              <Input
                type="password"
                id="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full"
                placeholder="Digite a senha de administrador"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <Button
              onClick={handleLogin}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Entrar"}
            </Button>
            <p className="text-xs text-center text-gray-500 mt-2">
              A senha de administrador é: <strong>admin123</strong>
            </p>
            <Button 
              variant="outline" 
              onClick={handleGoToHome} 
              className="w-full mt-4"
            >
              <Home className="h-4 w-4 mr-2" /> Voltar para a Página Inicial
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Se estiver autenticado, mostrar o painel administrativo
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Painel Administrativo</h1>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleGoToHome}>
            <Home className="h-4 w-4 mr-2" /> Página Inicial
          </Button>
          <Button variant="outline" onClick={handleLogout} className="text-red-500 hover:text-red-700">
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="emails" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="emails">Gerenciar Emails</TabsTrigger>
          <TabsTrigger value="interpretations">Interpretações</TabsTrigger>
          <TabsTrigger value="yampi">Integração Yampi</TabsTrigger>
          <TabsTrigger value="elementor">Sistema Elementor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="emails" className="space-y-4">
          <EmailManager />
        </TabsContent>
        
        <TabsContent value="interpretations" className="space-y-4">
          <InterpretationEditor />
        </TabsContent>
        
        <TabsContent value="yampi" className="space-y-4">
          <YampiIntegration />
        </TabsContent>
        
        <TabsContent value="elementor" className="space-y-4">
          <ElementorExport />
        </TabsContent>
      </Tabs>
      
      <Separator className="my-8" />
      
      <Card className="p-4 bg-amber-50 border border-amber-200">
        <p className="text-amber-800 text-sm">
          <strong>Nota:</strong> Este painel é exclusivo para administradores. Todas as alterações feitas aqui afetarão a experiência do usuário final.
        </p>
      </Card>
    </div>
  );
}
