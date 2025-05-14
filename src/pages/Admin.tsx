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
import { Auth } from '@supabase/auth-ui-react'
import {  ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { i18n_ptbr } from '../i18n/pt-br';
import { KarmicMapSelection } from '@/components/KarmicMapSelection';

export default function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const navigate = useNavigate();

  const session = useAuth();

  const handleLogout = async () => {
    localStorage.removeItem('adminAuthenticated');
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Erro ao encerrar sessão administrativa:", error);
      toast.error("Erro ao encerrar sessão administrativa");
    }
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  // * Supabase Auth Error Message Translation
  useEffect(() => {
    if (session) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== "childList" || mutation.addedNodes.length === 0)
          return;

        for (const node of mutation.addedNodes) {
          if (
            node instanceof HTMLElement &&
            (node.classList.contains("supabase-account-ui_ui-message") ||
              node.classList.contains("supabase-auth-ui_ui-message"))
          ) {
            const originErrorMessage = node.innerHTML.trim();

            const translatedErrorMessage = i18n_ptbr.error_messages[originErrorMessage] ?? i18n_ptbr.error_messages.generic;

            if (!document.querySelector("#auth-forgot-password")) {
              node.innerHTML = translatedErrorMessage;
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-primary">
            Acesso Administrativo
          </h1>
          
          <Auth
            supabaseClient={supabase} 
            localization={{ variables: i18n_ptbr }}
            showLinks={false} 
            appearance={{ theme: ThemeSupa, style: { button: { background: "#898078" } }}}
            providers={[]} 
          />
        <Button 
          variant="outline" 
          onClick={handleGoToHome} 
          className="w-full mt-4"
        >
          <Home className="h-4 w-4 mr-2" /> Voltar para a Página Inicial
        </Button>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, mostrar tela de login
  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
  //         <h1 className="text-2xl font-bold text-center mb-6 text-primary">Acesso Administrativo</h1>
  //         <div className="space-y-4">
  //           <div>
  //             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
  //               Senha de Administrador
  //             </label>
  //             <Input
  //               type="password"
  //               id="password"
  //               value={adminPassword}
  //               onChange={(e) => setAdminPassword(e.target.value)}
  //               className="w-full"
  //               placeholder="Digite a senha de administrador"
  //               onKeyDown={(e) => {
  //                 if (e.key === 'Enter') {
  //                   handleLogin();
  //                 }
  //               }}
  //             />
  //           </div>
  //           {error && (
  //             <p className="text-sm text-red-500">{error}</p>
  //           )}
  //           <Button
  //             onClick={handleLogin}
  //             className="w-full"
  //             disabled={isLoading}
  //           >
  //             {isLoading ? "Verificando..." : "Entrar"}
  //           </Button>
  //           <Button 
  //             variant="outline" 
  //             onClick={handleGoToHome} 
  //             className="w-full mt-4"
  //           >
  //             <Home className="h-4 w-4 mr-2" /> Voltar para a Página Inicial
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Se estiver autenticado, mostrar o painel administrativo
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Alerta chamativo para Dona Carla */}
      {/* <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-md animate-pulse">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Mensagem para Dona Carla</h3>
            <div className="mt-2 text-red-700">
              <p className="font-medium">Oi dona Carla, tudo bem? Está tudo certo com o sistema?</p>
              <p className="mt-1">Como não tenho nenhum meio de contato com a senhora pensei em criar essa mensagem, se puder me mandar uma mensagem no whatsapp haha, +55 (11) 98320-7820</p>
            </div>
          </div>
        </div>
      </div> */}

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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="emails">Gerenciar Emails</TabsTrigger>
          <TabsTrigger value="interpretations">Interpretações</TabsTrigger>
          <TabsTrigger value="yampi">Integração Yampi</TabsTrigger>
          <TabsTrigger value="karmic_maps">Seleção de mapas</TabsTrigger>
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

        <TabsContent value="karmic_maps" className="space-y-4">
          <KarmicMapSelection/>
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
