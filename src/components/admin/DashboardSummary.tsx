import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
    total_properties: number;
    active_properties: number;
    inactive_properties: number;
}

const DashboardSummary = () => {
    const [stats, setStats] = useState<DashboardStats>({
        total_properties: 0,
        active_properties: 0,
        inactive_properties: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase
                .rpc('get_dashboard_stats');

            if (error) throw error;

            if (data && data.length > 0) {
                setStats(data[0]);
            }
        } catch (error) {
            console.error("Erro ao buscar estatísticas:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-card rounded-xl animate-pulse border border-border" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total de Imóveis
                    </CardTitle>
                    <Building2 className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_properties}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Cadastrados no sistema
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Imóveis Ativos
                    </CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.active_properties}</div>
                    <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Disponíveis para venda/aluguel
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Inativos / Vendidos
                    </CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.inactive_properties}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Indisponíveis no momento
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardSummary;
