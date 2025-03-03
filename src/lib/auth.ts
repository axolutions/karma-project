// Função para obter todos os dados do usuário por email
export const getAllUserDataByEmail = (email?: string) => {
  try {
    // Obter dados dos usuários do localStorage
    const userMapsString = localStorage.getItem('userMaps');
    const userMaps = userMapsString ? JSON.parse(userMapsString) : [];
    
    // Se não foi fornecido email, retorna todos os mapas
    if (!email) {
      return userMaps;
    }
    
    // Filtrar mapas pelo email fornecido
    return userMaps.filter((map: any) => 
      map.email && map.email.toLowerCase() === email.toLowerCase()
    );
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return [];
  }
};
