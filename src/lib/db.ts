
interface UserData {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  [key: string]: any;
}

interface Database {
  [email: string]: UserData;
}

// Initialize or retrieve the database from localStorage
export const getDb = (): Database => {
  try {
    const dbString = localStorage.getItem('userDatabase');
    if (dbString) {
      return JSON.parse(dbString);
    }
    // Initialize empty database if none exists
    const initialDb: Database = {};
    localStorage.setItem('userDatabase', JSON.stringify(initialDb));
    return initialDb;
  } catch (error) {
    console.error('Error getting database:', error);
    return {};
  }
};

// Save the database to localStorage
export const saveDb = (db: Database): void => {
  try {
    localStorage.setItem('userDatabase', JSON.stringify(db));
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// Get all user data
export const getAllUserData = (): Database => {
  return getDb();
};

// Get user data by email
export const getUserDataByEmail = (email: string): UserData | null => {
  const db = getDb();
  return db[email] || null;
};

// Save user data
export const saveUserData = (email: string, data: UserData): void => {
  const db = getDb();
  db[email] = { ...db[email], ...data };
  saveDb(db);
};

// Get all user data by email (returns an array of all user data)
export const getAllUserDataByEmail = (): UserData[] => {
  const db = getDb();
  return Object.values(db);
};

// Current matrix tracking
export const getCurrentMatrixId = (email: string): string | null => {
  const userData = getUserDataByEmail(email);
  return userData?.currentMatrixId || null;
};

export const setCurrentMatrixId = (email: string, matrixId: string): void => {
  const userData = getUserDataByEmail(email);
  if (userData) {
    userData.currentMatrixId = matrixId;
    saveUserData(email, userData);
  }
};

// Authorized email management
const AUTHORIZED_EMAILS_KEY = 'authorizedEmails';

export const getAllAuthorizedEmails = (): string[] => {
  try {
    const emailsString = localStorage.getItem(AUTHORIZED_EMAILS_KEY);
    if (emailsString) {
      return JSON.parse(emailsString);
    }
    // Initialize with default emails
    const initialEmails = ['example1@example.com', 'example2@example.com'];
    localStorage.setItem(AUTHORIZED_EMAILS_KEY, JSON.stringify(initialEmails));
    return initialEmails;
  } catch (error) {
    console.error('Error getting authorized emails:', error);
    return ['example1@example.com', 'example2@example.com'];
  }
};

export const addAuthorizedEmail = (email: string): void => {
  const emails = getAllAuthorizedEmails();
  if (!emails.includes(email)) {
    emails.push(email);
    localStorage.setItem(AUTHORIZED_EMAILS_KEY, JSON.stringify(emails));
  }
};

export const removeAuthorizedEmail = (email: string): void => {
  const emails = getAllAuthorizedEmails();
  const newEmails = emails.filter(e => e !== email);
  localStorage.setItem(AUTHORIZED_EMAILS_KEY, JSON.stringify(newEmails));
};
