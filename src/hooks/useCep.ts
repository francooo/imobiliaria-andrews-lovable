import { useState, useCallback } from "react";

interface CepData {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface UseCepReturn {
  data: CepData | null;
  isLoading: boolean;
  error: string | null;
  fetchCep: (cep: string) => Promise<CepData | null>;
  clearData: () => void;
}

// Normaliza a cidade (sem acentos e caixa baixa)
const normalizeCidade = (cidade: string): string => {
  return cidade
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

// Valida formato do CEP
const isValidCepFormat = (cep: string): boolean => {
  const cleanCep = cep.replace(/\D/g, "");
  return cleanCep.length === 8;
};

// Formata o CEP com máscara
export const formatCep = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "").slice(0, 8);
  if (cleanValue.length > 5) {
    return `${cleanValue.slice(0, 5)}-${cleanValue.slice(5)}`;
  }
  return cleanValue;
};

export const useCep = (): UseCepReturn => {
  const [data, setData] = useState<CepData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCep = useCallback(async (cep: string): Promise<CepData | null> => {
    const cleanCep = cep.replace(/\D/g, "");

    // Validação de formato
    if (!isValidCepFormat(cleanCep)) {
      setError("CEP deve ter 8 dígitos");
      setData(null);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

      if (!response.ok) {
        throw new Error("Falha na comunicação com o serviço de CEP");
      }

      const result: ViaCepResponse = await response.json();

      if (result.erro) {
        setError("CEP não encontrado");
        setData(null);
        return null;
      }

      const cepData: CepData = {
        cep: result.cep,
        logradouro: result.logradouro || "",
        bairro: result.bairro || "",
        cidade: result.localidade,
        estado: result.uf,
      };

      setData(cepData);
      setError(null);
      return cepData;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Erro ao buscar CEP. Tente novamente.";
      setError(errorMessage);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchCep,
    clearData,
  };
};

export { normalizeCidade, isValidCepFormat };
export type { CepData };
