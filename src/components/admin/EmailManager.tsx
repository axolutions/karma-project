
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { 
  getAllAuthorizedEmails, 
  addAuthorizedEmail, 
  removeAuthorizedEmail 
} from '@/lib/auth';
import { X, Plus, RefreshCw } from 'lucide-react';

const EmailManager: React.FC = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    refreshEmails();
  }, []);
  
  const refreshEmails = () => {
    setIsLoading(true);
    
    try {
      const currentEmails = getAllAuthorizedEmails();
      console.log("Emails carregados:", currentEmails);
      setEmails(currentEmails);
    } catch (error) {
      console.error("Erro ao carregar emails:", error);
      toast({
        title: "Erro ao carregar emails",
        description: "Não foi possível carregar a lista de emails autorizados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddEmail = () => {
    const trimmedEmail = newEmail.trim().toLowerCase();
    
    if (!trimmedEmail) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira um email para adicionar.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isValidEmail(trimmedEmail)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = addAuthorizedEmail(trimmedEmail);
      
      if (success) {
        toast({
          title: "Email adicionado",
          description: `O email ${trimmedEmail} foi adicionado com sucesso.`
        });
        setNewEmail('');
        refreshEmails();
      } else {
        toast({
          title: "Email já existe",
          description: `O email ${trimmedEmail} já está na lista.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar email:", error);
      toast({
        title: "Erro ao adicionar email",
        description: "Ocorreu um erro ao tentar adicionar o email.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveEmail = (email: string) => {
    setIsLoading(true);
    
    try {
      const success = removeAuthorizedEmail(email);
      
      if (success) {
        toast({
          title: "Email removido",
          description: `O email ${email} foi removido com sucesso.`
        });
        refreshEmails();
      } else {
        toast({
          title: "Erro ao remover",
          description: `Não foi possível remover o email ${email}.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao remover email:", error);
      toast({
        title: "Erro ao remover email",
        description: "Ocorreu um erro ao tentar remover o email.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddEmail();
    }
  };
  
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="email" className="text-sm font-medium text-karmic-700 block mb-2">
            Adicionar Email Autorizado
          </label>
          <Input
            id="email"
            type="email"
            placeholder="novocliente@email.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
        </div>
        <Button 
          type="button" 
          onClick={handleAddEmail}
          className="bg-karmic-600 hover:bg-karmic-700"
          disabled={isLoading}
        >
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
          {isLoading ? 'Processando...' : 'Adicionar'}
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-karmic-800">Emails Autorizados</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshEmails}
          disabled={isLoading}
          className="text-karmic-600 hover:text-karmic-700"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-6">
          <RefreshCw className="h-6 w-6 text-karmic-500 animate-spin" />
        </div>
      ) : emails.length === 0 ? (
        <p className="text-karmic-500 italic">Nenhum email autorizado cadastrado.</p>
      ) : (
        <ul className="space-y-2">
          {emails.map(email => (
            <li 
              key={email} 
              className="flex justify-between items-center p-3 bg-karmic-100 rounded-md"
            >
              <span>{email}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-karmic-600 hover:text-red-500 hover:bg-transparent"
                onClick={() => handleRemoveEmail(email)}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmailManager;
