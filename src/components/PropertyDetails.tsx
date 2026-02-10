import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, MapPin, Bed, Bath, Car, Maximize, Share2, Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Property = Database['public']['Tables']['properties']['Row'];

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      console.error('Erro ao buscar imóvel:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleWhatsAppContact = () => {
    const message = `Olá! Tenho interesse no imóvel: ${property?.title} - ${property?.city}. Poderia me dar mais informações?`;
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=5551981220279&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Imóvel não encontrado</h2>
          <Button onClick={() => navigate('/')}>Voltar ao início</Button>
        </div>
      </div>
    );
  }

  const images = property.images || ["/placeholder.svg"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Voltar</span>
            </Button>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorited(!isFavorited)}
                className={isFavorited ? 'text-primary' : ''}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {images.length > 1 && (
          <>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-primary' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>

            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-2">
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
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price & Title */}
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {formatPrice(property.price_min, property.price_max)}
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {property.title}
              </h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}</span>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-card p-6 rounded-2xl border border-border">
              <h3 className="font-semibold text-foreground mb-4">Detalhes do Imóvel</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms !== undefined && property.bedrooms !== null && property.bedrooms > 0 && (
                  <div className="flex items-center space-x-2">
                    <Bed className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Quartos</div>
                    </div>
                  </div>
                )}
                {property.bathrooms !== undefined && property.bathrooms !== null && property.bathrooms > 0 && (
                  <div className="flex items-center space-x-2">
                    <Bath className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Banheiros</div>
                    </div>
                  </div>
                )}
                {property.parking_spots !== undefined && property.parking_spots !== null && property.parking_spots > 0 && (
                  <div className="flex items-center space-x-2">
                    <Car className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">{property.parking_spots}</div>
                      <div className="text-sm text-muted-foreground">Vagas</div>
                    </div>
                  </div>
                )}
                {property.area_m2 && (
                  <div className="flex items-center space-x-2">
                    <Maximize className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">{property.area_m2}m²</div>
                      <div className="text-sm text-muted-foreground">Área</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground mb-1">Tipo</div>
                <div className="font-medium">{getPropertyTypeLabel(property.property_type)}</div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-card p-6 rounded-2xl border border-border">
                <h3 className="font-semibold text-foreground mb-4">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-card p-6 rounded-2xl border border-border sticky top-4">
              <div className="text-center mb-6">
                <img
                  src="/src/assets/corretor-andrews.jpg"
                  alt="AF Negócios Imobiliários"
                  className="w-full max-w-[120px] h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold text-foreground">AF Negócios Imobiliários</h3>
                <p className="text-sm text-muted-foreground">Corretor de Imóveis</p>
                <p className="text-sm text-muted-foreground">CRECI: 123456</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp: (51) 98122-0279
                </Button>

                <Button variant="outline" className="w-full">
                  Solicitar Visita
                </Button>

                <Button variant="outline" className="w-full">
                  Mais Informações
                </Button>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-card p-6 rounded-2xl border border-border">
              <h3 className="font-semibold text-foreground mb-4">Localização</h3>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;