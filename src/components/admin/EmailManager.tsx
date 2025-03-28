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
import { X, Plus, Map, Zap, RefreshCw, AlertTriangle, Edit, Check, Filter, ChevronRight, ChevronLeft, Search } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const EmailManager: React.FC = () => {
  const [emails, setEmails] = useState<{ 
    email: string, 
    essential: boolean, 
    karmic_numbers: Json[], 
    map_choosen: string | null,
    maps_available: string[] | null 
  }[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newEmailMapType, setNewEmailMapType] = useState<string>('personal');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filtro
  const [mapFilter, setMapFilter] = useState<string | null>(null);
  
  // Campo de pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para controle temporário dos mapas no modal
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [tempMapsAvailable, setTempMapsAvailable] = useState<string[] | null>(null);
  const [tempMapChoosen, setTempMapChoosen] = useState<string | null>(null);
  
  useEffect(() => {
    refreshEmails();
  }, []);
  
  // Reset da página atual quando o filtro ou pesquisa mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [mapFilter, itemsPerPage, searchTerm]);
  
  const refreshEmails = async () => {
    setIsRefreshing(true);
    
    try {
      const authorizedEmails = await getAllAuthorizedEmails();
      console.log("Emails autorizados obtidos:", authorizedEmails);
      setEmails(authorizedEmails);
      setCurrentPage(1); // Reset para a primeira página ao atualizar
    } catch (error) {
      console.error("Erro ao atualizar emails:", error);
      toast.error("Erro ao carregar emails autorizados");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Filtra os emails com base no mapa selecionado e no termo de pesquisa
  const filteredEmails = emails.filter((email) => {
    const matchesFilter = !mapFilter || email.maps_available?.includes(mapFilter);
    const matchesSearch = !searchTerm || email.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Calcula o número total de páginas
  const totalPages = Math.ceil(filteredEmails.length / itemsPerPage);
  
  // Obtém os emails para a página atual
  const currentEmails = filteredEmails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Navegação de páginas
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      await addAuthorizedEmail(normalizedEmail, newEmailMapType);
      
      toast.success("Email adicionado", {
        description: `O email ${normalizedEmail} foi adicionado com sucesso.`
      });
      setNewEmail('');
      setNewEmailMapType('personal'); // Reset para o valor padrão
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
    addAuthorizedEmail(sampleEmail, 'personal');
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
      
      // Define qual mapa será o escolhido após a atualização
      let newMapChoosen = currentMapChoosen;
      
      // Se estamos adicionando um novo mapa, defina-o como o escolhido
      if (mapIndex < 0) {
        newMapChoosen = mapType;
      } 
      // Se estamos removendo o mapa que estava escolhido, escolha outro disponível
      else if (mapType === currentMapChoosen && mapsAvailable.length > 0) {
        newMapChoosen = mapsAvailable[mapsAvailable.length - 1];
      }
      // Se removemos o último mapa, defina como null
      else if (mapsAvailable.length === 0) {
        newMapChoosen = null;
      }
      
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
  
  // Abrir modal e inicializar estados temporários
  const openMapDialog = (email: string, currentMapsAvailable: string[] | null, currentMapChoosen: string | null) => {
    setSelectedEmail(email);
    setTempMapsAvailable(currentMapsAvailable ? [...currentMapsAvailable] : []);
    setTempMapChoosen(currentMapChoosen);
    
    const dialog = document.getElementById(`map-dialog-${email}`);
    if (dialog instanceof HTMLDialogElement) {
      dialog.showModal();
    }
  };
  
  // Função para atualizar temporariamente os mapas selecionados
  const handleToggleMapTemp = (mapType: string) => {
    if (!tempMapsAvailable) {
      setTempMapsAvailable([mapType]);
      setTempMapChoosen(mapType);
      return;
    }
    
    setTempMapsAvailable(prev => {
      const newMaps = [...prev];
      const mapIndex = newMaps.indexOf(mapType);
      
      if (mapIndex >= 0) {
        // Remove map if already selected
        newMaps.splice(mapIndex, 1);
        
        // Update chosen map if needed
        if (tempMapChoosen === mapType && newMaps.length > 0) {
          setTempMapChoosen(newMaps[newMaps.length - 1]);
        } else if (newMaps.length === 0) {
          setTempMapChoosen(null);
        }
      } else {
        // Add map if not selected
        newMaps.push(mapType);
        
        // If no map is chosen yet, set this one
        if (!tempMapChoosen) {
          setTempMapChoosen(mapType);
        }
      }
      
      return newMaps;
    });
  };
  
  // Função para salvar as mudanças nos mapas
  const handleSaveMapChanges = async () => {
    if (!selectedEmail) return;
    
    try {
      const success = await updateMapChoosen(selectedEmail, tempMapChoosen, tempMapsAvailable);
      
      if (success) {
        toast.success("Mapas atualizados", {
          description: `Os mapas para ${selectedEmail} foram atualizados com sucesso.`
        });
        
        // Fechar o modal
        const dialog = document.getElementById(`map-dialog-${selectedEmail}`);
        if (dialog instanceof HTMLDialogElement) {
          dialog.close();
        }
        
        // Limpar estados temporários
        setSelectedEmail(null);
        setTempMapsAvailable(null);
        setTempMapChoosen(null);
        
        // Atualizar lista de emails
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
        <h3 className="text-xl font-medium text-karmic-800">
          Gerenciamento de Emails Autorizados
        </h3>
        <Button 
          onClick={refreshEmails} 
          variant="outline" 
          size="sm"
          disabled={isRefreshing}
          className="text-base"
        >
          <RefreshCw className={`h-5 w-5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} /> 
          Atualizar
        </Button>
      </div>
      
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="email" className="text-base font-medium text-karmic-700 block mb-2">
            Adicionar Email Autorizado
          </label>
          <div className="flex gap-3">
            <Input
              id="email"
              type="email"
              placeholder="novocliente@email.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              className="text-base py-5"
            />
            <Select
              value={newEmailMapType}
              onValueChange={setNewEmailMapType}
            >
              <SelectTrigger className="w-[180px] text-base py-5">
                <SelectValue placeholder="Tipo de mapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal" className="text-base">Pessoal</SelectItem>
                <SelectItem value="professional" className="text-base">Profissional</SelectItem>
                <SelectItem value="love" className="text-base">Amor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button 
          type="button" 
          onClick={handleAddEmail}
          className="bg-karmic-600 hover:bg-karmic-700 text-base py-5"
        >
          <Plus className="h-5 w-5 mr-1" /> Adicionar
        </Button>
      </div>
      
      {emails.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h3 className="text-amber-800 text-base font-medium mb-2">Nenhum email cadastrado</h3>
          <p className="text-amber-700 text-sm mb-3">
            Você precisa adicionar pelo menos um email autorizado para que os usuários possam fazer login.
          </p>
          <Button 
            onClick={handleAddSampleEmail} 
            variant="outline"
            className="bg-white border-amber-300 text-amber-700 hover:bg-amber-100 text-sm"
          >
            <Zap className="h-4 w-4 mr-1" /> Adicionar email de exemplo (projetovmtd@gmail.com)
          </Button>
        </div>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-medium text-karmic-800">Emails Autorizados</h3>
          
          <div className="flex items-center gap-4 flex-wrap">
            {/* Campo de pesquisa */}
            <div className="flex items-center w-64 relative">
              <Input
                placeholder="Pesquisar email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-9 text-base"
              />
              <Search className="h-4 w-4 absolute right-3 text-gray-400" />
            </div>
            
            <div className="flex items-center">
              <span className="text-base mr-2">Filtrar por mapa:</span>
              <Select
                value={mapFilter || "all"}
                onValueChange={(value) => setMapFilter(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-[180px] text-base">
                  <SelectValue placeholder="Todos os mapas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-base">Todos os mapas</SelectItem>
                  <SelectItem value="professional" className="text-base">Profissional</SelectItem>
                  <SelectItem value="love" className="text-base">Amor</SelectItem>
                  <SelectItem value="personal" className="text-base">Pessoal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center">
              <span className="text-base mr-2">Itens por página:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[80px] text-base">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5" className="text-base">5</SelectItem>
                  <SelectItem value="10" className="text-base">10</SelectItem>
                  <SelectItem value="20" className="text-base">20</SelectItem>
                  <SelectItem value="50" className="text-base">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredEmails.length === 0 ? (
          <p className="text-karmic-500 italic text-base">Nenhum email autorizado encontrado com os filtros aplicados.</p>
        ) : (
          <>
            <ul className="space-y-3">
              {currentEmails.map(({email, essential, karmic_numbers, map_choosen, maps_available}) => {
                return (
                  <li 
                    key={email} 
                    className={`flex justify-between items-center p-4 rounded-md ${essential ? 'bg-blue-50' : 'bg-karmic-100'}`}
                  >
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`${essential ? 'font-medium text-blue-700' : ''} text-base`}>{email}</span>
                      {essential && (
                        <span className="ml-1 text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                          Essencial
                        </span>
                      )}
                      {karmic_numbers?.length > 0 && (
                        <div className="ml-1 flex items-center">
                          <div className="flex items-center text-sm bg-karmic-200 text-karmic-700 px-2 py-1 rounded-full">
                            <Map className="h-4 w-4 mr-1" />
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

                      <div className="ml-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="p-1"
                          onClick={() => openMapDialog(email, maps_available, map_choosen)}
                        >
                          <Edit className="h-4 w-4 text-karmic-600" />
                        </Button>
                        
                        <dialog 
                          id={`map-dialog-${email}`} 
                          className="p-6 rounded-lg shadow-lg border border-karmic-200 backdrop:bg-gray-900/50"
                        >
                          <div className="w-72">
                            <h4 className="text-xl font-medium mb-4">Mapas disponíveis</h4>
                            <div className="space-y-3 mb-4">
                              {['professional', 'love', 'personal'].map((mapType) => {
                                const mapName = mapType === 'professional' ? 'Profissional' : 
                                              mapType === 'love' ? 'Amor' : 'Pessoal';
                                
                                const isSelected = email === selectedEmail 
                                  ? tempMapsAvailable?.includes(mapType)
                                  : maps_available?.includes(mapType);
                                
                                const isCurrentMapChosen = email === selectedEmail
                                  ? tempMapChoosen === mapType
                                  : map_choosen === mapType;
                                  
                                return (
                                  <label key={mapType} className="flex items-center space-x-3 cursor-pointer text-base">
                                    <input 
                                      type="checkbox" 
                                      className="rounded border-karmic-300 text-karmic-600 focus:ring-karmic-500 h-5 w-5"
                                      checked={isSelected}
                                      onChange={() => {
                                        if (email === selectedEmail) {
                                          handleToggleMapTemp(mapType);
                                        }
                                      }}
                                    />
                                    <span>{mapName}</span>
                                    {isCurrentMapChosen && <span className="text-sm text-karmic-500">(Atual)</span>}
                                  </label>
                                );
                              })}
                            </div>
                            <div className="flex justify-between">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  const dialog = document.getElementById(`map-dialog-${email}`);
                                  if (dialog instanceof HTMLDialogElement) {
                                    dialog.close();
                                    setSelectedEmail(null);
                                  }
                                }}
                                className="text-base"
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={handleSaveMapChanges}
                                className="text-base bg-karmic-600 hover:bg-karmic-700"
                              >
                                Salvar alterações
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
                      <X className="h-5 w-5" />
                    </Button>
                  </li>
                );
              })}
            </ul>
            
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={`text-base ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    
                    if (totalPages <= 5) {
                      // Se temos 5 ou menos páginas, mostrar todas
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // Se estamos nas primeiras páginas
                      if (i < 4) {
                        pageNum = i + 1;
                      } else {
                        return (
                          <PaginationItem key={i}>
                            <PaginationEllipsis className="text-xl" />
                          </PaginationItem>
                        );
                      }
                    } else if (currentPage >= totalPages - 2) {
                      // Se estamos nas últimas páginas
                      if (i === 0) {
                        pageNum = 1;
                      } else if (i === 1) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationEllipsis className="text-xl" />
                          </PaginationItem>
                        );
                      } else {
                        pageNum = totalPages - (4 - i);
                      }
                    } else {
                      // Se estamos no meio
                      if (i === 0) {
                        pageNum = 1;
                      } else if (i === 1) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationEllipsis className="text-xl" />
                          </PaginationItem>
                        );
                      } else if (i === 3) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationEllipsis className="text-xl" />
                          </PaginationItem>
                        );
                      } else {
                        pageNum = currentPage;
                      }
                    }
                    
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className="text-base"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={`text-base ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
      
      <Dialog open={!!emailToDelete} onOpenChange={(open) => !open && setEmailToDelete(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-karmic-800">Confirmar exclusão</DialogTitle>
            <DialogDescription className="pt-2 text-base">
              Você tem certeza que deseja remover o email:
              <div className="mt-2 p-3 bg-karmic-50 border border-karmic-100 rounded-md font-medium text-karmic-800 text-base">
                {emailToDelete}
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-2 flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-base text-amber-800">
              O usuário perderá acesso ao seu mapa kármico criado com este email.
              Esta ação não pode ser desfeita.
            </div>
          </div>
          
          <DialogFooter className="mt-4 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setEmailToDelete(null)}
              className="text-base px-5 py-5"
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
              className="text-base px-5 py-5"
            >
              Remover email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="mt-4 p-4 bg-karmic-50 border border-karmic-200 rounded-md">
        <h4 className="text-base font-medium text-karmic-700 mb-2">Observações sobre emails</h4>
        <ul className="text-sm space-y-2 text-karmic-600 list-disc pl-4">
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
