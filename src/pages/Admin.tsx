
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import EmailManager from '../components/admin/EmailManager';
import InterpretationEditor from '../components/admin/InterpretationEditor';
import YampiIntegration from '../components/admin/YampiIntegration';
import { ElementorExport } from '../components/admin/ElementorExport';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { LogOut } from 'lucide-react';

export default function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    toast.success("Sessão administrativa encerrada");
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Painel Administrativo</h1>
        <Button variant="outline" onClick={handleLogout} className="text-red-500 hover:text-red-700">
          <LogOut className="h-4 w-4 mr-2" /> Sair
        </Button>
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
