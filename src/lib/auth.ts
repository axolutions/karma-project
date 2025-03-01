import { getDb } from './db'; // Assuming you have a function to get your database

export interface UserProfile {
  id: string;
  name: string;
  email: string;
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
  const authorizedEmails = ['example1@example.com', 'example2@example.com']; // Replace with your authorized emails
  return authorizedEmails.includes(email);
};

// Function to logout the user
export const logout = (): void => {
  localStorage.removeItem('currentUser');
};
