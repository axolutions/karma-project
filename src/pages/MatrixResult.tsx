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
import { LogOut, RefreshCw, ChevronDown, Plus, ShoppingCart, FileDown } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { generateInterpretationsHTML } from '@/lib/interpretations';
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("MatrixResult - Iniciando carregamento de dados");
    loadUserData();
  }, []);
  
  const loadUserData = () => {
    try {
      setLoading(true);
      const email = getCurrentUser();
      if (!email) {
        console.log("Nenhum usuário logado, redirecionando para a página inicial");
        navigate('/');
        return;
      }
      
      console.log("Carregando dados para o email:", email);
      
      // Obter todos os mapas do usuário
      let allMaps = getAllUserDataByEmail();
      console.log("Dados brutos recebidos:", JSON.stringify(allMaps));
      
      // Filtrar apenas os mapas do usuário atual
      let userMaps = allMaps.filter(map => map && map.email === email);
      console.log("Mapas filtrados para o usuário atual:", userMaps);
      
      // Se não for um array, tenta converter para array
      if (userMaps && !Array.isArray(userMaps)) {
        console.log("Convertendo objeto para array");
        if (typeof userMaps === 'object') {
          userMaps = [userMaps];
        } else {
          userMaps = [];
          console.log("Dados não são um objeto nem um array:", typeof userMaps);
        }
      }
      
      // Verificar se temos mapas válidos
      if (!userMaps || !Array.isArray(userMaps) || userMaps.length === 0) {
        console.log("Nenhum mapa encontrado para este usuário");
        toast({
          title: "Perfil não encontrado",
          description: "Por favor, complete seu perfil primeiro.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }
      
      // Garantir que userMaps seja um array válido
      const validMaps = Array.isArray(userMaps) ? 
        userMaps.filter(map => map && typeof map === 'object') : [];
      
      console.log("Mapas válidos para este usuário:", validMaps);
      
      if (validMaps.length === 0) {
        console.log("Nenhum mapa válido encontrado para este usuário");
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
        currentData = validMaps.find(map => map.id === currentMatrixId);
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
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
      setLoading(false);
      navigate('/');
    }
  };
  
  const checkIfCanCreateNewMap = (email: string, mapCount: number) => {
    // Aqui verificamos se o usuário pode criar um novo mapa
    if (mapCount > 0 && !isAuthorizedEmail(email)) {
      // Simples verificação: se já tem mapas, não pode criar mais
      setCanCreateNewMap(false);
    } else {
      setCanCreateNewMap(true);
    }
  };
  
  const handleDownloadPDF = () => {
    if (!userData || !userData.karmicNumbers) {
      toast({
        title: "Erro ao gerar arquivo",
        description: "Não foi possível encontrar seus dados kármicos.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Gerando arquivo",
        description: "Preparando suas interpretações para download..."
      });
      
      // Gerar HTML com as interpretações
      const htmlContent = generateInterpretationsHTML(userData.karmicNumbers);
      
      // Criar um Blob com o conteúdo HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Criar um link de download
      const fileName = `Interpretacoes-Karmicas-${userData.name?.replace(/\s+/g, '-') || 'Usuario'}.html`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      
      // Disparar o download
      a.click();
      
      // Limpar recursos
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Download concluído",
        description: "Arquivo HTML gerado com suas interpretações. Você pode abri-lo em qualquer navegador."
      });
    } catch (error) {
      console.error("Erro ao preparar arquivo para download:", error);
      
      toast({
        title: "Erro ao gerar arquivo",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
    }
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
    setCurrentMatrixId(mapId);
    
    // Encontrar o mapa selecionado
    const selectedMap = userMaps.find(map => map.id === mapId);
    
    if (selectedMap) {
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
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white flex items-center justify-center">
        <div className="text-center p-6 bg-white shadow-sm rounded-xl border border-karmic-200">
          <p className="text-karmic-700 mb-3">Carregando dados da matriz kármica...</p>
          <div className="w-8 h-8 border-t-2 border-karmic-500 border-solid rounded-full animate-spin mx-auto mb-3"></div>
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
  
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-karmic-100 to-white flex items-center justify-center">
        <div className="text-center p-6 bg-white shadow-sm rounded-xl border border-karmic-200">
          <p className="text-karmic-700 mb-3">Não foi possível carregar os dados da matriz. Por favor, tente novamente.</p>
          <Button 
            onClick={() => navigate('/')}
            variant="default" 
            className="mt-4 karmic-button"
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
          
          <KarmicMatrix karmicData={karmicNumbers} />
        </motion.div>
        
        <MatrixInterpretations karmicData={karmicNumbers} />
      </div>
    </div>
  );
};

export default MatrixResult;
