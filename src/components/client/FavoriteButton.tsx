import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
    propertyId: string;
    variant?: 'default' | 'icon';
    className?: string;
}

export function FavoriteButton({ propertyId, variant = 'icon', className = '' }: FavoriteButtonProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            checkIfFavorited();
        }
    }, [user, propertyId]);

    const checkIfFavorited = async () => {
        if (!user) return;

        try {
            const { data, error } = await (supabase as any)
                .from('favorites')
                .select('id')
                .eq('user_id', user.id)
                .eq('property_id', propertyId)
                .maybeSingle();

            if (error) throw error;
            setIsFavorited(!!data);
        } catch (error) {
            console.error('Erro ao verificar favorito:', error);
        }
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            // Redirecionar para login se não estiver autenticado
            navigate('/cliente/login');
            return;
        }

        setLoading(true);

        try {
            if (isFavorited) {
                // Remover dos favoritos
                const { error } = await (supabase as any)
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('property_id', propertyId);

                if (error) throw error;
                setIsFavorited(false);
            } else {
                // Adicionar aos favoritos
                const { error } = await (supabase as any)
                    .from('favorites')
                    .insert({
                        user_id: user.id,
                        property_id: propertyId,
                    });

                if (error) throw error;
                setIsFavorited(true);
            }
        } catch (error: any) {
            console.error('Erro ao favoritar:', error);
            // Se houver erro de duplicata, apenas atualizar o estado
            if (error.code === '23505') {
                setIsFavorited(true);
            }
        } finally {
            setLoading(false);
        }
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={toggleFavorite}
                disabled={loading}
                className={`p-2 rounded-full transition-all duration-200 ${isFavorited
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-white/90 hover:bg-white text-gray-700'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
                title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
                <Heart
                    className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`}
                />
            </button>
        );
    }

    return (
        <Button
            onClick={toggleFavorite}
            disabled={loading}
            variant={isFavorited ? 'default' : 'outline'}
            className={className}
        >
            <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
            {isFavorited ? 'Favoritado' : 'Favoritar'}
        </Button>
    );
}
