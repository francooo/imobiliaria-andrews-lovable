import { Heart, MapPin, Bed, Bath, Car, Maximize, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Property {
  id: string;
  title: string;
  description?: string;
  property_type: string;
  transaction_type: string;
  price_min?: number;
  price_max?: number;
  city: string;
  neighborhood?: string;
  bedrooms?: number;
  bathrooms?: number;
  garage_spaces?: number;
  area_size?: number;
  images?: string[];
  features?: string[];
  status: string;
  featured: boolean;
}

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
}

const PropertyCard = ({ property, onViewDetails }: PropertyCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (min?: number, max?: number) => {
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
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-all duration-300 hover-scale border border-border">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageError ? "/placeholder.svg" : mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={() => setImageError(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          <Badge 
            variant={property.transaction_type === 'venda' ? 'default' : 'secondary'}
            className="bg-primary/90 text-primary-foreground"
          >
            {property.transaction_type === 'venda' ? 'Venda' : 'Aluguel'}
          </Badge>
          {property.featured && (
            <Badge className="bg-accent/90 text-accent-foreground">
              Destaque
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md transition-colors ${
            isFavorited 
              ? 'bg-primary/20 text-primary' 
              : 'bg-background/20 text-foreground hover:bg-primary/20 hover:text-primary'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>

        {/* View Details Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
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
      <div className="p-6">
        {/* Price */}
        <div className="text-2xl font-bold text-primary mb-2">
          {formatPrice(property.price_min, property.price_max)}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center space-x-4">
            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.garage_spaces !== undefined && property.garage_spaces > 0 && (
              <div className="flex items-center">
                <Car className="w-4 h-4 mr-1" />
                <span>{property.garage_spaces}</span>
              </div>
            )}
          </div>
          {property.area_size && (
            <div className="flex items-center">
              <Maximize className="w-4 h-4 mr-1" />
              <span>{property.area_size}m²</span>
            </div>
          )}
        </div>

        {/* Property Type */}
        <div className="text-sm text-muted-foreground mb-4">
          {getPropertyTypeLabel(property.property_type)}
        </div>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {property.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {property.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{property.features.length - 3} mais
              </Badge>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Button
          onClick={() => onViewDetails?.(property)}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
        >
          Tenho Interesse
        </Button>
      </div>
    </div>
  );
};

export default PropertyCard;