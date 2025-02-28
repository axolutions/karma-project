
// Utility function to reduce a number to a single digit
// Except for master numbers: 11, 22, 33, 44
export function reduceNumber(num: number): number {
  if (num === 11 || num === 22 || num === 33 || num === 44) {
    return num;
  }
  
  if (num > 9) {
    const digits = num.toString().split('').map(Number);
    const sum = digits.reduce((acc, digit) => acc + digit, 0);
    return reduceNumber(sum);
  }
  
  return num;
}

// Parse date in format DD/MM/YYYY
function parseBirthDate(birthDate: string): { day: number; month: number; year: number } {
  const [day, month, year] = birthDate.split('/').map(Number);
  return { day, month, year };
}

// Calculate Spiritual Mark
export function calculateSpiritualMark(birthDate: string): number {
  const { day, month, year } = parseBirthDate(birthDate);
  
  // Sum all digits in the birth date
  const destinyNumber = reduceNumber(day + month + reduceNumber(year));
  
  // Spiritual Mark = Destiny Number - Birth Day
  let spiritualMark = destinyNumber - day;
  
  // If negative, add 9
  if (spiritualMark < 0) {
    spiritualMark += 9;
  }
  
  return reduceNumber(spiritualMark);
}

// Calculate Destiny Call
export function calculateDestinyCall(birthDate: string): number {
  const { day, month, year } = parseBirthDate(birthDate);
  
  // Sum all digits in the birth date
  const allDigits = day.toString() + month.toString() + year.toString();
  const sum = allDigits.split('').map(Number).reduce((acc, digit) => acc + digit, 0);
  
  return reduceNumber(sum);
}

// Calculate Karma Portal
export function calculateKarmaPortal(birthDate: string): number {
  const { day, month } = parseBirthDate(birthDate);
  
  // Sum the birth day and month with a fixed year (2025)
  const karmaYear = 2025;
  const sum = day + month + karmaYear;
  
  return reduceNumber(sum);
}

// Calculate Karmic Inheritance
export function calculateKarmicInheritance(birthDate: string): number {
  // This is a simplified example - in a real implementation, 
  // this would use more complex formulas based on karmic challenges
  const { day, month, year } = parseBirthDate(birthDate);
  
  // Sum digits in reversed order
  const challenge1 = reduceNumber(Math.abs(month - day));
  const yearSum = reduceNumber(year);
  const challenge2 = reduceNumber(Math.abs(day - yearSum));
  const challenge3 = reduceNumber(Math.abs(challenge1 - challenge2));
  const challenge4 = reduceNumber(Math.abs(month - yearSum));
  
  // Karmic Inheritance is the sum of all challenges
  return reduceNumber(challenge1 + challenge2 + challenge3 + challenge4);
}

// Calculate all Karmic Numbers
export function calculateAllKarmicNumbers(birthDate: string): {
  spiritualMark: number;
  destinyCall: number;
  karmaPortal: number;
  karmicInheritance: number;
} {
  return {
    spiritualMark: calculateSpiritualMark(birthDate),
    destinyCall: calculateDestinyCall(birthDate),
    karmaPortal: calculateKarmaPortal(birthDate),
    karmicInheritance: calculateKarmicInheritance(birthDate)
  };
}
