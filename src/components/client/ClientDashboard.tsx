import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from './ProfileTab';
import { FavoritesTab } from './FavoritesTab';
import { User, Heart, LogOut, ArrowLeft } from 'lucide-react';

export function ClientDashboard() {
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/')}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Voltar ao Site</span>
                            </Button>
                            <div className="hidden md:block">
                                <h1 className="text-xl font-bold text-foreground">Área do Cliente</h1>
                                <p className="text-sm text-muted-foreground">
                                    Bem-vindo, {profile?.nome || user?.email}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleSignOut}
                            className="flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sair</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Meus Dados
                            </TabsTrigger>
                            <TabsTrigger value="favorites" className="flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                Imóveis Favoritos
                            </TabsTrigger>
                        </TabsList>

                        <div className="bg-card rounded-2xl border border-border p-6">
                            <TabsContent value="profile" className="mt-0">
                                <ProfileTab />
                            </TabsContent>

                            <TabsContent value="favorites" className="mt-0">
                                <FavoritesTab />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
