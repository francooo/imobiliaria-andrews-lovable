import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, MapPin, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export function ProfileTab() {
    const { profile, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        telefone: profile?.telefone || '',
        endereco: profile?.endereco || '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await updateProfile(formData);
            setSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error('Erro ao atualizar perfil:', err);
            setError('Erro ao atualizar perfil. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            telefone: profile?.telefone || '',
            endereco: profile?.endereco || '',
        });
        setIsEditing(false);
        setError('');
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Informações Pessoais</h3>

                {success && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Perfil atualizado com sucesso!</span>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nome (não editável) */}
                    <div>
                        <Label>Nome Completo</Label>
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                value={profile?.nome || ''}
                                className="pl-10 bg-muted"
                                disabled
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Para alterar seu nome, entre em contato com o suporte
                        </p>
                    </div>

                    {/* Telefone */}
                    <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <div className="relative mt-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="telefone"
                                name="telefone"
                                type="tel"
                                placeholder="(00) 00000-0000"
                                value={formData.telefone}
                                onChange={handleChange}
                                className="pl-10"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    {/* Endereço */}
                    <div>
                        <Label htmlFor="endereco">Endereço</Label>
                        <div className="relative mt-1">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="endereco"
                                name="endereco"
                                type="text"
                                placeholder="Seu endereço completo"
                                value={formData.endereco}
                                onChange={handleChange}
                                className="pl-10"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <Button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="bg-gradient-primary hover:shadow-glow"
                            >
                                Editar Perfil
                            </Button>
                        ) : (
                            <>
                                <Button
                                    type="submit"
                                    className="bg-gradient-primary hover:shadow-glow"
                                    disabled={loading}
                                >
                                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </div>

            {/* Seção de Alteração de Senha */}
            <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Segurança</h3>
                <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                        <p className="text-sm font-medium">Alterar Senha</p>
                        <p className="text-xs text-muted-foreground">
                            Mantenha sua conta segura com uma senha forte
                        </p>
                    </div>
                    <Button variant="outline" size="sm">
                        Alterar Senha
                    </Button>
                </div>
            </div>
        </div>
    );
}
