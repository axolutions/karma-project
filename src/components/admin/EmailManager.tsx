
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { 
  getAllAuthorizedEmails, 
  addAuthorizedEmail, 
  removeAuthorizedEmail 
} from '@/lib/auth';
import { X, Plus } from 'lucide-react';

const EmailManager: React.FC = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  
  useEffect(() => {
    refreshEmails();
  }, []);
  
  const refreshEmails = () => {
    setEmails(getAllAuthorizedEmails());
  };
  
  const handleAddEmail = () => {
    if (!newEmail.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira um email para adicionar.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isValidEmail(newEmail)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    const success = addAuthorizedEmail(newEmail);
    
    if (success) {
      toast({
        title: "Email adicionado",
        description: `O email ${newEmail} foi adicionado com sucesso.`
      });
      setNewEmail('');
      refreshEmails();
    } else {
      toast({
        title: "Email já existe",
        description: `O email ${newEmail} já está na lista.`,
        variant: "destructive"
      });
    }
  };
  
  const handleRemoveEmail = (email: string) => {
    const success = removeAuthorizedEmail(email);
    
    if (success) {
      toast({
        title: "Email removido",
        description: `O email ${email} foi removido com sucesso.`
      });
      refreshEmails();
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
          />
        </div>
        <Button 
          type="button" 
          onClick={handleAddEmail}
          className="bg-karmic-600 hover:bg-karmic-700"
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-karmic-800 mb-3">Emails Autorizados</h3>
        {emails.length === 0 ? (
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
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmailManager;
