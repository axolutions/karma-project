import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw, ChevronDown, Plus, ShoppingCart, FileDown } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { logout } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserHeaderProps {
  userData: any;
  userMaps: any[];
  refreshing: boolean;
  canCreateNewMap: boolean;
  handleRefresh: () => void;
  handleSwitchMap: (mapId: string) => void;
  handleCreateNewMap: () => void;
  handleDownloadPDF: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  userData,
  userMaps,
  refreshing,
  canCreateNewMap,
  handleRefresh,
  handleSwitchMap,
  handleCreateNewMap,
  handleDownloadPDF
}) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso."
    });
    navigate('/');
  };

  return (
    <div className="flex justify-between items-center mb-8 print:hidden">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-karmic-800">
          Matriz Kármica Pessoal 2025
        </h1>
        <p className="text-karmic-600">
          Olá, <span className="font-medium">{userData.name}</span>
          {userMaps.length > 1 && (
            <span className="text-xs ml-2 text-karmic-500">
              (Você possui {userMaps.length} mapas kármicos)
            </span>
          )}
        </p>
      </div>
      
      <div className="flex space-x-3">
        {userMaps.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="karmic-button-outline">
                Meus Mapas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Selecione um mapa</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userMaps.map((map, index) => (
                map && map.id ? (
                  <DropdownMenuItem 
                    key={map.id || index} 
                    onClick={() => handleSwitchMap(map.id)}
                    className={map.id === userData.id ? "bg-karmic-100 font-medium" : ""}
                  >
                    {map.name} - {map.birthDate}
                    <span className="text-xs ml-2 text-karmic-500">
                      ({map.createdAt ? new Date(map.createdAt).toLocaleDateString() : 'Data desconhecida'})
                    </span>
                  </DropdownMenuItem>
                ) : null
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleCreateNewMap} 
                className={canCreateNewMap ? "text-karmic-700" : "text-gray-400 cursor-not-allowed"}
                disabled={!canCreateNewMap}
              >
                {!canCreateNewMap ? (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Adquira novo acesso
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Criar novo mapa
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <Button 
          onClick={handleRefresh}
          variant="outline"
          className="karmic-button-outline flex items-center"
          disabled={refreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
        
        <Button 
          onClick={handleDownloadPDF}
          className="karmic-button flex items-center"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Baixar Interpretações
        </Button>
        
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="karmic-button-outline flex items-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
