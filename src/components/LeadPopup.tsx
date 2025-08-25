import { useState, useEffect } from "react";
import { X, Phone, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadPopup = ({ isOpen, onClose }: LeadPopupProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Inserir lead no banco
      const { error: insertError } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          source: 'popup_home'
        }]);

      if (insertError) throw insertError;

      // Chamar edge function para enviar email
      const { error: emailError } = await supabase.functions.invoke('send-lead-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          source: 'popup_home'
        }
      });

      if (emailError) {
        console.error('Erro ao enviar email:', emailError);
        // Não bloquear o fluxo se o email falhar
      }

      toast({
        title: "Obrigado pelo seu interesse!",
        description: "Entraremos em contato em breve com as melhores oportunidades para você.",
      });

      setFormData({ name: "", email: "", phone: "" });
      onClose();
      
      // Marcar que o usuário já viu o popup
      localStorage.setItem('leadPopupShown', 'true');

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
      <DialogContent className="sm:max-w-md mx-4 bg-gradient-card border border-border shadow-elegant">
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
              Deixe seus dados e receba as melhores oportunidades do mercado imobiliário
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