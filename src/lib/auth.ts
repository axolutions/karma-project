
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
  
  console.log("Obtendo dados do usuário. Email:", email, "ID:", { undefined });
  return null;
};

// Function to login the user
export const login = (email: string): boolean => {
  const db = getDb();
  if (db && db[email]) {
    localStorage.setItem('currentUser', email);
    return true;
  }
  return false;
};

// Function to check if the email is authorized
export const isAuthorizedEmail = (email: string): boolean => {
  const authorizedEmails = getAllAuthorizedEmails();
  return authorizedEmails.includes(email);
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
  
  saveData(email, userData);
  return userData.id || '';
};

export const getAllUserDataByEmail = (): any[] => {
  return getAllUsers();
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
