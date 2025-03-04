
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
export const getUserData = (email: string): any => {
  try {
    const userMaps = getAllUserDataByEmail(email);
    
    if (!userMaps || userMaps.length === 0) {
      return null;
    }
    
    // Filtrar apenas mapas completos (com nome e data de nascimento)
    const completeMaps = userMaps.filter((map: any) => map.name && map.birthDate);
    
    if (completeMaps.length === 0) {
      // Se não houver mapas completos, retornar o último mapa (mesmo incompleto)
      return userMaps[userMaps.length - 1];
    }
    
    // Retorna o último mapa completo criado para o usuário
    return completeMaps[completeMaps.length - 1];
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
    
    // Se não houver emails armazenados, inicializa com valores padrão
    if (!emailsString) {
      // Inclui o email do exemplo e o email projetovmtd@gmail.com
      const defaultEmails = [
        'example1@example.com', 
        'example2@example.com', 
        'teste@teste.com', 
        'projetovmtd@gmail.com', 
        'carlamaiaprojetos@gmail.com',
        'mariaal020804@gmail.com',
        'tesete@testelcom.br'
      ];
      localStorage.setItem('authorizedEmails', JSON.stringify(defaultEmails));
      return defaultEmails;
    }
    
    // Caso contrário, retorna os emails armazenados
    const storedEmails = JSON.parse(emailsString);
    
    // Garante que todos os emails importantes estejam na lista
    const criticalEmails = [
      'projetovmtd@gmail.com',
      'teste@teste.com',
      'carlamaiaprojetos@gmail.com',
      'mariaal020804@gmail.com',
      'tesete@testelcom.br'
    ];
    
    let updated = false;
    for (const email of criticalEmails) {
      if (!storedEmails.some((e: string) => e.toLowerCase().trim() === email.toLowerCase())) {
        storedEmails.push(email);
        updated = true;
        console.log(`Email crítico adicionado: ${email}`);
      }
    }
    
    if (updated) {
      localStorage.setItem('authorizedEmails', JSON.stringify(storedEmails));
      console.log('Lista de emails atualizada com emails críticos');
    }
    
    return storedEmails;
  } catch (error) {
    console.error('Erro ao obter emails autorizados:', error);
    // Em caso de erro, retorna uma lista padrão
    return [
      'example1@example.com', 
      'example2@example.com', 
      'teste@teste.com', 
      'projetovmtd@gmail.com', 
      'carlamaiaprojetos@gmail.com',
      'mariaal020804@gmail.com',
      'tesete@testelcom.br'
    ];
  }
};

export const isAuthorizedEmail = (email: string): boolean => {
  try {
    const authorizedEmails = getAllAuthorizedEmails();
    const normalizedEmail = email.toLowerCase().trim();
    
    // Imprime para debug
    console.log("Verificando autorização para:", normalizedEmail);
    console.log("Lista de emails autorizados:", authorizedEmails);
    
    // Emails críticos que sempre devem ser autorizados
    const criticalEmails = [
      'projetovmtd@gmail.com',
      'teste@teste.com',
      'carlamaiaprojetos@gmail.com',
      'mariaal020804@gmail.com',
      'tesete@testelcom.br'
    ];
    
    // Primeiro verifica emails críticos
    if (criticalEmails.some(e => e.toLowerCase() === normalizedEmail)) {
      console.log("Email crítico autorizado:", normalizedEmail);
      return true;
    }
    
    // Compara o email normalizado com cada email autorizado
    if (authorizedEmails.some(e => e.toLowerCase().trim() === normalizedEmail)) {
      console.log("Email autorizado encontrado na lista");
      return true;
    }
    
    console.log("Email não autorizado");
    return false;
  } catch (error) {
    console.error('Erro ao verificar se email é autorizado:', error);
    
    // Em caso de erro, verifica se é um dos emails críticos
    const normalizedEmail = email.toLowerCase().trim();
    const criticalEmails = [
      'projetovmtd@gmail.com',
      'teste@teste.com',
      'carlamaiaprojetos@gmail.com',
      'mariaal020804@gmail.com',
      'tesete@testelcom.br'
    ];
    
    if (criticalEmails.some(e => e.toLowerCase() === normalizedEmail)) {
      console.log("Email crítico autorizado (fallback):", normalizedEmail);
      return true;
    }
    
    return false;
  }
};

export const addAuthorizedEmail = (email: string): void => {
  try {
    const authorizedEmails = getAllAuthorizedEmails();
    const normalizedEmail = email.toLowerCase().trim();
    
    // Verificar se o email já está na lista
    if (!authorizedEmails.some(e => e.toLowerCase().trim() === normalizedEmail)) {
      authorizedEmails.push(normalizedEmail);
      localStorage.setItem('authorizedEmails', JSON.stringify(authorizedEmails));
      console.log("Email adicionado à lista de autorizados:", normalizedEmail);
    } else {
      console.log("Email já está na lista de autorizados:", normalizedEmail);
    }
  } catch (error) {
    console.error('Erro ao adicionar email autorizado:', error);
  }
};

export const removeAuthorizedEmail = (email: string): void => {
  try {
    const authorizedEmails = getAllAuthorizedEmails();
    const normalizedEmail = email.toLowerCase().trim();
    
    // Filtrar o email a ser removido
    const updatedEmails = authorizedEmails.filter(
      authorizedEmail => authorizedEmail.toLowerCase().trim() !== normalizedEmail
    );
    
    localStorage.setItem('authorizedEmails', JSON.stringify(updatedEmails));
    console.log("Email removido da lista de autorizados:", normalizedEmail);
  } catch (error) {
    console.error('Erro ao remover email autorizado:', error);
  }
};
