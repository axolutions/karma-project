
import { toast } from "@/components/ui/use-toast";

// Temporary storage for authorized emails
// In a real app, this would be in a database
let authorizedEmails: string[] = [
  "test@example.com",
  "cliente@teste.com",
  "user@example.com"
];

// Temporary storage for user data
// In a real app, this would be in a database
interface UserData {
  email: string;
  name: string;
  birthDate: string;
  karmicNumbers: any;
  createdAt: Date;
}

const userDatabase: Record<string, UserData> = {};

export function isAuthorizedEmail(email: string): boolean {
  return authorizedEmails.includes(email.toLowerCase());
}

export function addAuthorizedEmail(email: string): boolean {
  if (authorizedEmails.includes(email.toLowerCase())) {
    return false;
  }
  
  authorizedEmails.push(email.toLowerCase());
  return true;
}

export function removeAuthorizedEmail(email: string): boolean {
  const index = authorizedEmails.indexOf(email.toLowerCase());
  if (index > -1) {
    authorizedEmails.splice(index, 1);
    return true;
  }
  return false;
}

export function getAllAuthorizedEmails(): string[] {
  return [...authorizedEmails];
}

export function saveUserData(userData: Omit<UserData, 'createdAt'>): void {
  userDatabase[userData.email.toLowerCase()] = {
    ...userData,
    createdAt: new Date()
  };
  
  // Save to localStorage for persistence between sessions
  localStorage.setItem('karmicUserData', JSON.stringify(userDatabase));
}

export function getUserData(email: string): UserData | null {
  // Check if we need to load from localStorage
  if (Object.keys(userDatabase).length === 0) {
    const savedData = localStorage.getItem('karmicUserData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        Object.assign(userDatabase, parsed);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
      }
    }
  }
  
  return userDatabase[email.toLowerCase()] || null;
}

export function loadDatabaseFromStorage(): void {
  const savedEmails = localStorage.getItem('karmicAuthorizedEmails');
  if (savedEmails) {
    try {
      authorizedEmails = JSON.parse(savedEmails);
    } catch (error) {
      console.error("Error parsing saved emails:", error);
    }
  }
  
  const savedUserData = localStorage.getItem('karmicUserData');
  if (savedUserData) {
    try {
      Object.assign(userDatabase, JSON.parse(savedUserData));
    } catch (error) {
      console.error("Error parsing saved user data:", error);
    }
  }
}

// Initialize from localStorage when module loads
loadDatabaseFromStorage();

// Authentication functions
export function login(email: string): boolean {
  if (!isAuthorizedEmail(email)) {
    toast({
      title: "Acesso negado",
      description: "Este email não está autorizado a acessar o sistema.",
      variant: "destructive"
    });
    return false;
  }
  
  // Store in session
  sessionStorage.setItem('karmicCurrentUser', email.toLowerCase());
  return true;
}

export function getCurrentUser(): string | null {
  return sessionStorage.getItem('karmicCurrentUser');
}

export function logout(): void {
  sessionStorage.removeItem('karmicCurrentUser');
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}
