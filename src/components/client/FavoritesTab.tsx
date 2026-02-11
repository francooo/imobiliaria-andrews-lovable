import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Heart, MapPin, Bed, Bath, Car, Maximize, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Property = Database['public']['Tables']['properties']['Row'];

interface FavoriteWithProperty {
    id: string;
    property_id: string;
    created_at: string;
    properties: Property;
}

export function FavoritesTab() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<FavoriteWithProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const { data, error } = await supabase
                .from('favorites')
                .select(`
          id,
          property_id,
          created_at,
          properties (*)
        `)
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setFavorites(data as any);
        } catch (error) {
            console.error('Erro ao buscar favoritos:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (favoriteId: string) => {
        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('id', favoriteId);

            if (error) throw error;

            // Atualizar lista local
            setFavorites(favorites.filter(fav => fav.id !== favoriteId));
        } catch (error) {
            console.error('Erro ao remover favorito:', error);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="text-center py-12">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum imóvel favoritado
                </h3>
                <p className="text-muted-foreground mb-6">
                    Comece a favoritar imóveis para vê-los aqui
                </p>
                <Button onClick={() => navigate('/')}>
                    Explorar Imóveis
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">
                Meus Imóveis Favoritos ({favorites.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map((favorite) => {
                    const property = favorite.properties;
                    const images = property.images || ['/placeholder.svg'];

                    return (
                        <div
                            key={favorite.id}
                            className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group"
                        >
                            {/* Imagem */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={images[0]}
                                    alt={property.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute top-3 left-3 flex gap-2">
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
                                <button
                                    onClick={() => removeFavorite(favorite.id)}
                                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                                    title="Remover dos favoritos"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Conteúdo */}
                            <div className="p-4">
                                <div className="text-xl font-bold text-primary mb-2">
                                    {formatPrice(property.price_min, property.price_max)}
                                </div>
                                <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                                    {property.title}
                                </h3>
                                <div className="flex items-center text-sm text-muted-foreground mb-3">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span className="line-clamp-1">
                                        {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}
                                    </span>
                                </div>

                                {/* Características */}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                    {property.bedrooms !== undefined && property.bedrooms !== null && property.bedrooms > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Bed className="w-4 h-4" />
                                            <span>{property.bedrooms}</span>
                                        </div>
                                    )}
                                    {property.bathrooms !== undefined && property.bathrooms !== null && property.bathrooms > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Bath className="w-4 h-4" />
                                            <span>{property.bathrooms}</span>
                                        </div>
                                    )}
                                    {property.parking_spots !== undefined && property.parking_spots !== null && property.parking_spots > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Car className="w-4 h-4" />
                                            <span>{property.parking_spots}</span>
                                        </div>
                                    )}
                                    {property.area_m2 && (
                                        <div className="flex items-center gap-1">
                                            <Maximize className="w-4 h-4" />
                                            <span>{property.area_m2}m²</span>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    onClick={() => navigate(`/imovel/${property.id}`)}
                                    className="w-full"
                                    variant="outline"
                                >
                                    Ver Detalhes
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
