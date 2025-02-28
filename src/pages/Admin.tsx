
import React, { useEffect } from 'react';
import InterpretationEditor from '@/components/admin/InterpretationEditor';
import InterpretationRecovery from '@/components/admin/InterpretationRecovery';
import SupabaseSetup from '@/components/admin/SupabaseSetup';
import EmailManager from '@/components/admin/EmailManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = () => {
      const email = getCurrentUser();
      
      // Since isAdmin doesn't exist, we'll use a simpler check
      // Assuming admin emails have specific domains or are in a predefined list
      if (!email || !isAdminEmail(email)) {
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Helper function to check if email is admin
  const isAdminEmail = (email: string): boolean => {
    // For now, let's consider test@example.com as admin
    const adminEmails = ['test@example.com', 'admin@example.com'];
    return adminEmails.includes(email.toLowerCase());
  };
  
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
