
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
export const getUserData = (email: string): any => {
  try {
    const userMaps = getAllUserDataByEmail(email);
    
    if (!userMaps || userMaps.length === 0) {
      return null;
    }
    
    // Retorna o último mapa criado para o usuário
    return userMaps[userMaps.length - 1];
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
};

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
export const getAllAuthorizedEmails = (): string[] => {
  try {
    const emailsString = localStorage.getItem('authorizedEmails');
    return emailsString ? JSON.parse(emailsString) : [];
  } catch (error) {
    console.error('Erro ao obter emails autorizados:', error);
    return [];
  }
};

export const isAuthorizedEmail = (email: string): boolean => {
  try {
    const authorizedEmails = getAllAuthorizedEmails();
    return authorizedEmails.some(authorizedEmail => 
      authorizedEmail.toLowerCase() === email.toLowerCase()
    );
  } catch (error) {
    console.error('Erro ao verificar se email é autorizado:', error);
    return false;
  }
};

export const addAuthorizedEmail = (email: string): void => {
  try {
    const authorizedEmails = getAllAuthorizedEmails();
    
    // Verificar se o email já está na lista
    if (!isAuthorizedEmail(email)) {
      authorizedEmails.push(email);
      localStorage.setItem('authorizedEmails', JSON.stringify(authorizedEmails));
    }
  } catch (error) {
    console.error('Erro ao adicionar email autorizado:', error);
  }
};

export const removeAuthorizedEmail = (email: string): void => {
  try {
    let authorizedEmails = getAllAuthorizedEmails();
    
    // Remover o email da lista
    authorizedEmails = authorizedEmails.filter(
      authorizedEmail => authorizedEmail.toLowerCase() !== email.toLowerCase()
    );
    
    localStorage.setItem('authorizedEmails', JSON.stringify(authorizedEmails));
  } catch (error) {
    console.error('Erro ao remover email autorizado:', error);
  }
};
