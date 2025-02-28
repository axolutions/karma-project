
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  getCurrentUser, 
  getUserData, 
  getAllUserDataByEmail, 
  getCurrentMatrixId, 
  setCurrentMatrixId, 
  logout,
  isAuthorizedEmail
} from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import KarmicMatrix from '@/components/KarmicMatrix';
import MatrixInterpretations from '@/components/MatrixInterpretations';
import { Printer, LogOut, RefreshCw, ChevronDown, Plus, ShoppingCart } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MatrixResult = () => {
  const [userData, setUserData] = useState<any>(null);
  const [userMaps, setUserMaps] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [canCreateNewMap, setCanCreateNewMap] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("MatrixResult - Iniciando carregamento de dados");
    loadUserData();
  }, []);
  
  const loadUserData = () => {
    try {
      const email = getCurrentUser();
      if (!email) {
        console.log("Nenhum usuário logado, redirecionando para a página inicial");
        navigate('/');
        return;
      }
      
      console.log("Carregando dados para o email:", email);
      
      // Obter todos os mapas do usuário
      let allMaps = getAllUserDataByEmail(email);
      console.log("Dados brutos recebidos:", JSON.stringify(allMaps));
      
      // Se não for um array, tenta converter para array
      if (allMaps && !Array.isArray(allMaps)) {
        console.log("Convertendo objeto para array");
        allMaps = [allMaps];
      }
      
      // Verificar se temos mapas válidos
      if (!allMaps || !Array.isArray(allMaps) || allMaps.length === 0) {
        console.log("Nenhum mapa encontrado");
        toast({
          title: "Perfil não encontrado",
          description: "Por favor, complete seu perfil primeiro.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }
      
      // Garantir que allMaps seja um array válido
      const validMaps = Array.isArray(allMaps) ? 
        allMaps.filter(map => map && typeof map === 'object') : [];
      
      console.log("Mapas válidos:", validMaps);
      
      if (validMaps.length === 0) {
        console.log("Nenhum mapa válido encontrado");
        toast({
          title: "Dados corrompidos",
          description: "Os dados do seu perfil parecem estar corrompidos. Por favor, crie um novo perfil.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }
      
      setUserMaps(validMaps);
      
      // Verificar se o usuário pode criar novos mapas
      checkIfCanCreateNewMap(email, validMaps.length);
      
      // Tentar obter o mapa específico definido na sessão
      const currentMatrixId = getCurrentMatrixId();
      console.log("ID da matriz atual:", currentMatrixId);
      
      let currentData = null;
      
      if (currentMatrixId) {
        currentData = getUserData(email, currentMatrixId);
        console.log("Dados da matriz obtidos por ID:", currentData);
      }
      
      // Se não encontrar o mapa específico, usar o mais recente
      if (!currentData || !currentData.id) {
        console.log("Usando o mapa mais recente");
        currentData = validMaps[validMaps.length - 1];
        if (currentData && currentData.id) {
          setCurrentMatrixId(currentData.id);
        }
      }
      
      // Garantir que temos números kármicos, mesmo que vazios
      if (!currentData.karmicNumbers) {
        console.log("Números kármicos ausentes, criando objeto vazio");
        currentData.karmicNumbers = {
          karmicSeal: 0,
          destinyCall: 0,
          karmaPortal: 0,
          karmicInheritance: 0,
          karmicReprogramming: 0,
          cycleProphecy: 0,
          spiritualMark: 0,
          manifestationEnigma: 0
        };
      }
      
      console.log("Definindo userData com:", currentData);
      setUserData(currentData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
      navigate('/');
    }
  };
  
  const checkIfCanCreateNewMap = (email: string, mapCount: number) => {
    // Aqui verificamos se o usuário pode criar um novo mapa
    if (mapCount > 0 && isAuthorizedEmail(email)) {
      // Simples verificação: se já tem mapas, não pode criar mais
      setCanCreateNewMap(false);
    } else {
      setCanCreateNewMap(true);
    }
  };
  
  // Detecta quando a impressão é concluída ou cancelada
  useEffect(() => {
    if (isPrinting) {
      // Adicionar evento para quando o modal de impressão for fechado
      const handleAfterPrint = () => {
        setIsPrinting(false);
        console.log("Impressão concluída ou cancelada");
      };
      
      window.addEventListener('afterprint', handleAfterPrint);
      
      return () => {
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    }
  }, [isPrinting]);
  
  const handlePrint = () => {
    setIsPrinting(true);
    
    // Garantir que todos os estilos e imagens sejam carregados antes de imprimir
    setTimeout(() => {
      try {
        window.print();
        
        // Em alguns navegadores, o evento afterprint pode não ser disparado
        // Então definimos um timeout de segurança
        setTimeout(() => {
          if (isPrinting) {
            setIsPrinting(false);
          }
        }, 5000);
      } catch (error) {
        console.error("Erro ao imprimir:", error);
        setIsPrinting(false);
        toast({
          title: "Erro ao imprimir",
          description: "Houve um problema ao gerar o PDF. Tente novamente.",
          variant: "destructive"
        });
      }
    }, 300);
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso."
    });
    navigate('/');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    toast({
      title: "Atualizando",
      description: "Recarregando sua Matriz Kármica..."
    });
    
    // Simular um pequeno delay e então recarregar
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  
  const handleSwitchMap = (mapId: string) => {
    const email = getCurrentUser();
    if (!email) return;
    
    const selectedMap = getUserData(email, mapId);
    if (selectedMap && selectedMap.id) {
      setCurrentMatrixId(mapId);
      setUserData(selectedMap);
      
      toast({
        title: "Mapa alterado",
        description: `Visualizando mapa de ${selectedMap.name} (${selectedMap.birthDate}).`
      });
    } else {
      toast({
        title: "Erro ao carregar mapa",
        description: "Não foi possível carregar o mapa selecionado.",
        variant: "destructive"
      });
    }
  };
  
  const handleCreateNewMap = () => {
    if (!canCreateNewMap) {
      toast({
        title: "Limite atingido",
        description: "Você já atingiu o limite de mapas que pode criar. Adquira um novo acesso para criar mais mapas.",
        variant: "destructive"
      });
      return;
    }
    
    navigate('/');
    
    // Pequeno delay para exibir a toast
    setTimeout(() => {
      toast({
        title: "Criar novo mapa",
        description: "Preencha os dados para gerar um novo mapa kármico."
      });
    }, 300);
  };
  
  // Mostrar estado de carregamento se ainda não temos dados
  if (!userData) {
    console.log("Ainda não temos dados, exibindo carregamento");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-karmic-700">Carregando dados da matriz kármica...</p>
          <Button 
            onClick={() => navigate('/')}
            variant="link" 
            className="mt-4 text-karmic-500"
          >
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    );
  }
  
  console.log("Renderizando matriz com dados:", userData);
  console.log("Números kármicos:", userData.karmicNumbers);
  
  // Formatar data de criação
  const createdDate = userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : '';
  
  // Garantir que temos números kármicos para mostrar
  const karmicNumbers = userData.karmicNumbers || {};
  
  // URL da imagem da matriz
  const matrixBackgroundImage = "https://darkorange-goldfinch-896244.hostingersite.com/wp-content/uploads/2025/02/Design-sem-nome-1.png";
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white py-12 print:bg-white print:py-0">
      <div className="container max-w-4xl mx-auto px-4">
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
              onClick={handlePrint}
              className="karmic-button flex items-center"
              disabled={isPrinting}
            >
              <Printer className={`mr-2 h-4 w-4 ${isPrinting ? 'animate-spin' : ''}`} />
              {isPrinting ? 'Gerando PDF...' : 'Imprimir / PDF'}
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
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 print:mb-5"
        >
          <h2 className="text-xl md:text-2xl font-serif font-medium text-karmic-800 mb-2">
            Sua Matriz Kármica
          </h2>
          <p className="text-karmic-600 mb-2 print:mb-1">
            Data de Nascimento: <span className="font-medium">{userData.birthDate}</span>
          </p>
          {createdDate && (
            <p className="text-karmic-500 text-xs mb-6 print:mb-3">
              Matriz gerada em: {createdDate}
            </p>
          )}
          
          <KarmicMatrix 
            karmicData={karmicNumbers} 
            backgroundImage={matrixBackgroundImage}
          />
        </motion.div>
        
        <MatrixInterpretations karmicData={karmicNumbers} />
      </div>
    </div>
  );
};

export default MatrixResult;
