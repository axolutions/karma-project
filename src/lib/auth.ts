
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

// Inicialização do banco de dados em memória
const userDatabase: Record<string, UserData[]> = {};

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
  console.log("Salvando dados do usuário:", userData);
  
  try {
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
    console.log("Dados salvos com sucesso. ID gerado:", newRecord.id);
    console.log("Database após salvar:", userDatabase);
    
    return newRecord.id; // Retornar o ID para referência futura
  } catch (error) {
    console.error("Erro ao salvar dados do usuário:", error);
    throw new Error("Falha ao salvar dados do usuário");
  }
}

export function getUserData(email: string, id?: string): UserData | null {
  // Debug logging
  console.log("Obtendo dados do usuário. Email:", email, "ID:", id);
  console.log("Estado atual do DB:", userDatabase);
  
  // Check if we need to load from localStorage
  if (Object.keys(userDatabase).length === 0) {
    loadDatabaseFromStorage();
  }
  
  const userRecords = userDatabase[email.toLowerCase()];
  
  if (!userRecords || userRecords.length === 0) {
    console.log("Nenhum registro encontrado para o email:", email);
    return null;
  }
  
  // Log available records
  console.log("Registros disponíveis para", email, ":", userRecords.map(r => r.id));
  
  // Se um ID específico for fornecido, retornar esse registro específico
  if (id) {
    const specificRecord = userRecords.find(record => record.id === id);
    console.log("Registro específico encontrado:", specificRecord);
    return specificRecord || null;
  }
  
  // Caso contrário, retornar o registro mais recente
  console.log("Retornando o registro mais recente:", userRecords[userRecords.length - 1]);
  return userRecords[userRecords.length - 1];
}

export function getAllUserDataByEmail(email: string): UserData[] {
  // Check if we need to load from localStorage
  if (Object.keys(userDatabase).length === 0) {
    loadDatabaseFromStorage();
  }
  
  return userDatabase[email.toLowerCase()] || [];
}

export function loadDatabaseFromStorage(): void {
  console.log("Carregando database do localStorage");
  
  const savedEmails = localStorage.getItem('karmicAuthorizedEmails');
  if (savedEmails) {
    try {
      authorizedEmails = JSON.parse(savedEmails);
      console.log("Emails autorizados carregados:", authorizedEmails);
    } catch (error) {
      console.error("Erro ao carregar emails salvos:", error);
    }
  } else {
    // Se não houver emails salvos, salva a lista inicial
    localStorage.setItem('karmicAuthorizedEmails', JSON.stringify(authorizedEmails));
    console.log("Lista inicial de emails salvos no localStorage");
  }
  
  const savedUserData = localStorage.getItem('karmicUserData');
  if (savedUserData) {
    try {
      const parsed = JSON.parse(savedUserData);
      console.log("Dados de usuário carregados do localStorage:", parsed);
      
      // Limpar o banco de dados atual
      Object.keys(userDatabase).forEach(key => {
        delete userDatabase[key];
      });
      
      // Copiar os dados do localStorage
      Object.keys(parsed).forEach(email => {
        userDatabase[email] = parsed[email];
      });
      
      console.log("Banco de dados carregado com sucesso:", userDatabase);
    } catch (error) {
      console.error("Erro ao carregar dados de usuário salvos:", error);
    }
  } else {
    console.log("Nenhum dado de usuário encontrado no localStorage");
  }
}

// Authentication functions
export function login(email: string): boolean {
  console.log("Tentativa de login para:", email);
  
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
  console.log("Login realizado com sucesso para:", email);
  return true;
}

export function getCurrentUser(): string | null {
  return sessionStorage.getItem('karmicCurrentUser');
}

export function logout(): void {
  sessionStorage.removeItem('karmicCurrentUser');
  sessionStorage.removeItem('karmicCurrentMatrixId');
  console.log("Logout realizado");
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

export function setCurrentMatrixId(id: string): void {
  console.log("Definindo ID da matriz atual:", id);
  sessionStorage.setItem('karmicCurrentMatrixId', id);
}

export function getCurrentMatrixId(): string | null {
  return sessionStorage.getItem('karmicCurrentMatrixId');
}

// Initialize from localStorage when module loads
console.log("Inicializando módulo de autenticação");
loadDatabaseFromStorage();
