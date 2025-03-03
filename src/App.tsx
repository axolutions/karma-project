
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
import { useEffect } from "react";

const queryClient = new QueryClient();

// Protected route component for users
const ProtectedUserRoute = ({ children }: { children: React.ReactNode }) => {
  // Modified to ensure proper redirection
  if (!isLoggedIn()) {
    console.log("Usuário não autenticado. Redirecionando para a página inicial.");
    return <Navigate to="/" replace />;
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
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
