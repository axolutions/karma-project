
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import MatrixResult from "./pages/MatrixResult";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { isLoggedIn } from "./lib/auth";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Protected route component for users
const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  // Verificação mais robusta de autenticação
  if (!isLoggedIn()) {
    console.log("Usuário não autenticado. Redirecionando para a página inicial.");
    return <Navigate to="/" replace />;
  }
  
  // Verificar se o usuário tem um email armazenado
  const userEmail = localStorage.getItem('currentUser');
  if (!userEmail) {
    console.log("Email do usuário não encontrado. Redirecionando para a página inicial.");
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Componente de rota protegida para administradores
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Verificar se já está autenticado pelo localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleLogin = () => {
    // Senha simples para demonstração - em produção, use um sistema mais robusto
    if (adminPassword === "admin123") {
      localStorage.setItem('adminAuthenticated', 'true');
      setIsAuthenticated(true);
    } else {
      alert("Senha incorreta!");
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-karmic-700">Acesso Administrativo</h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha de Administrador
              </label>
              <input
                type="password"
                id="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Digite a senha de administrador"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-karmic-600 text-white py-2 px-4 rounded-md hover:bg-karmic-700"
            >
              Entrar
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Para fins de teste, use a senha: admin123
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

// Custom hook para configurar o domínio na inicialização
const useDomainConfig = () => {
  useEffect(() => {
    // Definir o domínio principal para integrações futuras
    // Este valor poderia ser obtido de uma variável de ambiente ou arquivo de configuração
    const primaryDomain = window.location.hostname;
    
    // Armazenar o domínio para uso posterior se necessário
    localStorage.setItem('appDomain', primaryDomain);
    
    // Aqui pode ser adicionada qualquer lógica específica do domínio
    console.log(`Aplicativo inicializado no domínio: ${primaryDomain}`);
  }, []);
};

const App = () => {
  // Inicializar configuração de domínio
  useDomainConfig();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/matrix" 
              element={
                <ProtectedUserRoute>
                  <MatrixResult />
                </ProtectedUserRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <Admin />
                </ProtectedAdminRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
