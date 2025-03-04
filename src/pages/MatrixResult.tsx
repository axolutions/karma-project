
import React, { useState, useEffect } from 'react';
import { getUserData, isLoggedIn, getCurrentUser } from '../lib/auth';
import { getAllUserDataByEmail } from '../lib/auth';
import UserHeader from '../components/matrix/UserHeader';
import KarmicMatrix from '../components/KarmicMatrix';
import MatrixInterpretations from '../components/MatrixInterpretations';
import { useToast } from "@/components/ui/use-toast";
import LoadingState from '../components/matrix/LoadingState';
import ErrorState from '../components/matrix/ErrorState';
import { 
  generateInterpretationsHTML, 
  loadInterpretations, 
  ensureSampleInterpretationsLoaded, 
  forceLoadSampleInterpretations 
} from '@/lib/interpretations';
import { useNavigate } from 'react-router-dom';

const MatrixResult: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [userMaps, setUserMaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [interpretationsLoaded, setInterpretationsLoaded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Load interpretations immediately when component mounts
  useEffect(() => {
    console.log("MatrixResult: Carregando interpretações...");
    try {
      // Força o carregamento de amostra para ambiente de produção
      forceLoadSampleInterpretations();
      
      // Load interpretations from localStorage or use samples
      loadInterpretations();
      
      // Ensure we have sample interpretations available as fallback
      ensureSampleInterpretationsLoaded();
      
      setInterpretationsLoaded(true);
      console.log("MatrixResult: Interpretações carregadas com sucesso");
    } catch (err) {
      console.error("Erro ao carregar interpretações:", err);
      toast({
        title: "Aviso",
        description: "Carregando interpretações de fallback.",
        variant: "default"
      });
      
      // Try to use sample interpretations as fallback even if there's an error
      try {
        forceLoadSampleInterpretations();
        ensureSampleInterpretationsLoaded();
        setInterpretationsLoaded(true);
      } catch (e) {
        console.error("Não foi possível carregar interpretações de amostra:", e);
      }
    }
  }, []);
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Verificar se o usuário está logado
        if (!isLoggedIn()) {
          console.error("Usuário não está logado");
          setError('Sessão expirada. Por favor, faça login novamente.');
          setLoading(false);
          return;
        }
        
        // Obter o email do usuário atual
        const email = getCurrentUser();
        if (!email) {
          console.error("Email do usuário não encontrado no localStorage");
          setError('Dados de usuário não encontrados.');
          setLoading(false);
          return;
        }
        
        console.log("MatrixResult: Carregando dados para o email:", email);
        
        // Obter os dados do usuário pelo email
        const data = getUserData(email);
        console.log("MatrixResult: Dados obtidos:", data);
        
        if (!data) {
          console.error("Dados do usuário não encontrados para o email:", email);
          setError('Dados de usuário não encontrados. Por favor, faça login novamente.');
          setLoading(false);
          return;
        }
        
        // Se o usuário não tem nome ou dados kármicos, redirecionar para completar o perfil
        if (!data.name) {
          console.log("MatrixResult: Usuário sem nome, redirecionando para completar perfil");
          setError('Perfil incompleto. Por favor, complete seu perfil primeiro.');
          navigate('/');
          return;
        }
        
        // Verificar se o usuário tem dados kármicos
        if (!data.karmicNumbers) {
          console.error("Dados kármicos não encontrados para o usuário:", email);
          setError('Dados kármicos não encontrados. Por favor, complete seu perfil novamente.');
          navigate('/');
          return;
        }
        
        console.log("MatrixResult: Dados kármicos encontrados:", data.karmicNumbers);
        setUserData(data);
        
        // Obter todos os mapas do usuário (apenas os que têm dados completos)
        const allUserMaps = getAllUserDataByEmail(email);
        if (allUserMaps && allUserMaps.length > 0) {
          // Filtrar apenas mapas válidos (com nome e data de nascimento)
          const validMaps = allUserMaps.filter(map => map && map.name && map.birthDate);
          console.log("MatrixResult: Todos os mapas válidos do usuário:", validMaps);
          setUserMaps(validMaps);
        } else {
          // Se não encontrar mapas adicionais, usar apenas o mapa atual se for válido
          if (data.name && data.birthDate) {
            setUserMaps([data]);
          } else {
            setUserMaps([]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
        setError('Erro ao carregar dados. Por favor, recarregue a página.');
        setLoading(false);
      }
    };
    
    // Garantir que as interpretações sejam carregadas primeiro
    if (interpretationsLoaded) {
      loadUserData();
    }
  }, [navigate, interpretationsLoaded]);

  // Funções para o UserHeader
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Forçar o recarregamento das interpretações
    try {
      forceLoadSampleInterpretations();
      loadInterpretations();
      ensureSampleInterpretationsLoaded();
    } catch (e) {
      console.error("Erro ao recarregar interpretações:", e);
    }
    
    // Recarregar os dados do usuário
    const email = getCurrentUser();
    if (email) {
      const userData = getUserData(email);
      if (userData) {
        setUserData(userData);
        
        // Atualizar a lista de mapas do usuário
        const allUserMaps = getAllUserDataByEmail(email);
        if (allUserMaps && allUserMaps.length > 0) {
          setUserMaps(allUserMaps);
        } else {
          setUserMaps([userData]);
        }
        
        toast({
          title: "Atualizado",
          description: "Dados da matriz atualizados com sucesso!"
        });
      }
    }
    setRefreshing(false);
  };

  function handleSwitchMap(mapId: string) {
    console.log("Alterando para o mapa:", mapId);
    // Encontrar o mapa com o ID especificado
    const selectedMap = userMaps.find(map => map.id === mapId);
    if (selectedMap) {
      setUserData(selectedMap);
    }
  }

  function handleCreateNewMap() {
    navigate('/');
  }

  function handleDownloadPDF() {
    if (!userData?.karmicNumbers) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Dados kármicos não disponíveis para download.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Gerar o conteúdo HTML para o PDF
      const htmlContent = generateInterpretationsHTML(userData.karmicNumbers);
      
      // Criar um Blob com o conteúdo HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Criar URL para download
      const url = URL.createObjectURL(blob);
      
      // Criar elemento de link temporário para download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Matriz-Karmica-${userData.name || 'Usuario'}.html`;
      document.body.appendChild(a);
      
      // Iniciar download
      a.click();
      
      // Limpar
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Download iniciado",
        description: "O download das interpretações foi iniciado."
      });
    } catch (err) {
      console.error("Erro ao gerar arquivo para download:", err);
      toast({
        title: "Erro ao gerar arquivo",
        description: "Não foi possível gerar o arquivo para download.",
        variant: "destructive"
      });
    }
  }
  
  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  
  // Garantir que temos dados kármicos válidos
  const karmicData = userData?.karmicNumbers || {
    karmicSeal: 0,
    destinyCall: 0,
    karmaPortal: 0,
    karmicInheritance: 0,
    karmicReprogramming: 0,
    cycleProphecy: 0,
    spiritualMark: 0,
    manifestationEnigma: 0
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <UserHeader 
        userData={userData} 
        userMaps={userMaps}
        refreshing={refreshing}
        canCreateNewMap={true}
        handleRefresh={handleRefresh}
        handleSwitchMap={handleSwitchMap}
        handleCreateNewMap={handleCreateNewMap}
        handleDownloadPDF={handleDownloadPDF}
      />
      
      <KarmicMatrix karmicData={karmicData} />
      <MatrixInterpretations karmicData={karmicData} />
    </div>
  );
};

export default MatrixResult;
