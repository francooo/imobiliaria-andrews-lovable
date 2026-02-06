import { Home, Building2, MapPinned } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AddressData {
  logradouro: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface AddressFieldsProps {
  data: AddressData;
  onChange: (field: keyof AddressData, value: string) => void;
  isAutoFilled?: boolean;
  disabled?: boolean;
  compact?: boolean;
}

const AddressFields = ({
  data,
  onChange,
  isAutoFilled = false,
  disabled = false,
  compact = false,
}: AddressFieldsProps) => {
  const autoFilledClass = isAutoFilled
    ? "bg-primary/5 border-primary/30"
    : "";

  if (compact) {
    return (
      <fieldset className="grid grid-cols-2 gap-2 sm:gap-3">
        <legend className="sr-only">Endereço</legend>
        <div className="relative col-span-2">
          <label htmlFor="compact-logradouro" className="sr-only">Rua</label>
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <Input
            id="compact-logradouro"
            type="text"
            placeholder="Rua"
            value={data.logradouro}
            onChange={(e) => onChange("logradouro", e.target.value)}
            className={cn("pl-9 h-10 sm:h-11 bg-input border-border text-xs sm:text-sm touch-manipulation", autoFilledClass)}
            disabled={disabled}
            autoComplete="street-address"
          />
        </div>
        <div className="relative">
          <label htmlFor="compact-bairro" className="sr-only">Bairro</label>
          <Input
            id="compact-bairro"
            type="text"
            placeholder="Bairro"
            value={data.bairro}
            onChange={(e) => onChange("bairro", e.target.value)}
            className={cn("h-10 sm:h-11 bg-input border-border text-xs sm:text-sm touch-manipulation", autoFilledClass)}
            disabled={disabled}
          />
        </div>
        <div className="relative flex gap-2">
          <label htmlFor="compact-cidade" className="sr-only">Cidade</label>
          <Input
            id="compact-cidade"
            type="text"
            placeholder="Cidade"
            value={data.cidade}
            onChange={(e) => onChange("cidade", e.target.value)}
            className={cn("h-10 sm:h-11 bg-input border-border text-xs sm:text-sm flex-1 touch-manipulation", autoFilledClass)}
            disabled={disabled}
            autoComplete="address-level2"
          />
          <label htmlFor="compact-estado" className="sr-only">Estado</label>
          <Input
            id="compact-estado"
            type="text"
            placeholder="UF"
            value={data.estado}
            onChange={(e) => onChange("estado", e.target.value)}
            className={cn("h-10 sm:h-11 bg-input border-border text-xs sm:text-sm w-14 sm:w-16 touch-manipulation", autoFilledClass)}
            disabled={disabled}
            maxLength={2}
            autoComplete="address-level1"
          />
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset className="space-y-2 sm:space-y-3">
      <legend className="sr-only">Endereço completo</legend>
      <div className="relative">
        <label htmlFor="full-logradouro" className="sr-only">Rua / Logradouro</label>
        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" aria-hidden="true" />
        <Input
          id="full-logradouro"
          type="text"
          placeholder="Rua / Logradouro"
          value={data.logradouro}
          onChange={(e) => onChange("logradouro", e.target.value)}
          className={cn("pl-9 sm:pl-10 h-11 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation", autoFilledClass)}
          disabled={disabled}
          autoComplete="street-address"
        />
      </div>

      <div className="relative">
        <label htmlFor="full-bairro" className="sr-only">Bairro</label>
        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" aria-hidden="true" />
        <Input
          id="full-bairro"
          type="text"
          placeholder="Bairro"
          value={data.bairro}
          onChange={(e) => onChange("bairro", e.target.value)}
          className={cn("pl-9 sm:pl-10 h-11 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation", autoFilledClass)}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="relative col-span-2">
          <label htmlFor="full-cidade" className="sr-only">Cidade</label>
          <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" aria-hidden="true" />
          <Input
            id="full-cidade"
            type="text"
            placeholder="Cidade"
            value={data.cidade}
            onChange={(e) => onChange("cidade", e.target.value)}
            className={cn("pl-9 sm:pl-10 h-11 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation", autoFilledClass)}
            disabled={disabled}
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label htmlFor="full-estado" className="sr-only">Estado</label>
          <Input
            id="full-estado"
            type="text"
            placeholder="UF"
            value={data.estado}
            onChange={(e) => onChange("estado", e.target.value)}
            className={cn("h-11 sm:h-12 bg-input border-border text-center text-sm sm:text-base touch-manipulation", autoFilledClass)}
            disabled={disabled}
            maxLength={2}
            autoComplete="address-level1"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default AddressFields;
