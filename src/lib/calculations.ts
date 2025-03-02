
/**
 * Utility functions for karmic number calculations
 */

// Função para calcular dígito único (soma dos dígitos até resultar em um único dígito)
// Preserva números mestres: 11, 22, 33, 44
export function calculateSingleDigit(number: number): number {
  console.log("Calculando dígito único para:", number);
  
  if (number === 11 || number === 22 || number === 33 || number === 44) {
    console.log("Número mestre encontrado:", number);
    return number; // Números mestres são preservados
  }
  
  if (number < 10) {
    console.log("Já é um dígito único:", number);
    return number;
  }
  
  // Somar os dígitos
  let sum = 0;
  let n = number;
  while (n > 0) {
    sum += n % 10;
    n = Math.floor(n / 10);
  }
  
  // Recursar se ainda não for um único dígito
  if (sum >= 10) {
    if (sum === 11 || sum === 22 || sum === 33 || sum === 44) {
      console.log("Número mestre encontrado após soma:", sum);
      return sum; // Preservar números mestres
    }
    console.log("Soma ainda não é um dígito único:", sum);
    return calculateSingleDigit(sum);
  }
  
  console.log("Dígito único calculado:", sum);
  return sum;
}

// Calcular a soma reduzida de um ano (ex: 1983 -> 1+9+8+3 = 21 -> 2+1 = 3)
function calculateReducedYearSum(year: number): number {
  let sum = 0;
  while (year > 0) {
    sum += year % 10;
    year = Math.floor(year / 10);
  }
  return calculateSingleDigit(sum);
}

// 1. Selo Kármico 2025
// Cálculo: (Dia + Mês de Nascimento) - (soma e reducao a um digito ano de nascimento)
export function calculateKarmicSeal(birthDate: string): number {
  console.log("Calculando Selo Kármico para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Soma dia + mês
    const dayMonthSum = day + month;
    
    // Reduz o ano a um dígito único
    const reducedYear = calculateReducedYearSum(year);
    
    // Calcula: (dia + mês) - (ano reduzido)
    let result = dayMonthSum - reducedYear;
    
    // Se for negativo, converter para positivo
    if (result < 0) result = Math.abs(result);
    
    // Reduzir a um dígito único (preservando números mestres)
    result = calculateSingleDigit(result);
    
    console.log("Selo Kármico calculado:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Selo Kármico:", error);
    return 0;
  }
}

// 2. Chamado do Destino 2025
// Cálculo: (Dia + Mês + Ano de Nascimento), reduzido a um dígito
export function calculateDestinyCall(birthDate: string): number {
  console.log("Calculando Chamado do Destino para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Soma dia + mês + ano
    const sum = day + month + year;
    
    // Reduzir a um dígito único (preservando números mestres)
    const result = calculateSingleDigit(sum);
    
    console.log("Chamado do Destino calculado:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Chamado do Destino:", error);
    return 0;
  }
}

// 3. Portal do Karma 2025
// Cálculo: (Ano Atual 2025) + (Dia + Mês de Nascimento), reduzido a um dígito
export function calculateKarmaPortal(birthDate: string): number {
  console.log("Calculando Portal do Karma para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month] = birthDate.split('/').map(Number);
    const currentYear = 2025;
    
    // Soma ano atual + dia + mês 
    const sum = currentYear + day + month;
    
    // Reduzir a um dígito único (preservando números mestres)
    const result = calculateSingleDigit(sum);
    
    console.log("Portal do Karma calculado:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Portal do Karma:", error);
    return 0;
  }
}

// Funções auxiliares para calcular os desafios kármicos
function calculateKarmicChallenges(day: number, month: number, year: number): number[] {
  // Reduzir dia, mês e ano a dígito único
  const reducedDay = calculateSingleDigit(day);
  const reducedMonth = calculateSingleDigit(month);
  const reducedYear = calculateSingleDigit(year);
  
  // Calcular os 4 desafios
  const challenge1 = Math.abs(reducedDay - reducedMonth);
  const challenge2 = Math.abs(reducedDay - reducedYear);
  const challenge3 = Math.abs(challenge1 - challenge2);
  const challenge4 = Math.abs(reducedMonth - reducedYear);
  
  return [challenge1, challenge2, challenge3, challenge4];
}

// 4. Herança Kármica 2025
// Cálculo: Soma dos 4 Desafios Kármicos Individuais
export function calculateKarmicInheritance(birthDate: string): number {
  console.log("Calculando Herança Kármica para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Calcular os 4 desafios kármicos
    const challenges = calculateKarmicChallenges(day, month, year);
    
    // Somar os desafios
    const sum = challenges.reduce((acc, val) => acc + val, 0);
    
    // Reduzir a um dígito único (preservando números mestres)
    const result = calculateSingleDigit(sum);
    
    console.log("Herança Kármica calculada:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Herança Kármica:", error);
    return 0;
  }
}

// Calcular o Número do Destino (soma dos dígitos da data de nascimento)
function calculateDestinyNumber(day: number, month: number, year: number): number {
  // Converter cada componente para string, garantindo dois dígitos para dia e mês
  const dayStr = day.toString().padStart(2, '0');
  const monthStr = month.toString().padStart(2, '0');
  const yearStr = year.toString();
  
  // Somar todos os dígitos individualmente
  const sum = (dayStr + monthStr + yearStr).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  
  // Reduzir a um dígito único (preservando números mestres)
  return calculateSingleDigit(sum);
}

// Calcular o Ano Pessoal 2025
function calculatePersonalYear2025(day: number, month: number): number {
  const sum = day + month + 2025;
  return calculateSingleDigit(sum);
}

// 5. Códex da Reprogramação Kármica 2025
// Cálculo: (Número do Destino) + (Ano Pessoal 2025), reduzido a um dígito
export function calculateKarmicReprogramming(birthDate: string): number {
  console.log("Calculando Códex da Reprogramação para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Calcular Número do Destino (soma de todos os dígitos da data de nascimento)
    const destinyNumber = calculateDestinyNumber(day, month, year);
    
    // Calcular Ano Pessoal 2025 (dia + mês + 2025)
    const personalYear2025 = calculatePersonalYear2025(day, month);
    
    // Soma Destino + Ano Pessoal
    const sum = destinyNumber + personalYear2025;
    
    // Reduzir a um dígito único (preservando números mestres)
    const result = calculateSingleDigit(sum);
    
    console.log("Códex da Reprogramação calculado:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Códex da Reprogramação:", error);
    return 0;
  }
}

// 6. Profecia dos Ciclos 2025
// Cálculo: (Dia + Mês + 2025), reduzido a um dígito (exceto 11 e 22)
export function calculateCycleProphecy(birthDate: string): number {
  console.log("Calculando Profecia dos Ciclos para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month] = birthDate.split('/').map(Number);
    const currentYear = 2025;
    
    // Soma dia + mês + 2025
    const sum = day + month + currentYear;
    
    // Reduzir a um dígito único (preservando números mestres)
    const result = calculateSingleDigit(sum);
    
    console.log("Profecia dos Ciclos calculada:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Profecia dos Ciclos:", error);
    return 0;
  }
}

// 7. Marca Espiritual 2025
// Cálculo: (Número do Destino) - (Dia de Nascimento)
export function calculateSpiritualMark(birthDate: string): number {
  console.log("Calculando Marca Espiritual para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Calcular o Número do Destino (soma de todos os dígitos da data)
    const destinyNumber = calculateDestinyNumber(day, month, year);
    
    // Destino - Dia de Nascimento
    let result = destinyNumber - day;
    
    // Se for negativo, converter para positivo
    if (result < 0) result = Math.abs(result);
    
    // Reduzir a um dígito único (preservando números mestres)
    result = calculateSingleDigit(result);
    
    console.log("Marca Espiritual calculada:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Marca Espiritual:", error);
    return 0;
  }
}

// 8. Enigma da Manifestação 2025
// Cálculo: (Ano Pessoal 2025) + (Últimos dois dígitos do Ano de Nascimento), reduzido a um dígito
export function calculateManifestationEnigma(birthDate: string): number {
  console.log("Calculando Enigma da Manifestação para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Calcular Ano Pessoal 2025 (dia + mês + 2025)
    const personalYear2025 = calculatePersonalYear2025(day, month);
    
    // Obter os últimos 2 dígitos do ano de nascimento
    const lastTwoDigitsYear = year % 100;
    
    // Soma Ano Pessoal + últimos 2 dígitos do ano
    const sum = personalYear2025 + lastTwoDigitsYear;
    
    // Reduzir a um dígito único (preservando números mestres)
    const result = calculateSingleDigit(sum);
    
    console.log("Enigma da Manifestação calculado:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Enigma da Manifestação:", error);
    return 0;
  }
}

// Função para calcular todos os números kármicos de uma vez
export function calculateAllKarmicNumbers(birthDate: string) {
  console.log("Calculando todos os números kármicos para data:", birthDate);
  try {
    // Para garantir que todos os cálculos são feitos mesmo se algum falhar
    const karmicSeal = calculateKarmicSeal(birthDate);
    const destinyCall = calculateDestinyCall(birthDate);
    const karmaPortal = calculateKarmaPortal(birthDate);
    const karmicInheritance = calculateKarmicInheritance(birthDate);
    const karmicReprogramming = calculateKarmicReprogramming(birthDate);
    const cycleProphecy = calculateCycleProphecy(birthDate);
    const spiritualMark = calculateSpiritualMark(birthDate);
    const manifestationEnigma = calculateManifestationEnigma(birthDate);
    
    const result = {
      karmicSeal,
      destinyCall,
      karmaPortal,
      karmicInheritance,
      karmicReprogramming,
      cycleProphecy,
      spiritualMark,
      manifestationEnigma
    };
    
    console.log("Todos os números kármicos calculados:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular todos os números kármicos:", error);
    // Retornar valores padrão em caso de erro
    return {
      karmicSeal: 0,
      destinyCall: 0,
      karmaPortal: 0,
      karmicInheritance: 0,
      karmicReprogramming: 0,
      cycleProphecy: 0,
      spiritualMark: 0,
      manifestationEnigma: 0
    };
  }
}
