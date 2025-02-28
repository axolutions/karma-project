
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { calculateAllKarmicNumbers } from '@/lib/calculations';
import { toast } from "@/components/ui/use-toast";

interface DateInputProps {
  onCalculate: (birthDate: string, karmicNumbers: ReturnType<typeof calculateAllKarmicNumbers>) => void;
}

const DateInput: React.FC<DateInputProps> = ({ onCalculate }) => {
  const [birthDate, setBirthDate] = useState('');
  const [isValid, setIsValid] = useState(true);

  const formatDate = (value: string) => {
    // Filter out non-numeric characters except /
    let filtered = value.replace(/[^\d/]/g, '');
    
    // Add slashes automatically
    if (filtered.length > 2 && filtered.charAt(2) !== '/') {
      filtered = filtered.substring(0, 2) + '/' + filtered.substring(2);
    }
    if (filtered.length > 5 && filtered.charAt(5) !== '/') {
      filtered = filtered.substring(0, 5) + '/' + filtered.substring(5);
    }
    
    // Truncate if too long
    if (filtered.length > 10) {
      filtered = filtered.substring(0, 10);
    }
    
    return filtered;
  };

  const validateDate = (value: string): boolean => {
    // Check format
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(value)) return false;
    
    const [day, month, year] = value.split('/').map(Number);
    
    // Check valid ranges
    if (month < 1 || month > 12) return false;
    if (day < 1) return false;
    
    // Check days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;
    
    // Check reasonable year range
    if (year < 1900 || year > new Date().getFullYear()) return false;
    
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDate(e.target.value);
    setBirthDate(formattedValue);
    
    // Only validate if we have a complete date
    if (formattedValue.length === 10) {
      setIsValid(validateDate(formattedValue));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!birthDate || !validateDate(birthDate)) {
      toast({
        title: "Data inválida",
        description: "Por favor, insira uma data de nascimento válida no formato DD/MM/AAAA.",
        variant: "destructive"
      });
      setIsValid(false);
      return;
    }
    
    const karmicNumbers = calculateAllKarmicNumbers(birthDate);
    onCalculate(birthDate, karmicNumbers);
    
    toast({
      title: "Matriz Kármica Calculada",
      description: "Sua matriz kármica foi calculada com sucesso.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto animate-fade-up">
      <div className="space-y-2">
        <label htmlFor="birthDate" className="text-sm font-medium text-karmic-700">
          Data de Nascimento
        </label>
        <Input
          id="birthDate"
          placeholder="DD/MM/AAAA"
          value={birthDate}
          onChange={handleChange}
          className={`transition-all duration-200 ${!isValid ? 'border-red-500 focus:ring-red-500' : 'focus:ring-karmic-500'}`}
        />
        {!isValid && (
          <p className="text-red-500 text-xs animate-fade-in">
            Por favor, insira uma data válida no formato DD/MM/AAAA
          </p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="karmic-button w-full group"
      >
        Calcular Matriz Kármica
        <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </form>
  );
};

export default DateInput;
