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
  handleDownloadPDF: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  userData,
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
        </p>
        <p className="mt-2">Nascimento: {new Date(userData.birth).toLocaleDateString("pt-BR", {timeZone: "UTC"})}</p>
      </div>
      
      <div className="flex space-x-3">
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
