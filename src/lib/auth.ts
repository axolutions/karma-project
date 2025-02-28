
import { toast } from "@/components/ui/use-toast";

// Temporary storage for authorized emails
// In a real app, this would be in a database
let authorizedEmails: string[] = [
  "projetovmtd8@gmail.com"
];

// Admin emails list
let adminEmails: string[] = [
  "projetovmtd8@gmail.com"
];

// Admin password - in a real app, this would be hashed and stored in a database
const ADMIN_PASSWORD = "karmic2024"; // Esta é a senha que você deve fornecer ao usuário

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

export function isAdmin(email: string): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  return adminEmails.includes(normalizedEmail);
}

export function isAuthorizedEmail(email: string): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  console.log("Verificando autorização para:", normalizedEmail);
  console.log("Lista atual de emails:", authorizedEmails);
  
  return authorizedEmails.includes(normalizedEmail);
}

export function addAuthorizedEmail(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  
  if (authorizedEmails.includes(normalizedEmail)) {
    return false;
  }
  
  authorizedEmails.push(normalizedEmail);
  
  // Save to localStorage immediately after adding
  localStorage.setItem('karmicAuthorizedEmails', JSON.stringify(authorizedEmails));
  
  return true;
}

export function removeAuthorizedEmail(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  const index = authorizedEmails.indexOf(normalizedEmail);
  
  if (index > -1) {
    authorizedEmails.splice(index, 1);
    
    // Save to localStorage immediately after removing
    localStorage.setItem('karmicAuthorizedEmails', JSON.stringify(authorizedEmails));
    
    return true;
  }
  return false;
}

export function getAllAuthorizedEmails(): string[] {
  return [...authorizedEmails];
}

export function saveUserData(userData: Omit<UserData, 'createdAt'>): void {
  const normalizedEmail = userData.email.toLowerCase().trim();
  
  userDatabase[normalizedEmail] = {
    ...userData,
    email: normalizedEmail, // Garantir que o email no banco de dados esteja normalizado
    createdAt: new Date()
  };
  
  // Save to localStorage for persistence between sessions
  localStorage.setItem('karmicUserData', JSON.stringify(userDatabase));
}

export function getUserData(email: string): UserData | null {
  if (!email) return null;
  
  const normalizedEmail = email.toLowerCase().trim();
  
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
  
  return userDatabase[normalizedEmail] || null;
}

export function loadDatabaseFromStorage(): void {
  const savedEmails = localStorage.getItem('karmicAuthorizedEmails');
  if (savedEmails) {
    try {
      authorizedEmails = JSON.parse(savedEmails);
      console.log("Emails carregados do localStorage:", authorizedEmails);
    } catch (error) {
      console.error("Error parsing saved emails:", error);
    }
  } else {
    // Se não houver emails salvos, salva a lista inicial
    localStorage.setItem('karmicAuthorizedEmails', JSON.stringify(authorizedEmails));
    console.log("Lista inicial de emails salva no localStorage:", authorizedEmails);
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
export function login(email: string, password?: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  
  if (!isAuthorizedEmail(normalizedEmail)) {
    toast({
      title: "Acesso negado",
      description: "Este email não está autorizado a acessar o sistema.",
      variant: "destructive"
    });
    return false;
  }
  
  // Para o email de administrador, verificar a senha
  if (isAdmin(normalizedEmail) && password !== ADMIN_PASSWORD) {
    toast({
      title: "Senha incorreta",
      description: "A senha fornecida está incorreta.",
      variant: "destructive"
    });
    return false;
  }
  
  // Store in session
  sessionStorage.setItem('karmicCurrentUser', normalizedEmail);
  console.log("Usuário logado:", normalizedEmail);
  return true;
}

export function getCurrentUser(): string | null {
  return sessionStorage.getItem('karmicCurrentUser');
}

export function logout(): void {
  sessionStorage.removeItem('karmicCurrentUser');
  console.log("Usuário deslogado");
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

// Função específica para verificar o login do admin com senha
export function adminLogin(email: string, password: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  
  if (!isAdmin(normalizedEmail)) {
    toast({
      title: "Acesso negado",
      description: "Este email não está autorizado como administrador.",
      variant: "destructive"
    });
    return false;
  }
  
  if (password !== ADMIN_PASSWORD) {
    toast({
      title: "Senha incorreta",
      description: "A senha fornecida está incorreta.",
      variant: "destructive"
    });
    return false;
  }
  
  // Store in session
  sessionStorage.setItem('karmicCurrentUser', normalizedEmail);
  sessionStorage.setItem('karmicAdminLogged', 'true');
  console.log("Administrador logado:", normalizedEmail);
  return true;
}

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem('karmicAdminLogged') === 'true';
}
