import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { getCurrentUser, getUserData, logout, updateMapChoosen } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const mapConfigurations = {
    personal: {
        route: "/matrix",
        displayName: "Matriz Pessoal",
        description: "Sua matriz kármica pessoal baseada na sua data de nascimento",
        iconUrl: "/default_banner.png"
    },
    love: {
        route: "/matrix-love",
        displayName: "Matriz do Amor",
        description: "Explore a compatibilidade e a dinâmica dos relacionamentos",
        iconUrl: "/love_banner.png"
    },
    professional: {
        route: "/matrix-professional",
        displayName: "Matriz Profissional",
        description: "Insights de carreira e caminhos de desenvolvimento profissional",
        iconUrl: "/professional_banner.png"
    }
};

export default function UserMaps() {
  const [mapsAvailable, setMapsAvailable] = useState<string[]>([]);
  const [mapChoosen, setMapChoosen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserMaps = async () => {
      try {
        const email = getCurrentUser();
        const data = await getUserData(email);

        if (data) {
          if (data.maps_available && Array.isArray(data.maps_available)) {
            setMapsAvailable(data.maps_available);
            setMapChoosen(data.map_choosen);
            setHasData(true);
          } else {
            setMapsAvailable([]);
            setMapChoosen(null);
            setHasData(true);
          }
        } else {
          setHasData(false);
        }
      } catch (error) {
        console.error("Erro ao carregar mapas:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus mapas. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    fetchUserMaps();
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema com sucesso.",
    });
    navigate("/");
  };

  const handleSelectMap = async (mapType: string) => {
    try {
      // Atualizar o mapa escolhido no banco de dados antes de navegar
      const email = getCurrentUser();
      if (email) {
        await updateMapChoosen(email, mapType);
        setMapChoosen(mapType);
        
        // Navegar para a rota correspondente
        const mapConfig = mapConfigurations[mapType as keyof typeof mapConfigurations];
        if (mapConfig) {
          navigate(mapConfig.route);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar mapa escolhido:", error);
      toast({
        title: "Erro",
        description: "Não foi possível selecionar o mapa. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="container flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!loading && !hasData) {
    return (
      <div className="container py-8">
          <h1 className="text-2xl font-bold mb-6">Seus Mapas Disponíveis</h1>
          
          <div className="text-center py-8">
              <p className="text-lg mb-4">Você ainda não tem mapas disponíveis.</p>
              <Button onClick={() => navigate("/")}>Retornar à Página Inicial</Button>
          </div>
      </div>
    );
  }

  // Se só tiver um mapa disponível, vá direto para ele
  if (!loading && hasData && mapsAvailable.length === 1) {
    const mapType = mapsAvailable[0];
    const mapConfig = mapConfigurations[mapType as keyof typeof mapConfigurations];

    if (mapConfig) {
      // Atualizar o mapa escolhido antes de navegar
      const email = getCurrentUser();
      if (email) {
        updateMapChoosen(email, mapType)
          .then(() => {
            navigate(mapConfig.route);
          })
          .catch((error) => {
            console.error("Erro ao atualizar mapa escolhido:", error);
          });
      }
      return <div className="container flex items-center justify-center min-h-screen">Carregando seu mapa...</div>;
    }
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seus Mapas Disponíveis</h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="bg-[#8B4513] text-white hover:bg-[#704214] border-none flex items-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mapsAvailable.map((mapType) => {
          const mapConfig = mapConfigurations[mapType as keyof typeof mapConfigurations];
          
          if (!mapConfig) return null;
          
          return (
            <Card 
              key={mapType} 
              className={`overflow-hidden ${mapChoosen === mapType ? 'border-2 border-[#8B4513]' : ''}`}
            >
              <CardHeader>
                <CardTitle>{mapConfig.displayName}</CardTitle>
                <CardDescription>{mapConfig.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted/20 flex items-center justify-center rounded-md">
                  <img src={mapConfig.iconUrl} alt={mapConfig.displayName} />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSelectMap(mapType)}
                >
                  Ver Matriz
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
