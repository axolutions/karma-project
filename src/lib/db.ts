
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
  
  // If this is a new entry for this email, initialize it as an array
  if (!db[email]) {
    db[email] = { ...data };
  } else {
    // Update existing data
    db[email] = { ...db[email], ...data };
  }
  
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
const EMAIL_AUTH_COUNTS_KEY = 'emailAuthCounts';

// Get counts of authorizations for each email
export const getEmailAuthCounts = (): Record<string, number> => {
  try {
    const countsString = localStorage.getItem(EMAIL_AUTH_COUNTS_KEY);
    if (countsString) {
      return JSON.parse(countsString);
    }
    // Initialize with empty counts if none exist
    return {};
  } catch (error) {
    console.error('Error getting email auth counts:', error);
    return {};
  }
};

// Save authorization counts
export const saveEmailAuthCounts = (counts: Record<string, number>): void => {
  try {
    localStorage.setItem(EMAIL_AUTH_COUNTS_KEY, JSON.stringify(counts));
  } catch (error) {
    console.error('Error saving email auth counts:', error);
  }
};

export const getAllAuthorizedEmails = (): string[] => {
  try {
    const emailsString = localStorage.getItem(AUTHORIZED_EMAILS_KEY);
    // Add teste@teste.com to the default list
    const defaultEmails = ['example1@example.com', 'example2@example.com', 'teste@teste.com'];
    
    if (emailsString) {
      const storedEmails = JSON.parse(emailsString);
      // Ensure teste@teste.com is always included
      if (!storedEmails.includes('teste@teste.com')) {
        storedEmails.push('teste@teste.com');
        localStorage.setItem(AUTHORIZED_EMAILS_KEY, JSON.stringify(storedEmails));
      }
      return storedEmails;
    }
    
    // Initialize with default emails if none exist
    localStorage.setItem(AUTHORIZED_EMAILS_KEY, JSON.stringify(defaultEmails));
    return defaultEmails;
  } catch (error) {
    console.error('Error getting authorized emails:', error);
    // Always include teste@teste.com in fallback
    return ['example1@example.com', 'example2@example.com', 'teste@teste.com'];
  }
};

export const addAuthorizedEmail = (email: string): void => {
  const emails = getAllAuthorizedEmails();
  const counts = getEmailAuthCounts();
  
  // Increment the authorization count for this email
  counts[email] = (counts[email] || 0) + 1;
  saveEmailAuthCounts(counts);
  
  // Only add the email if it's not already in the list
  if (!emails.includes(email)) {
    emails.push(email);
    localStorage.setItem(AUTHORIZED_EMAILS_KEY, JSON.stringify(emails));
  }
};

export const removeAuthorizedEmail = (email: string): void => {
  const emails = getAllAuthorizedEmails();
  const counts = getEmailAuthCounts();
  
  // Remove the email from the counts
  delete counts[email];
  saveEmailAuthCounts(counts);
  
  const newEmails = emails.filter(e => e !== email);
  localStorage.setItem(AUTHORIZED_EMAILS_KEY, JSON.stringify(newEmails));
};

// Check how many matrices a user can create
export const getRemainingMatrixCount = (email: string): number => {
  const counts = getEmailAuthCounts();
  const userMaps = getAllUserDataByEmail().filter(map => map && map.email === email);
  
  // Total authorized count for this email
  const totalAuthorized = counts[email] || 0;
  
  // Number of maps already created
  const mapsCreated = userMaps.length;
  
  console.log(`Remaining matrix count calculation: totalAuthorized=${totalAuthorized}, mapsCreated=${mapsCreated}`);
  
  // Return remaining count (minimum 0)
  return Math.max(0, totalAuthorized - mapsCreated);
};
