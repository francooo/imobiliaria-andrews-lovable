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
      <div className="grid grid-cols-2 gap-3">
        <div className="relative col-span-2">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rua"
            value={data.logradouro}
            onChange={(e) => onChange("logradouro", e.target.value)}
            className={cn("pl-10 h-10 bg-input border-border text-sm", autoFilledClass)}
            disabled={disabled}
          />
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Bairro"
            value={data.bairro}
            onChange={(e) => onChange("bairro", e.target.value)}
            className={cn("h-10 bg-input border-border text-sm", autoFilledClass)}
            disabled={disabled}
          />
        </div>
        <div className="relative flex gap-2">
          <Input
            type="text"
            placeholder="Cidade"
            value={data.cidade}
            onChange={(e) => onChange("cidade", e.target.value)}
            className={cn("h-10 bg-input border-border text-sm flex-1", autoFilledClass)}
            disabled={disabled}
          />
          <Input
            type="text"
            placeholder="UF"
            value={data.estado}
            onChange={(e) => onChange("estado", e.target.value)}
            className={cn("h-10 bg-input border-border text-sm w-16", autoFilledClass)}
            disabled={disabled}
            maxLength={2}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rua / Logradouro"
          value={data.logradouro}
          onChange={(e) => onChange("logradouro", e.target.value)}
          className={cn("pl-10 h-12 bg-input border-border", autoFilledClass)}
          disabled={disabled}
        />
      </div>

      <div className="relative">
        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Bairro"
          value={data.bairro}
          onChange={(e) => onChange("bairro", e.target.value)}
          className={cn("pl-10 h-12 bg-input border-border", autoFilledClass)}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="relative col-span-2">
          <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cidade"
            value={data.cidade}
            onChange={(e) => onChange("cidade", e.target.value)}
            className={cn("pl-10 h-12 bg-input border-border", autoFilledClass)}
            disabled={disabled}
          />
        </div>
        <Input
          type="text"
          placeholder="UF"
          value={data.estado}
          onChange={(e) => onChange("estado", e.target.value)}
          className={cn("h-12 bg-input border-border text-center", autoFilledClass)}
          disabled={disabled}
          maxLength={2}
        />
      </div>
    </div>
  );
};

export default AddressFields;
