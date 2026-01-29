import { LogOut, Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminMenu = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            toast({
                title: "Logout realizado",
                description: "Você saiu do sistema com sucesso.",
            });

            navigate("/auth");
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            toast({
                title: "Erro",
                description: "Não foi possível fazer logout. Tente novamente.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="bg-card border-b border-border mb-8">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                        <LayoutDashboard className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-semibold">Área Administrativa</h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/")}
                            className="flex items-center space-x-2"
                        >
                            <Home className="w-4 h-4" />
                            <span>Ver Site</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="flex items-center space-x-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sair</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMenu;
