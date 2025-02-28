
import { toast } from "@/components/ui/use-toast";

// Temporary storage for authorized emails
// In a real app, this would be in a database
let authorizedEmails: string[] = [
  "test@example.com",
  "cliente@teste.com",
  "user@example.com",
  "teste@teste.com" // Adicionamos o email diretamente aqui também
];

// Temporary storage for user data
// In a real app, this would be in a database
interface UserData {
  email: string;
  name: string;
  birthDate: string;
  karmicNumbers: any;
  createdAt: Date;
  id?: string; // ID único para cada registro
}

const userDatabase: Record<string, UserData[]> = {}; // Mudamos para um array de UserData por email

export function isAuthorizedEmail(email: string): boolean {
  return authorizedEmails.includes(email.toLowerCase());
}

export function addAuthorizedEmail(email: string): boolean {
  if (authorizedEmails.includes(email.toLowerCase())) {
    return false;
  }
  
  authorizedEmails.push(email.toLowerCase());
  
  // Save to localStorage immediately after adding
  localStorage.setItem('karmicAuthorizedEmails', JSON.stringify(authorizedEmails));
  
  return true;
}

export function removeAuthorizedEmail(email: string): boolean {
  const index = authorizedEmails.indexOf(email.toLowerCase());
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

// Função para gerar um ID único baseado em timestamp e número aleatório
function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function saveUserData(userData: Omit<UserData, 'createdAt' | 'id'>): string {
  const email = userData.email.toLowerCase();
  const newRecord = {
    ...userData,
    id: generateUniqueId(),
    createdAt: new Date()
  };
  
  // Inicializar o array para este email se não existir
  if (!userDatabase[email]) {
    userDatabase[email] = [];
  }
  
  // Adicionar o novo registro ao array
  userDatabase[email].push(newRecord);
  
  // Save to localStorage for persistence between sessions
  localStorage.setItem('karmicUserData', JSON.stringify(userDatabase));
  
  return newRecord.id; // Retornar o ID para referência futura
}

export function getUserData(email: string, id?: string): UserData | null {
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
  
  const userRecords = userDatabase[email.toLowerCase()];
  
  if (!userRecords || userRecords.length === 0) {
    return null;
  }
  
  // Se um ID específico for fornecido, retornar esse registro específico
  if (id) {
    const specificRecord = userRecords.find(record => record.id === id);
    return specificRecord || null;
  }
  
  // Caso contrário, retornar o registro mais recente
  return userRecords[userRecords.length - 1];
}

export function getAllUserDataByEmail(email: string): UserData[] {
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
  
  return userDatabase[email.toLowerCase()] || [];
}

export function loadDatabaseFromStorage(): void {
  const savedEmails = localStorage.getItem('karmicAuthorizedEmails');
  if (savedEmails) {
    try {
      authorizedEmails = JSON.parse(savedEmails);
    } catch (error) {
      console.error("Error parsing saved emails:", error);
    }
  } else {
    // Se não houver emails salvos, salva a lista inicial
    localStorage.setItem('karmicAuthorizedEmails', JSON.stringify(authorizedEmails));
  }
  
  const savedUserData = localStorage.getItem('karmicUserData');
  if (savedUserData) {
    try {
      const parsed = JSON.parse(savedUserData);
      Object.keys(parsed).forEach(email => {
        userDatabase[email] = parsed[email];
      });
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
  sessionStorage.removeItem('karmicCurrentMatrixId');
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

export function setCurrentMatrixId(id: string): void {
  sessionStorage.setItem('karmicCurrentMatrixId', id);
}

export function getCurrentMatrixId(): string | null {
  return sessionStorage.getItem('karmicCurrentMatrixId');
}
