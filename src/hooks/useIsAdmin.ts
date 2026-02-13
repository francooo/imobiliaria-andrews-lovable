import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useIsAdmin() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdminStatus();
    }, []);

    const checkAdminStatus = async () => {
        try {
            // Primeiro, verificar se o usuário está autenticado
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            // Verificar se o email é o autorizado
            if (user.email !== 'andrewsfranco93@gmail.com') {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            // Chamar a função RPC is_admin() para validação final
            const { data, error } = await (supabase.rpc as any)('is_admin');

            if (error) {
                console.error('Error calling is_admin():', error);
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            setIsAdmin(data === true);
        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    return { isAdmin, loading, checkAdminStatus };
}
