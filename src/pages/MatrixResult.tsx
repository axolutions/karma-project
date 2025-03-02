import React, { useEffect, useState, useRef } from 'react';
import { 
  getCurrentUser, 
  getUserData, 
  getAllUserDataByEmail, 
  getCurrentMatrixId, 
  setCurrentMatrixId, 
  logout,
  getRemainingMatrixCount
} from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import MatrixInterpretations from '@/components/MatrixInterpretations';
import { toast } from "@/components/ui/use-toast";
import MatrixHeader from '@/components/matrix/MatrixHeader';
import MatrixLoading from '@/components/matrix/MatrixLoading';
import MatrixError from '@/components/matrix/MatrixError';
import MatrixInfo from '@/components/matrix/MatrixInfo';
import { downloadMatrixAsPNG, downloadInterpretationsAsHTML, checkIfCanCreateNewMap } from '@/components/matrix/MatrixUtils';

const MatrixResult = () => {
  const [userData, setUserData] = useState<any>(null);
  const [userMaps, setUserMaps] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [canCreateNewMap, setCanCreateNewMap] = useState(false);
  const [loading, setLoading] = useState(true);
  const matrixRef = useRef<HTMLDivElement>(null);
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
      setCanCreateNewMap(checkIfCanCreateNewMap(email));
      
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
  
  const handleDownloadPNG = () => {
    downloadMatrixAsPNG(matrixRef, userData?.name || '');
  };
  
  const handleDownloadPDF = () => {
    downloadInterpretationsAsHTML(userData?.karmicNumbers, userData?.name || '');
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
    const email = getCurrentUser();
    if (!email) {
      toast({
        title: "Sessão expirada",
        description: "Sua sessão expirou. Por favor, faça login novamente.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    // Check again if the user can create more maps
    if (!checkIfCanCreateNewMap(email)) {
      toast({
        title: "Limite atingido",
        description: "Você já utilizou todas as suas autorizações para criar mapas kármicos. Adquira um novo acesso para criar mais mapas.",
        variant: "destructive"
      });
      return;
    }
    
    // Redireciona para a página inicial para criar um novo mapa
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
    return <MatrixLoading message="Carregando dados da matriz kármica..." />;
  }
  
  if (!userData) {
    return <MatrixError message="Não foi possível carregar os dados da matriz. Por favor, tente novamente." />;
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
        <MatrixHeader 
          userName={userData.name}
          userMaps={userMaps}
          currentMapId={userData.id}
          refreshing={refreshing}
          canCreateNewMap={canCreateNewMap}
          onSwitchMap={handleSwitchMap}
          onRefresh={handleRefresh}
          onDownloadPNG={handleDownloadPNG}
          onDownloadPDF={handleDownloadPDF}
          onLogout={handleLogout}
          onCreateNewMap={handleCreateNewMap}
        />
        
        <MatrixInfo 
          name={userData.name}
          birthDate={userData.birthDate}
          createdDate={createdDate}
          karmicNumbers={karmicNumbers}
          matrixRef={matrixRef}
        />
        
        <MatrixInterpretations karmicData={karmicNumbers} />
      </div>
    </div>
  );
};

export default MatrixResult;
