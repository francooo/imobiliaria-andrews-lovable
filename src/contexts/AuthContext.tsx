import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
    id: string;
    nome: string;
    telefone: string | null;
    endereco: string | null;
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (userData: SignUpData) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateProfile: (data: Partial<Profile>) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

interface SignUpData {
    email: string;
    password: string;
    nome: string;
    telefone?: string;
    endereco?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    // Buscar perfil do usuário
    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await (supabase as any)
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setProfile(data as Profile);
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
        }
    };

    // Inicializar autenticação
    useEffect(() => {
        // Verificar sessão atual
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
            setLoading(false);
        });

        // Escutar mudanças de autenticação
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Login
    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
    };

    // Cadastro
    const signUp = async (userData: SignUpData) => {
        const { email, password, nome, telefone, endereco } = userData;

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nome,
                    telefone: telefone || '',
                    endereco: endereco || '',
                },
            },
        });

        if (error) throw error;
    };

    // Logout
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    // Recuperar senha
    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/redefinir-senha`,
        });

        if (error) throw error;
    };

    // Atualizar perfil
    const updateProfile = async (data: Partial<Profile>) => {
        if (!user) throw new Error('Usuário não autenticado');

        const { error } = await (supabase as any)
            .from('profiles')
            .update(data)
            .eq('id', user.id);

        if (error) throw error;

        // Atualizar estado local
        await fetchProfile(user.id);
    };

    // Atualizar perfil manualmente
    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    const value = {
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
