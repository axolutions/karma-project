import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/database.types";

// Função para obter todos os dados do usuário por email
export const getAllUserDataByEmail = (email?: string) => {
  try {
    // Obter dados dos usuários do localStorage
    const userMapsString = localStorage.getItem('userMaps');
    const userMaps = userMapsString ? JSON.parse(userMapsString) : [];

    // Filtrar mapas inválidos/incompletos
    const validMaps = userMaps.filter((map: any) =>
      map && map.id && map.email
    );

    // Se não foi fornecido email, retorna todos os mapas válidos
    if (!email) {
      return validMaps;
    }

    // Filtrar mapas pelo email fornecido
    return validMaps.filter((map: any) =>
      map.email && map.email.toLowerCase() === email.toLowerCase()
    );
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return [];
  }
};

// Função para verificar se um usuário está logado
export const isLoggedIn = (): boolean => {
  const currentUser = localStorage.getItem('currentUser');
  return !!currentUser;
};

// Função para obter o email do usuário atual
export const getCurrentUser = (): string | null => {
  return localStorage.getItem('currentUser');
};

// Função para fazer login
export const login = (email: string): boolean => {
  try {
    localStorage.setItem('currentUser', email);
    return true;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return false;
  }
};

// Função para fazer logout
export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

// Função para obter dados de um usuário específico por email
export async function getUserData(email: string) {
  try {
    const { data, error } = await supabase.from("clients").select("*").eq('email', email).single();

    if (error) {
      console.error('Erro ao obter dados do usuário:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
};

export async function saveKarmicNumbers(email: string, name: string, birthDate: string, karmicNumbers: Record<string, number>) {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    // convert to iso 8601
    const date = new Date(birthDate.split("/").reverse().join("-"));
    const birth = date.toISOString();

    await supabase.from("clients").update({
      name,
      birth,
      karmic_numbers: [karmicNumbers],
    }).eq('email', normalizedEmail);
  } catch (error) {
    console.error('Erro ao salvar números kármicos:', error);
  }
}

// Função para salvar dados do usuário
export const saveUserData = (userData: any): string => {
  try {
    // Verificar se já tem um ID, se não, criar um
    if (!userData.id) {
      userData.id = crypto.randomUUID();
    }

    // Adicionar timestamp de criação
    userData.createdAt = userData.createdAt || new Date().toISOString();

    // Obter mapas existentes
    const userMapsString = localStorage.getItem('userMaps');
    const userMaps = userMapsString ? JSON.parse(userMapsString) : [];

    // Adicionar novo mapa
    userMaps.push(userData);

    // Salvar no localStorage
    localStorage.setItem('userMaps', JSON.stringify(userMaps));

    // Definir este como o mapa atual
    setCurrentMatrixId(userData.id);

    return userData.id;
  } catch (error) {
    console.error('Erro ao salvar dados do usuário:', error);
    throw error;
  }
};

// Função para definir o ID da matriz atual
export const setCurrentMatrixId = (matrixId: string): void => {
  try {
    localStorage.setItem('currentMatrixId', matrixId);
  } catch (error) {
    console.error('Erro ao definir ID da matriz atual:', error);
  }
};

// Funções para gerenciar emails autorizados
export async function getAllAuthorizedEmails() {
  try {
    const { data } = await supabase.from("clients").select("*");

    return data;
  } catch (error) {
    console.error('Erro ao obter emails autorizados:', error);
    return [];
  }
}

export async function isAuthorizedEmail(email: string): Promise<boolean> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Verificando autorização para:", normalizedEmail);

    const result = await supabase.from("clients").select("email").eq('email', normalizedEmail);

    if (result.error) {
      console.error(result.error);
      return false;
    }

    if (result.data.length === 0) {
      console.log("Email não autorizado:", normalizedEmail);
      return false;
    }

    console.log(result)

    return true;
  } catch (error) {
    console.error('Erro ao verificar se email é autorizado:', error);
    return false;
  }
};

export async function addAuthorizedEmail(email: string, mapType?: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Se um tipo de mapa foi fornecido, adiciona ele aos mapas disponíveis
    const mapsAvailable = mapType ? [mapType] : null;
    const mapChoosen = mapType || null;

    const result = await supabase.from("clients").upsert([{ 
      email: normalizedEmail,
      maps_available: mapsAvailable,
      map_choosen: mapChoosen
    }]);

    result.error ? console.error(result.error) : console.log("Email adicionado à lista de autorizados:", normalizedEmail);
  } catch (error) {
    console.error('Erro ao adicionar email autorizado:', error);
  }
};

export async function removeAuthorizedEmail(email: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    const result = await supabase.from("clients").delete().eq('email', normalizedEmail);
    result.error ? console.error(result.error) : console.log("Email removido da lista de autorizados:", normalizedEmail);
  } catch (error) {
    console.error('Erro ao remover email autorizado:', error);
  }
};

export async function updateMapChoosen(email: string, mapChoosen: string | null, mapsAvailable?: string[] | null) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Se não fornecemos mapsAvailable, precisamos obter os mapas atuais do usuário
    if (mapsAvailable === undefined) {
      const userData = await getUserData(normalizedEmail);
      if (userData && userData.maps_available) {
        mapsAvailable = userData.maps_available;
      } else {
        mapsAvailable = [];
      }
    }
    
    // Garantir que o mapa escolhido esteja na lista de mapas disponíveis
    if (mapChoosen && !mapsAvailable.includes(mapChoosen)) {
      mapsAvailable.push(mapChoosen);
    }
    
    // Create update object
    const updateData: { map_choosen: string | null, maps_available?: string[] } = {
      map_choosen: mapChoosen,
      maps_available: mapsAvailable
    };
    
    const result = await supabase.from("clients").update(updateData).eq('email', normalizedEmail);
    
    if (result.error) {
      console.error('Erro ao atualizar map_choosen:', result.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar map_choosen:', error);
    return false;
  }
}

// Functions for managing Karmic Maps in the karmic_maps table
export async function addKarmicMap(mapData: { selected_map: string; skus: string[] }) {
  try {
    const { data, error } = await supabase
      .from("karmic_maps")
      .insert([mapData])
      .select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding karmic map:", error);
    throw error;
  }
}

export async function updateKarmicMapData(mapId: number, mapData: { selected_map: string; skus: string[] }) {
  try {
    const { data, error } = await supabase
      .from("karmic_maps")
      .update(mapData)
      .eq("id", mapId)
      .select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating karmic map:", error);
    throw error;
  }
}

export async function deleteKarmicMapById(mapId: number) {
  try {
    const { error } = await supabase
      .from("karmic_maps")
      .delete()
      .eq("id", mapId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting karmic map:", error);
    throw error;
  }
}
