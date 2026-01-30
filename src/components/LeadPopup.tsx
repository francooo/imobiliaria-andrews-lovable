import { useState } from "react";
import { Phone, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CepInput from "./CepInput";
import AddressFields from "./AddressFields";
import { type CepData, normalizeCidade } from "@/hooks/useCep";

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadPopup = ({ isOpen, onClose }: LeadPopupProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    estado: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddressFound = (data: CepData) => {
    setFormData(prev => ({
      ...prev,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado
    }));
    setIsAutoFilled(true);
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsAutoFilled(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar CEP se preenchido
    if (formData.cep && cepError) {
      toast({
        title: "CEP inválido",
        description: "Por favor, corrija o CEP antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Normalizar cidade para filtros
      const cidadeNormalizada = formData.cidade ? normalizeCidade(formData.cidade) : null;

      // Inserir lead no banco
      const { error: insertError } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          cep: formData.cep || null,
          logradouro: formData.logradouro || null,
          bairro: formData.bairro || null,
          cidade: cidadeNormalizada,
          estado: formData.estado || null,
          source: 'popup_home'
        }]);

      if (insertError) throw insertError;

      // Salvar cidade no localStorage para filtro de imóveis
      if (cidadeNormalizada) {
        localStorage.setItem('leadCidade', cidadeNormalizada);
      }

      // Chamar edge function para enviar email
      const { error: emailError } = await supabase.functions.invoke('send-lead-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          cidade: formData.cidade,
          estado: formData.estado,
          source: 'popup_home'
        }
      });

      if (emailError) {
        console.error('Erro ao enviar email:', emailError);
      }

      toast({
        title: "Obrigado pelo seu interesse!",
        description: formData.cidade 
          ? `Enviaremos as melhores oportunidades em ${formData.cidade} para você.`
          : "Entraremos em contato em breve com as melhores oportunidades.",
      });

      setFormData({ name: "", email: "", phone: "", cep: "", logradouro: "", bairro: "", cidade: "", estado: "" });
      setIsAutoFilled(false);
      onClose();
      
      // Marcar que o usuário já viu o popup e disparar evento para atualizar filtros
      localStorage.setItem('leadPopupShown', 'true');
      window.dispatchEvent(new Event('leadCidadeChanged'));

    } catch (error) {
      console.error('Erro ao cadastrar lead:', error);
      toast({
        title: "Ops! Algo deu errado",
        description: "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 bg-gradient-card border border-border shadow-elegant max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Encontre seu imóvel ideal!
            </h2>
            <p className="text-muted-foreground text-sm">
              Deixe seus dados e receba imóveis na sua região
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="pl-10 h-12 bg-input border-border"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10 h-12 bg-input border-border"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="Seu WhatsApp"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="pl-10 h-12 bg-input border-border"
                required
              />
            </div>

            {/* CEP e Endereço */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">
                Informe seu CEP para ver imóveis na sua região
              </p>
              
              <CepInput
                value={formData.cep}
                onChange={(cep) => setFormData(prev => ({ ...prev, cep }))}
                onAddressFound={handleAddressFound}
                onError={setCepError}
              />

              {(formData.cidade || formData.logradouro) && (
                <div className="mt-3">
                  <AddressFields
                    data={{
                      logradouro: formData.logradouro,
                      bairro: formData.bairro,
                      cidade: formData.cidade,
                      estado: formData.estado
                    }}
                    onChange={handleAddressChange}
                    isAutoFilled={isAutoFilled}
                    compact
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg font-semibold"
            >
              {isSubmitting ? "Enviando..." : "Quero Receber as Ofertas!"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              🔒 Seus dados estão seguros e não serão compartilhados
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadPopup;
