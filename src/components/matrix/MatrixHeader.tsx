
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw, ChevronDown, Plus, ShoppingCart, FileDown, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast";
import { logout, getRemainingMatrixCount, getCurrentUser } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MatrixHeaderProps {
  userName: string;
  userMaps: any[];
  currentMapId: string;
  refreshing: boolean;
  canCreateNewMap: boolean;
  onSwitchMap: (mapId: string) => void;
  onRefresh: () => void;
  onDownloadPNG: () => void;
  onDownloadPDF: () => void;
  onLogout: () => void;
  onCreateNewMap: () => void;
}

const MatrixHeader: React.FC<MatrixHeaderProps> = ({
  userName,
  userMaps,
  currentMapId,
  refreshing,
  canCreateNewMap,
  onSwitchMap,
  onRefresh,
  onDownloadPNG,
  onDownloadPDF,
  onLogout,
  onCreateNewMap
}) => {
  const email = getCurrentUser();
  const remainingCount = email ? getRemainingMatrixCount(email) : 0;
  const navigate = useNavigate();
  
  const handleCreateNewMap = () => {
    if (canCreateNewMap) {
      // Fix: Navigate to the home page with a clear query parameter to create a new map
      navigate('/?create=new', { replace: true });
    } else {
      toast({
        title: "Limite atingido",
        description: "Você já utilizou todas as suas autorizações para criar mapas kármicos.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-col space-y-4 mb-8 print:hidden">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-medium text-karmic-800">
            Matriz Kármica Pessoal 2025
          </h1>
          <p className="text-karmic-600">
            Olá, <span className="font-medium">{userName}</span>
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
                      onClick={() => onSwitchMap(map.id)}
                      className={map.id === currentMapId ? "bg-karmic-100 font-medium" : ""}
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
            onClick={onRefresh}
            variant="outline"
            className="karmic-button-outline flex items-center"
            disabled={refreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button 
            onClick={onDownloadPNG}
            variant="download"
            className="flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar Matriz em HTML
          </Button>
          
          <Button 
            onClick={onDownloadPDF}
            className="karmic-button flex items-center"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Baixar Interpretações
          </Button>
          
          <Button 
            onClick={onLogout}
            variant="outline"
            className="karmic-button-outline flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
      
      {remainingCount > 0 && (
        <div className="bg-gradient-to-r from-karmic-300 to-karmic-200 p-6 rounded-lg border border-karmic-400 
                      shadow-sm hover:shadow-md transition-all duration-300 
                      flex items-center justify-between animate-fade-in">
          <div className="flex items-center">
            <div className="bg-white p-4 rounded-full shadow-sm mr-5">
              <Plus className="h-7 w-7 text-karmic-700" />
            </div>
            <div>
              <h3 className="font-medium text-karmic-800 text-xl">
                Você ainda pode criar {remainingCount} {remainingCount === 1 ? 'mapa kármico' : 'mapas kármicos'} adicional!
              </h3>
              <p className="text-karmic-700 text-lg">
                Clique aqui para criar um novo mapa para você ou para alguém especial
              </p>
            </div>
          </div>
          <Button 
            className="karmic-button px-6 py-6 h-auto text-base"
            onClick={handleCreateNewMap}
          >
            <Plus className="mr-2 h-5 w-5" />
            Criar Novo Mapa
          </Button>
        </div>
      )}
    </div>
  );
};

export default MatrixHeader;
