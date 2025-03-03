
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  getAllAuthorizedEmails, 
  addAuthorizedEmail, 
  removeAuthorizedEmail,
  getAllUserDataByEmail
} from '@/lib/auth';
import { X, Plus, Map, Zap } from 'lucide-react';

const EmailManager: React.FC = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [emailStats, setEmailStats] = useState<Record<string, number>>({});
  
  useEffect(() => {
    refreshEmails();
    
    // Verificar se existe algum email cadastrado
    // Se não existir, podemos inicializar com um email padrão para testes
    const authorizedEmails = getAllAuthorizedEmails();
    if (authorizedEmails.length === 0) {
      console.log("Nenhum email autorizado encontrado. Inicializando sistema...");
    }
  }, []);
  
  const refreshEmails = () => {
    const authorizedEmails = getAllAuthorizedEmails();
    setEmails(authorizedEmails);
    
    // Calcular estatísticas - quantos mapas cada email possui
    const stats: Record<string, number> = {};
    authorizedEmails.forEach(email => {
      const userMaps = getAllUserDataByEmail(email) || [];
      const normalizedEmail = email.toLowerCase();
      stats[email] = userMaps.filter(map => map.email && map.email.toLowerCase() === normalizedEmail).length;
    });
    
    setEmailStats(stats);
  };
  
  const handleAddEmail = () => {
    if (!newEmail.trim()) {
      toast.error("Email obrigatório", {
        description: "Por favor, insira um email para adicionar."
      });
      return;
    }
    
    if (!isValidEmail(newEmail)) {
      toast.error("Email inválido", {
        description: "Por favor, insira um email válido."
      });
      return;
    }
    
    // Normaliza o email para minúsculas
    const normalizedEmail = newEmail.toLowerCase().trim();
    
    // Verificar se o email já existe na lista
    const emailExists = emails.some(e => e.toLowerCase() === normalizedEmail);
    
    // Se o email já existe, perguntar se deseja conceder um novo acesso
    if (emailExists) {
      const existingMaps = getAllUserDataByEmail(normalizedEmail) || [];
      
      if (existingMaps.length > 0) {
        const confirmAdd = confirm(
          `O email ${normalizedEmail} já está na lista e possui ${existingMaps.length} mapa(s) criado(s). ` +
          `Adicioná-lo novamente concederá permissão para criar um novo mapa. Deseja continuar?`
        );
        
        if (!confirmAdd) {
          return;
        }
        
        // Se confirmou, remova primeiro para depois adicionar novamente
        // Isso simula a renovação do acesso
        removeAuthorizedEmail(normalizedEmail);
      }
    }
    
    // Adicionar o email à lista de autorizados
    addAuthorizedEmail(normalizedEmail);
    
    toast.success("Email adicionado", {
      description: `O email ${normalizedEmail} foi adicionado com sucesso.`
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
    
    toast.success("Email removido", {
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
  
  // Função para adicionar o email de exemplo
  const handleAddSampleEmail = () => {
    const sampleEmail = "carlamaiaprojetos@gmail.com";
    addAuthorizedEmail(sampleEmail);
    toast.success("Email de teste adicionado", {
      description: `O email ${sampleEmail} foi adicionado com sucesso.`
    });
    refreshEmails();
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
      
      {emails.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h3 className="text-amber-800 text-sm font-medium mb-2">Nenhum email cadastrado</h3>
          <p className="text-amber-700 text-xs mb-3">
            Você precisa adicionar pelo menos um email autorizado para que os usuários possam fazer login.
          </p>
          <Button 
            onClick={handleAddSampleEmail} 
            variant="outline"
            className="bg-white border-amber-300 text-amber-700 hover:bg-amber-100 text-xs"
          >
            <Zap className="h-3 w-3 mr-1" /> Adicionar email de exemplo (carlamaiaprojetos@gmail.com)
          </Button>
        </div>
      )}
      
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
                <div className="flex items-center">
                  <span>{email}</span>
                  {emailStats[email] > 0 && (
                    <div className="ml-3 flex items-center text-xs bg-karmic-200 text-karmic-700 px-2 py-1 rounded-full">
                      <Map className="h-3 w-3 mr-1" />
                      {emailStats[email]} {emailStats[email] === 1 ? 'mapa' : 'mapas'}
                    </div>
                  )}
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
          <li>Remover um email impedirá que o usuário acesse todos os mapas criados com esse email</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailManager;
