
/**
 * Utility functions for karmic number calculations
 */

// Função para calcular dígito único (soma dos dígitos até resultar em um único dígito)
export function calculateSingleDigit(number: number): number {
  console.log("Calculando dígito único para:", number);
  
  if (number === 11 || number === 22 || number === 33) {
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
    if (sum === 11 || sum === 22 || sum === 33) {
      console.log("Número mestre encontrado após soma:", sum);
      return sum; // Preservar números mestres
    }
    console.log("Soma ainda não é um dígito único:", sum);
    return calculateSingleDigit(sum);
  }
  
  console.log("Dígito único calculado:", sum);
  return sum;
}

// Função para calcular o Selo Kármico com base na data de nascimento
export function calculateKarmicSeal(birthDate: string): number {
  console.log("Calculando Selo Kármico para data:", birthDate);
  try {
    // Verifica se o formato é DD/MM/AAAA
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Calcular com base nos algoritmos específicos
    // Exemplo: somar todos os dígitos e reduzir a um único dígito
    const sum = day + month + year;
    const result = calculateSingleDigit(sum);
    
    console.log("Selo Kármico calculado:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Selo Kármico:", error);
    return 0; // Valor padrão em caso de erro
  }
}

// Função para calcular o Chamado do Destino
export function calculateDestinyCall(birthDate: string): number {
  console.log("Calculando Chamado do Destino para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Algoritmo diferente para este cálculo
    const sum = day * 2 + month + Math.floor(year / 100) + (year % 100);
    const result = calculateSingleDigit(sum);
    
    console.log("Chamado do Destino calculado:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Chamado do Destino:", error);
    return 0;
  }
}

// Função para calcular o Portal do Karma
export function calculateKarmaPortal(birthDate: string): number {
  console.log("Calculando Portal do Karma para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Algoritmo específico
    const sum = day + month * 2 + Math.floor(year / 10);
    const result = calculateSingleDigit(sum);
    
    console.log("Portal do Karma calculado:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Portal do Karma:", error);
    return 0;
  }
}

// Função para calcular a Herança Kármica
export function calculateKarmicInheritance(birthDate: string): number {
  console.log("Calculando Herança Kármica para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Algoritmo
    const sum = Math.floor(day / 10) + (day % 10) + Math.floor(month / 10) + (month % 10) + Math.floor(year / 1000) + Math.floor((year % 1000) / 100) + Math.floor((year % 100) / 10) + (year % 10);
    const result = calculateSingleDigit(sum);
    
    console.log("Herança Kármica calculada:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Herança Kármica:", error);
    return 0;
  }
}

// Função para calcular Códex da Reprogramação
export function calculateKarmicReprogramming(birthDate: string): number {
  console.log("Calculando Códex da Reprogramação para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Algoritmo
    const sumDay = Math.floor(day / 10) + (day % 10);
    const sumMonth = Math.floor(month / 10) + (month % 10);
    const sumYear = Math.floor(year / 1000) + Math.floor((year % 1000) / 100) + Math.floor((year % 100) / 10) + (year % 10);
    
    const sum = sumDay * sumMonth + sumYear;
    const result = calculateSingleDigit(sum);
    
    console.log("Códex da Reprogramação calculado:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Códex da Reprogramação:", error);
    return 0;
  }
}

// Função para calcular Profecia dos Ciclos
export function calculateCycleProphecy(birthDate: string): number {
  console.log("Calculando Profecia dos Ciclos para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Algoritmo 
    const sumDayMonth = day + month;
    const sumYear = Math.floor(year / 1000) + Math.floor((year % 1000) / 100) + Math.floor((year % 100) / 10) + (year % 10);
    
    const sum = sumDayMonth + sumYear * 2;
    const result = calculateSingleDigit(sum);
    
    console.log("Profecia dos Ciclos calculada:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Profecia dos Ciclos:", error);
    return 0;
  }
}

// Função para calcular Marca Espiritual
export function calculateSpiritualMark(birthDate: string): number {
  console.log("Calculando Marca Espiritual para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Algoritmo
    const reverseDay = (day % 10) * 10 + Math.floor(day / 10);
    const reverseMonth = (month % 10) * 10 + Math.floor(month / 10);
    
    const sum = reverseDay + reverseMonth + (year % 100);
    const result = calculateSingleDigit(sum);
    
    console.log("Marca Espiritual calculada:", result);
    return result;
  } catch (error) {
    console.error("Erro ao calcular Marca Espiritual:", error);
    return 0;
  }
}

// Função para calcular Enigma da Manifestação
export function calculateManifestationEnigma(birthDate: string): number {
  console.log("Calculando Enigma da Manifestação para data:", birthDate);
  try {
    // Verifica formato
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      console.error("Formato de data inválido:", birthDate);
      return 0;
    }
    
    const [day, month, year] = birthDate.split('/').map(Number);
    
    // Algoritmo
    const sum = (day + month + year) * 3 - (day * month);
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
