import { Heart, MapPin, Bed, Bath, Car, Maximize, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Database } from "@/integrations/supabase/types";

type Property = Database['public']['Tables']['properties']['Row'];

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
}

const PropertyCard = ({ property, onViewDetails }: PropertyCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Consultar preço";

    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}k`;
      }
      return num.toString();
    };

    if (min && max && min !== max) {
      return `R$ ${formatNumber(min)} - ${formatNumber(max)}`;
    }

    return `R$ ${formatNumber(min || max || 0)}`;
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      apartamento: "Apartamento",
      casa: "Casa",
      sobrado: "Sobrado",
      cobertura: "Cobertura",
      terreno: "Terreno",
      sala_comercial: "Sala Comercial",
      casa_condominio: "Casa em Condomínio",
      area: "Área",
      chacara: "Chácara",
      terreno_condominio: "Terreno em Condomínio"
    };
    return types[type] || type;
  };

  const mainImage = property.images?.[0] || "/placeholder.svg";

  return (
    <article 
      className="group bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-all duration-300 border border-border focus-within:ring-2 focus-within:ring-primary"
      aria-label={`Imóvel: ${property.title}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageError ? "/placeholder.svg" : mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge
            variant={property.transaction_type === 'venda' ? 'default' : 'secondary'}
            className="bg-primary/90 text-primary-foreground text-xs px-2 py-1"
          >
            {property.transaction_type === 'venda' ? 'Venda' : 'Aluguel'}
          </Badge>
          {property.featured && (
            <Badge className="bg-accent/90 text-accent-foreground text-xs px-2 py-1">
              Destaque
            </Badge>
          )}
        </div>

        {/* Favorite Button - Touch friendly */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 w-10 h-10 min-w-[44px] min-h-[44px] rounded-full backdrop-blur-md transition-colors touch-manipulation ${isFavorited
              ? 'bg-primary/20 text-primary'
              : 'bg-background/30 text-foreground hover:bg-primary/20 hover:text-primary'
            }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          aria-pressed={isFavorited}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>

        {/* View Details Overlay - Desktop only */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
          <Button
            onClick={() => onViewDetails?.(property)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Price */}
        <div className="text-xl sm:text-2xl font-bold text-primary mb-2">
          {formatPrice(property.price_min, property.price_max)}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 line-clamp-2 leading-snug">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-muted-foreground text-sm mb-3 sm:mb-4">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
          <span className="truncate">{property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}</span>
        </div>

        {/* Property Details - Responsive Grid */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground mb-3 sm:mb-4">
          {property.bedrooms !== undefined && property.bedrooms !== null && property.bedrooms > 0 && (
            <div className="flex items-center" aria-label={`${property.bedrooms} quartos`}>
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms !== undefined && property.bathrooms !== null && property.bathrooms > 0 && (
            <div className="flex items-center" aria-label={`${property.bathrooms} banheiros`}>
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.parking_spots !== undefined && property.parking_spots !== null && property.parking_spots > 0 && (
            <div className="flex items-center" aria-label={`${property.parking_spots} vagas`}>
              <Car className="w-4 h-4 mr-1" />
              <span>{property.parking_spots}</span>
            </div>
          )}
          {property.area_m2 && (
            <div className="flex items-center ml-auto" aria-label={`${property.area_m2} metros quadrados`}>
              <Maximize className="w-4 h-4 mr-1" />
              <span>{property.area_m2}m²</span>
            </div>
          )}
        </div>

        {/* Property Type */}
        <div className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          {getPropertyTypeLabel(property.property_type)}
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => onViewDetails?.(property)}
          className="w-full h-11 sm:h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-sm sm:text-base touch-manipulation"
          aria-label={`Ver detalhes de ${property.title}`}
        >
          Tenho Interesse
        </Button>
      </div>
    </article>
  );
};

export default PropertyCard;