import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  getAllAuthorizedEmails, 
  addAuthorizedEmail, 
  removeAuthorizedEmail,
  getAllUserDataByEmail,
  updateMapChoosen
} from '@/lib/auth';
import { X, Plus, Map, Zap, RefreshCw, AlertTriangle, Edit, Check } from 'lucide-react';
import { Json } from '@/integrations/supabase/database.types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EmailManager: React.FC = () => {
  const [emails, setEmails] = useState<{ email: string, essential: boolean, karmic_numbers: Json[], map_choosen: string | null }[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [emailStats, setEmailStats] = useState<Record<string, number>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    refreshEmails();
  }, []);
  
  const refreshEmails = async () => {
    setIsRefreshing(true);
    
    try {
      const authorizedEmails = await getAllAuthorizedEmails();
      console.log("Emails autorizados obtidos:", authorizedEmails);
      setEmails(authorizedEmails);
    } catch (error) {
      console.error("Erro ao atualizar emails:", error);
      toast.error("Erro ao carregar emails autorizados");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleAddEmail = async () => {
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
    
    try {
      await addAuthorizedEmail(normalizedEmail);
      
      toast.success("Email adicionado", {
        description: `O email ${normalizedEmail} foi adicionado com sucesso.`
      });
      setNewEmail('');
      refreshEmails();
    } catch (error) {
      console.error("Erro ao adicionar email:", error);
      toast.error("Erro ao adicionar email autorizado");
    }
  };
  
  const handleRemoveEmail = async (email: string) => {  
    try {
      await removeAuthorizedEmail(email);

      toast.success("Email removido", {
        description: `O email ${email} foi removido com sucesso.`
      });
      refreshEmails();
    } catch (error) {
      console.error("Erro ao remover email:", error);
      toast.error("Erro ao remover email autorizado");
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
  
  // Função para adicionar o email de exemplo
  const handleAddSampleEmail = () => {
    const sampleEmail = "projetovmtd@gmail.com";
    addAuthorizedEmail(sampleEmail);
    toast.success("Email de teste adicionado", {
      description: `O email ${sampleEmail} foi adicionado com sucesso.`
    });
    refreshEmails();
  };

  const handleChangeMapChoosen = async (email: string, mapChoosen: string | null) => {
    try {
      const success = await updateMapChoosen(email, mapChoosen);
      
      if (success) {
        toast.success("Mapa atualizado", {
          description: `O tipo de mapa para ${email} foi atualizado com sucesso.`
        });
        refreshEmails();
      } else {
        toast.error("Erro na atualização", {
          description: "Não foi possível atualizar o tipo de mapa."
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar tipo de mapa:", error);
      toast.error("Erro ao atualizar o tipo de mapa");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-karmic-800">
          Gerenciamento de Emails Autorizados
        </h3>
        <Button 
          onClick={refreshEmails} 
          variant="outline" 
          size="sm"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} /> 
          Atualizar
        </Button>
      </div>
      
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
            onKeyDown={handleKeyPress}
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
            <Zap className="h-3 w-3 mr-1" /> Adicionar email de exemplo (projetovmtd@gmail.com)
          </Button>
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-medium text-karmic-800 mb-3">Emails Autorizados</h3>
        {emails.length === 0 ? (
          <p className="text-karmic-500 italic">Nenhum email autorizado cadastrado.</p>
        ) : (
          <ul className="space-y-2">
            {emails.map(({email, essential, karmic_numbers, map_choosen}) => {
              return (
                <li 
                  key={email} 
                  className={`flex justify-between items-center p-3 rounded-md ${essential ? 'bg-blue-50' : 'bg-karmic-100'}`}
                >
                  <div className="flex items-center">
                    <span className={essential ? 'font-medium text-blue-700' : ''}>{email}</span>
                    {essential && (
                      <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                        Essencial
                      </span>
                    )}
                    {karmic_numbers?.length > 0 && (
                      <div className="ml-3 flex items-center">
                        <div className="flex items-center text-xs bg-karmic-200 text-karmic-700 px-2 py-1 rounded-full">
                          <Map className="h-3 w-3 mr-1" />
                          <span>Mapa</span>
                          (
                            <span className="ml-1 font-medium">
                              {
                                map_choosen === "professional" ? "Profissional" :
                                map_choosen === "love" ? "Amor" : "Pessoal"
                              }
                            </span>
                          )
                        </div>
                      </div>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="ml-1 p-0 h-auto"
                        >
                          <Edit className="h-3 w-3 text-karmic-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Tipo de Mapa</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem onClick={() => handleChangeMapChoosen(email, "professional")}>
                          {map_choosen === "professional" && <Check className="mr-2 h-4 w-4" />}
                          Profissional
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleChangeMapChoosen(email, "love")}>
                          {map_choosen === "love" && <Check className="mr-2 h-4 w-4" />}
                          Amor
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleChangeMapChoosen(email, null)}>
                          {!map_choosen && <Check className="mr-2 h-4 w-4" />}
                          Pessoal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`hover:bg-transparent ${essential ? 'text-blue-400 hover:text-blue-600' : 'text-karmic-600 hover:text-red-500'}`}
                    onClick={() => !essential && setEmailToDelete(email)}
                    disabled={essential}
                    title={essential ? "Este email não pode ser removido" : "Remover email"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      
      <Dialog open={!!emailToDelete} onOpenChange={(open) => !open && setEmailToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-karmic-800">Confirmar exclusão</DialogTitle>
            <DialogDescription className="pt-2">
              Você tem certeza que deseja remover o email:
              <div className="mt-2 p-2 bg-karmic-50 border border-karmic-100 rounded-md font-medium text-karmic-800">
                {emailToDelete}
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mt-2 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              O usuário perderá acesso ao seu mapa kármico criado com este email.
              Esta ação não pode ser desfeita.
            </div>
          </div>
          
          <DialogFooter className="mt-4 gap-2">
            <Button 
              variant="outline" 
              onClick={() => setEmailToDelete(null)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (emailToDelete) {
                  handleRemoveEmail(emailToDelete);
                  setEmailToDelete(null);
                }
              }}
            >
              Remover email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="mt-4 p-3 bg-karmic-50 border border-karmic-200 rounded-md">
        <h4 className="text-sm font-medium text-karmic-700 mb-2">Observações sobre emails</h4>
        <ul className="text-xs space-y-1 text-karmic-600 list-disc pl-4">
          <li>Cada email adicionado dá direito a criar um mapa kármico</li>
          <li>Para conceder acesso a um novo mapa, adicione o mesmo email novamente</li>
          <li>Quando um email é adicionado novamente, ele recebe permissão para criar um novo mapa</li>
          <li>Remover um email impedirá que o usuário acesse todos os mapas criados com esse email</li>
          <li className="text-blue-600 font-medium">Os emails essenciais do sistema (marcados em azul) não podem ser removidos</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailManager;
