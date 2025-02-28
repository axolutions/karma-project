
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
export function parseBirthDate(birthDate: string): { day: number; month: number; year: number; yearLastTwo: number } {
  const [day, month, year] = birthDate.split('/').map(Number);
  const yearString = year.toString();
  const yearLastTwo = parseInt(yearString.substring(yearString.length - 2));
  return { day, month, year, yearLastTwo };
}

// 1. Selo Kármico 2025
export function calculateKarmicSeal(birthDate: string): number {
  const { day, month, yearLastTwo } = parseBirthDate(birthDate);
  
  // (Dia + Mês de Nascimento) - (Últimos dois dígitos do Ano de Nascimento)
  let result = (day + month) - yearLastTwo;
  
  // If negative, make it positive
  if (result < 0) {
    result = Math.abs(result);
  }
  
  return reduceNumber(result);
}

// 2. Chamado do Destino 2025
export function calculateDestinyCall(birthDate: string): number {
  const { day, month, year } = parseBirthDate(birthDate);
  
  // (Dia + Mês + Ano de Nascimento), mantendo números mestres
  const sum = day + month + year;
  
  return reduceNumber(sum);
}

// 3. Portal do Karma 2025
export function calculateKarmaPortal(birthDate: string): number {
  const { day, month } = parseBirthDate(birthDate);
  
  // (Ano Atual 2025) + (Dia + Mês de Nascimento)
  const currentYear = 2025;
  const sum = currentYear + day + month;
  
  return reduceNumber(sum);
}

// 4. Herança Kármica 2025
export function calculateKarmicInheritance(birthDate: string): number {
  const { day, month, year } = parseBirthDate(birthDate);
  
  // Calcular os 4 desafios kármicos
  const dayReduced = reduceNumber(day);
  const monthReduced = reduceNumber(month);
  const yearReduced = reduceNumber(year);
  
  const challenge1 = Math.abs(dayReduced - monthReduced);
  const challenge2 = Math.abs(dayReduced - yearReduced);
  const challenge3 = Math.abs(challenge1 - challenge2);
  const challenge4 = Math.abs(monthReduced - yearReduced);
  
  // Soma dos 4 desafios
  const sum = challenge1 + challenge2 + challenge3 + challenge4;
  
  return reduceNumber(sum);
}

// 5. Códex da Reprogramação Kármica
export function calculateKarmicReprogramming(birthDate: string): number {
  const { day, month, year } = parseBirthDate(birthDate);
  
  // Número do Destino (dia + mês + ano)
  const destinyNumber = reduceNumber(day + month + year);
  
  // Ano pessoal 2025
  const personalYear = reduceNumber(day + month + 2025);
  
  // Soma dos dois
  const sum = destinyNumber + personalYear;
  
  return reduceNumber(sum);
}

// 6. Profecia dos Ciclos 2025
export function calculateCycleProphecy(birthDate: string): number {
  const { day, month } = parseBirthDate(birthDate);
  
  // (Dia + Mês + 2025)
  const sum = day + month + 2025;
  const result = reduceNumber(sum);
  
  // Manter 11 e 22 como números mestres
  if (result === 11 || result === 22) {
    return result;
  }
  
  return reduceNumber(result);
}

// 7. Marca Espiritual 2025
export function calculateSpiritualMark(birthDate: string): number {
  const { day, month, year } = parseBirthDate(birthDate);
  
  // Calcular o número do destino
  const destinyNumber = reduceNumber(day + month + year);
  
  // Marca Espiritual = Número do Destino - Dia de Nascimento
  let result = destinyNumber - day;
  
  // Se for negativo, inverte para positivo
  if (result < 0) {
    result = Math.abs(result);
  }
  
  return reduceNumber(result);
}

// 8. Enigma da Manifestação 2025
export function calculateManifestationEnigma(birthDate: string): number {
  const { yearLastTwo } = parseBirthDate(birthDate);
  
  // Ano pessoal 2025 para esta pessoa
  const personalYear = reduceNumber(calculatePersonalYear(birthDate));
  
  // (Ano Pessoal 2025) + (Últimos dois dígitos do Ano de Nascimento)
  const sum = personalYear + yearLastTwo;
  
  return reduceNumber(sum);
}

// Função auxiliar para calcular o ano pessoal
function calculatePersonalYear(birthDate: string): number {
  const { day, month } = parseBirthDate(birthDate);
  return day + month + 2025;
}

// Calculate all Karmic Numbers
export function calculateAllKarmicNumbers(birthDate: string): {
  karmicSeal: number;
  destinyCall: number;
  karmaPortal: number;
  karmicInheritance: number;
  karmicReprogramming: number;
  cycleProphecy: number;
  spiritualMark: number;
  manifestationEnigma: number;
} {
  return {
    karmicSeal: calculateKarmicSeal(birthDate),
    destinyCall: calculateDestinyCall(birthDate),
    karmaPortal: calculateKarmaPortal(birthDate),
    karmicInheritance: calculateKarmicInheritance(birthDate),
    karmicReprogramming: calculateKarmicReprogramming(birthDate),
    cycleProphecy: calculateCycleProphecy(birthDate),
    spiritualMark: calculateSpiritualMark(birthDate),
    manifestationEnigma: calculateManifestationEnigma(birthDate)
  };
}
