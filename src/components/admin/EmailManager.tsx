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

const EmailManager: React.FC = () => {
  const [emails, setEmails] = useState<{ 
    email: string, 
    essential: boolean, 
    karmic_numbers: Json[], 
    map_choosen: string | null,
    maps_available: string[] | null 
  }[]>([]);
  const [newEmail, setNewEmail] = useState('');
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

  const handleToggleMap = async (email: string, mapType: string, currentMapsAvailable: string[] | null, currentMapChoosen: string | null) => {
    try {
      // Initialize maps array if null
      let mapsAvailable = currentMapsAvailable ? [...currentMapsAvailable] : [];
      
      // Check if map is already selected
      const mapIndex = mapsAvailable.indexOf(mapType);
      
      // Toggle map selection
      if (mapIndex >= 0) {
        // Remove map if already selected
        mapsAvailable.splice(mapIndex, 1);
      } else {
        // Add map if not selected
        mapsAvailable.push(mapType);
      }
      
      // Set the current map as the chosen one if adding a new map
      const newMapChoosen = mapIndex >= 0 ? 
        (mapsAvailable.length > 0 ? mapsAvailable[mapsAvailable.length - 1] : null) : 
        mapType;
      
      const success = await updateMapChoosen(email, newMapChoosen, mapsAvailable);
      
      if (success) {
        toast.success("Mapas atualizados", {
          description: `Os mapas para ${email} foram atualizados com sucesso.`
        });
        refreshEmails();
      } else {
        toast.error("Erro na atualização", {
          description: "Não foi possível atualizar os mapas."
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar mapas:", error);
      toast.error("Erro ao atualizar os mapas");
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
            {emails.map(({email, essential, karmic_numbers, map_choosen, maps_available}) => {
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
                          <span>Mapas disponíveis: {" "}</span>
                          <span className='ml-1 font-medium'>
                            {maps_available && maps_available.length > 0 ? 
                              maps_available.map(map => 
                                map === "professional" ? "Profissional" : 
                                map === "love" ? "Amor" : "Pessoal"
                              ).join(", ") : 
                              "Nenhum"
                            }
                            {map_choosen && <span className="ml-1">(Atual: {
                              map_choosen === "professional" ? "Profissional" :
                              map_choosen === "love" ? "Amor" : "Pessoal"
                            })</span>}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="ml-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="p-1"
                        onClick={() => {
                          const dialog = document.getElementById(`map-dialog-${email}`);
                          if (dialog instanceof HTMLDialogElement) {
                            dialog.showModal();
                          }
                        }}
                      >
                        <Edit className="h-3 w-3 text-karmic-600" />
                      </Button>
                      
                      <dialog 
                        id={`map-dialog-${email}`} 
                        className="p-4 rounded-lg shadow-lg border border-karmic-200 backdrop:bg-gray-900/50"
                      >
                        <div className="w-64">
                          <h4 className="text-lg font-medium mb-3">Mapas disponíveis</h4>
                          <div className="space-y-2 mb-4">
                            {['professional', 'love', null].map((mapType) => {
                              const mapName = mapType === 'professional' ? 'Profissional' : 
                                             mapType === 'love' ? 'Amor' : 'Pessoal';
                              const isSelected = maps_available?.includes(mapType as string) || 
                                                (mapType === null && maps_available?.includes('personal'));
                              
                              return (
                                <label key={mapType || 'personal'} className="flex items-center space-x-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="rounded border-karmic-300 text-karmic-600 focus:ring-karmic-500"
                                    checked={isSelected}
                                    onChange={() => handleToggleMap(
                                      email, 
                                      mapType || 'personal', 
                                      maps_available, 
                                      map_choosen
                                    )}
                                  />
                                  <span>{mapName}</span>
                                  {map_choosen === mapType && <span className="text-xs text-karmic-500">(Atual)</span>}
                                </label>
                              );
                            })}
                          </div>
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const dialog = document.getElementById(`map-dialog-${email}`);
                                if (dialog instanceof HTMLDialogElement) {
                                  dialog.close();
                                }
                              }}
                            >
                              Fechar
                            </Button>
                          </div>
                        </div>
                      </dialog>
                    </div>
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
