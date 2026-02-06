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
      <DialogContent 
        className="w-[calc(100%-2rem)] max-w-md mx-auto bg-gradient-card border border-border shadow-elegant max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl p-4 sm:p-6"
        aria-labelledby="lead-popup-title"
        aria-describedby="lead-popup-description"
      >
        <div className="relative">
          {/* Header */}
          <header className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
            </div>
            <h2 id="lead-popup-title" className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Encontre seu imóvel ideal!
            </h2>
            <p id="lead-popup-description" className="text-muted-foreground text-xs sm:text-sm">
              Deixe seus dados e receba imóveis na sua região
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="relative">
              <label htmlFor="lead-name" className="sr-only">Nome completo</label>
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" aria-hidden="true" />
              <Input
                id="lead-name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="pl-9 sm:pl-10 h-11 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation"
                required
                autoComplete="name"
              />
            </div>

            <div className="relative">
              <label htmlFor="lead-email" className="sr-only">E-mail</label>
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" aria-hidden="true" />
              <Input
                id="lead-email"
                type="email"
                inputMode="email"
                placeholder="Seu melhor e-mail"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-9 sm:pl-10 h-11 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation"
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <label htmlFor="lead-phone" className="sr-only">WhatsApp</label>
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" aria-hidden="true" />
              <Input
                id="lead-phone"
                type="tel"
                inputMode="tel"
                placeholder="Seu WhatsApp"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="pl-9 sm:pl-10 h-11 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation"
                required
                autoComplete="tel"
              />
            </div>

            {/* CEP e Endereço */}
            <div className="pt-2 sm:pt-3 border-t border-border">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">
                Informe seu CEP para ver imóveis na sua região
              </p>
              
              <CepInput
                value={formData.cep}
                onChange={(cep) => setFormData(prev => ({ ...prev, cep }))}
                onAddressFound={handleAddressFound}
                onError={setCepError}
              />

              {(formData.cidade || formData.logradouro) && (
                <div className="mt-2 sm:mt-3">
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
              className="w-full h-11 sm:h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-sm sm:text-lg font-semibold touch-manipulation"
            >
              {isSubmitting ? "Enviando..." : "Quero Receber as Ofertas!"}
            </Button>
          </form>

          {/* Footer */}
          <footer className="text-center mt-3 sm:mt-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              🔒 Seus dados estão seguros e não serão compartilhados
            </p>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadPopup;
