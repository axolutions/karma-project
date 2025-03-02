
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { 
  getAllAuthorizedEmails, 
  addAuthorizedEmail, 
  removeAuthorizedEmail,
  getAllUserDataByEmail,
  getEmailAuthCounts
} from '@/lib/auth';
import { X, Plus, Map } from 'lucide-react';

const EmailManager: React.FC = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [emailStats, setEmailStats] = useState<Record<string, number>>({});
  const [authCounts, setAuthCounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    refreshEmails();
  }, []);
  
  const refreshEmails = () => {
    const authorizedEmails = getAllAuthorizedEmails();
    setEmails(authorizedEmails);
    
    // Get authorization counts
    const counts = getEmailAuthCounts();
    setAuthCounts(counts);
    
    // Calculate how many maps each email has created
    const stats: Record<string, number> = {};
    authorizedEmails.forEach(email => {
      const userMaps = getAllUserDataByEmail();
      stats[email] = userMaps.filter(map => map.email === email).length;
    });
    
    setEmailStats(stats);
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
    
    // Add the email (or increment its auth count if it already exists)
    addAuthorizedEmail(newEmail.toLowerCase());
    
    toast({
      title: "Email autorizado",
      description: `O email ${newEmail} foi autorizado a criar um novo mapa.`
    });
    setNewEmail('');
    refreshEmails();
  };
  
  const handleRemoveEmail = (email: string) => {
    // Verificar se o email possui mapas criados
    const mapsCount = emailStats[email] || 0;
    
    if (mapsCount > 0) {
      if (!confirm(`Este email possui ${mapsCount} mapas criados. Remover este email impedirá o acesso a esses mapas. Deseja continuar?`)) {
        return;
      }
    }
    
    removeAuthorizedEmail(email);
    
    toast({
      title: "Email removido",
      description: `O email ${email} foi removido com sucesso.`
    });
    refreshEmails();
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
                <div className="flex items-center flex-wrap">
                  <span>{email}</span>
                  <div className="flex items-center ml-3 space-x-2">
                    {emailStats[email] > 0 && (
                      <div className="flex items-center text-xs bg-karmic-200 text-karmic-700 px-2 py-1 rounded-full">
                        <Map className="h-3 w-3 mr-1" />
                        {emailStats[email]} {emailStats[email] === 1 ? 'mapa criado' : 'mapas criados'}
                      </div>
                    )}
                    {(authCounts[email] || 0) > 0 && (
                      <div className="flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {authCounts[email]} {authCounts[email] === 1 ? 'acesso autorizado' : 'acessos autorizados'}
                      </div>
                    )}
                  </div>
                </div>
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
      
      <div className="mt-4 p-3 bg-karmic-50 border border-karmic-200 rounded-md">
        <h4 className="text-sm font-medium text-karmic-700 mb-2">Observações sobre emails</h4>
        <ul className="text-xs space-y-1 text-karmic-600 list-disc pl-4">
          <li>Cada email adicionado dá direito a criar um mapa kármico</li>
          <li>Para conceder acesso a um novo mapa, adicione o mesmo email novamente</li>
          <li>Quando um email é adicionado novamente, ele recebe permissão para criar um novo mapa</li>
          <li>O sistema agora rastreia quantos acessos cada email tem autorização para usar</li>
          <li>Remover um email impedirá que o usuário acesse todos os mapas criados com esse email</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailManager;
