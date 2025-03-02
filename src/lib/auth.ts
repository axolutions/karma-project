
import { 
  getDb, 
  saveUserData as saveData, 
  getAllUserDataByEmail as getAllUsers,
  setCurrentMatrixId as setMatrixId,
  getCurrentMatrixId as getMatrixId,
  getAllAuthorizedEmails,
  addAuthorizedEmail,
  removeAuthorizedEmail
} from './db';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  currentMatrixId?: string;
  // Add other user profile fields as necessary
}

// Function to check if the user is logged in
export const isLoggedIn = (): boolean => {
  const user = getCurrentUser();
  return !!user;
};

// Function to get the current user
export const getCurrentUser = (): string | null => {
  return localStorage.getItem('currentUser');
};

// Function to get user data
export const getUserData = (email: string): UserProfile | null => {
  const db = getDb();
  
  // Verifica se o email existe no banco de dados
  if (db && db[email]) {
    console.log("Obtendo dados do usuário. Email:", email, "Dados:", db[email]);
    return db[email];
  }
  
  console.log("Usuário não encontrado. Email:", email);
  return null;
};

// Function to login the user
export const login = (email: string): boolean => {
  console.log("Tentando fazer login para o email:", email);
  
  // Check if the email is authorized first
  const authorized = isAuthorizedEmail(email);
  console.log("Email está autorizado?", authorized);
  
  if (authorized) {
    localStorage.setItem('currentUser', email);
    console.log("Login bem-sucedido para:", email);
    return true;
  }
  
  console.log("Login falhou para:", email);
  return false;
};

// Function to check if the email is authorized
export const isAuthorizedEmail = (email: string): boolean => {
  const authorizedEmails = getAllAuthorizedEmails();
  console.log("Lista completa de emails autorizados:", authorizedEmails);
  
  const isAuthorized = authorizedEmails.includes(email);
  console.log("Verificando autorização para:", email, "Autorizado:", isAuthorized);
  
  return isAuthorized;
};

// Function to logout the user
export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

// Re-export needed functions from db.ts
export const saveUserData = (data: { email: string; [key: string]: any }): string => {
  if (!data.email) {
    throw new Error('Email is required to save user data');
  }
  
  const email = data.email;
  
  // Ensure the data has id and name properties as required by UserData type
  if (!data.id) {
    data.id = crypto.randomUUID(); // Generate a unique ID if not provided
  }
  
  if (!data.name) {
    data.name = ""; // Provide a default empty name if not provided
  }
  
  // Create a properly typed object to pass to saveData
  const userData = {
    id: data.id,
    name: data.name,
    email: data.email,
    ...data
  };
  
  console.log("Salvando dados do usuário:", userData);
  saveData(email, userData);
  return userData.id || '';
};

export const getAllUserDataByEmail = (): any[] => {
  const allUsers = getAllUsers();
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    console.log("Nenhum usuário logado para buscar dados");
    return [];
  }
  
  // Filtrar apenas dados do usuário atual
  const userDataArray = Object.values(allUsers).filter(user => 
    user && 
    user.email === currentUser && 
    user.id && // Certifique-se de que ID existe
    user.name !== undefined // Verifique se o nome existe (mesmo que seja vazio)
  );
  
  // Validar cada mapa para garantir que ele tem os dados necessários
  const validMaps = userDataArray.filter(map => {
    // Verificar se o mapa tem campos obrigatórios
    const hasRequiredFields = map && 
                             map.id && 
                             map.email === currentUser;
    
    // Apenas para logging
    if (!hasRequiredFields) {
      console.log("Mapa inválido encontrado e removido:", map);
    }
    
    return hasRequiredFields;
  });
  
  console.log(`Filtrando dados para o usuário logado: ${currentUser}. Total de mapas válidos: ${validMaps.length}`);
  return validMaps;
};

export const setCurrentMatrixId = (id: string): void => {
  const email = getCurrentUser();
  if (email) {
    setMatrixId(email, id);
  }
};

export const getCurrentMatrixId = (): string | null => {
  const email = getCurrentUser();
  if (email) {
    return getMatrixId(email);
  }
  return null;
};

export { 
  getAllAuthorizedEmails, 
  addAuthorizedEmail, 
  removeAuthorizedEmail 
};
