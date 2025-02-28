
import React, { useEffect, useState } from 'react';
import InterpretationEditor from '@/components/admin/InterpretationEditor';
import InterpretationRecovery from '@/components/admin/InterpretationRecovery';
import SupabaseSetup from '@/components/admin/SupabaseSetup';
import EmailManager from '@/components/admin/EmailManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, isAdmin, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = () => {
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
        
        const adminCheck = isAdmin(email);
        console.log("Admin check for", email, "result:", adminCheck);
        
        if (!adminCheck) {
          console.log("Admin access denied: User is not admin");
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar esta página.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }
        
        // User is authenticated and is an admin
        setLoading(false);
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
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Carregando...</h1>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Painel de Administração</h1>
      
      <Tabs defaultValue="interpretations">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="interpretations" className="flex-1">Interpretações</TabsTrigger>
          <TabsTrigger value="database" className="flex-1">Banco de Dados</TabsTrigger>
          <TabsTrigger value="email" className="flex-1">Email</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default Admin;
