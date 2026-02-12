import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <ShieldAlert className="w-24 h-24 text-destructive mx-auto mb-6" />
                <h1 className="text-6xl font-bold text-foreground mb-2">403</h1>
                <h2 className="text-3xl font-semibold text-foreground mb-4">
                    Acesso Negado
                </h2>
                <p className="text-muted-foreground mb-6 text-lg">
                    Você não tem permissão para acessar esta área administrativa.
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                    Apenas administradores autorizados podem acessar esta seção.
                </p>
                <div className="flex gap-3 justify-center">
                    <Button onClick={() => navigate('/')} variant="default">
                        Voltar ao Início
                    </Button>
                    <Button onClick={() => navigate(-1)} variant="outline">
                        Voltar
                    </Button>
                </div>
            </div>
        </div>
    );
}
