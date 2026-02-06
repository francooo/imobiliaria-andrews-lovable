import { useState, useEffect, useCallback } from "react";
import { MapPin, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCep, formatCep, type CepData } from "@/hooks/useCep";
import { cn } from "@/lib/utils";

interface CepInputProps {
  value: string;
  onChange: (cep: string) => void;
  onAddressFound: (data: CepData) => void;
  onError?: (error: string | null) => void;
  className?: string;
  disabled?: boolean;
}

const CepInput = ({
  value,
  onChange,
  onAddressFound,
  onError,
  className,
  disabled = false,
}: CepInputProps) => {
  const { isLoading, error, fetchCep, data } = useCep();
  const [hasSearched, setHasSearched] = useState(false);

  // Chama a busca quando o CEP estiver completo
  const handleCepChange = useCallback(
    (inputValue: string) => {
      const formatted = formatCep(inputValue);
      onChange(formatted);

      // Buscar automaticamente quando tiver 8 dígitos
      const cleanCep = formatted.replace(/\D/g, "");
      if (cleanCep.length === 8) {
        setHasSearched(true);
        fetchCep(cleanCep).then((result) => {
          if (result) {
            onAddressFound(result);
          }
        });
      } else {
        setHasSearched(false);
      }
    },
    [onChange, fetchCep, onAddressFound]
  );

  // Propaga erros para o componente pai
  useEffect(() => {
    if (onError) {
      onError(error);
    }
  }, [error, onError]);

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
    }
    if (hasSearched && data && !error) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (hasSearched && error) {
      return <XCircle className="w-4 h-4 text-destructive" />;
    }
    return null;
  };

  return (
    <div className="space-y-1">
      <div className="relative">
        <label htmlFor="cep-input" className="sr-only">CEP</label>
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" aria-hidden="true" />
        <Input
          id="cep-input"
          type="text"
          inputMode="numeric"
          placeholder="CEP (00000-000)"
          value={value}
          onChange={(e) => handleCepChange(e.target.value)}
          className={cn(
            "pl-9 sm:pl-10 pr-10 h-11 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation",
            hasSearched && data && !error && "border-green-500 ring-1 ring-green-500/20",
            hasSearched && error && "border-destructive ring-1 ring-destructive/20",
            className
          )}
          disabled={disabled || isLoading}
          maxLength={9}
          autoComplete="postal-code"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-live="polite">
          {getStatusIcon()}
        </div>
      </div>
      {hasSearched && error && (
        <p className="text-xs sm:text-sm text-destructive" role="alert">{error}</p>
      )}
    </div>
  );
};

export default CepInput;
