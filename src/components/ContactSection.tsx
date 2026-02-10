import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CepInput from "./CepInput";
import AddressFields from "./AddressFields";
import { type CepData, normalizeCidade } from "@/hooks/useCep";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
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
          source: 'contact_form'
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
          message: formData.message,
          cidade: formData.cidade,
          estado: formData.estado,
          source: 'contact_form'
        }
      });

      if (emailError) {
        console.error('Erro ao enviar email:', emailError);
      }

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Obrigado pelo contato. Retornaremos em breve!",
      });

      setFormData({ name: "", email: "", phone: "", message: "", cep: "", logradouro: "", bairro: "", cidade: "", estado: "" });
      setIsAutoFilled(false);

      // Disparar evento para atualizar filtros
      window.dispatchEvent(new Event('leadCidadeChanged'));

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente ou entre em contato pelo WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone / WhatsApp",
      content: "(51) 98122-0279",
      action: () => window.open("https://api.whatsapp.com/send/?phone=5551981220279&text&type=phone_number&app_absent=0", "_blank")
    },
    {
      icon: Mail,
      title: "E-mail",
      content: "andrewsfranco93@gmail.com",
      action: () => window.open("mailto:andrewsfranco93@gmail.com", "_blank")
    },
    {
      icon: MapPin,
      title: "Localização",
      content: "Rua Eng. Ludolfo Boehl - Porto Alegre, RS",
      action: () => {}
    }
  ];

  const socialLinks = [
    {
      icon: MessageCircle,
      name: "WhatsApp",
      url: "https://api.whatsapp.com/send/?phone=5551981220279&text&type=phone_number&app_absent=0",
      color: "hover:text-green-500"
    },
    {
      icon: Instagram,
      name: "Instagram",
      url: "https://www.instagram.com/andrews.franco/",
      color: "hover:text-pink-500"
    },
    {
      icon: Facebook,
      name: "Facebook",
      url: "https://www.facebook.com/andrews.franco93/",
      color: "hover:text-blue-500"
    }
  ];

  return (
    <section id="contato" className="py-12 sm:py-16 md:py-20 bg-gradient-card" aria-label="Formulário de contato">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Entre em <span className="text-primary">Contato</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Pronto para encontrar o imóvel dos seus sonhos? Entre em contato e 
            vamos começar essa jornada juntos!
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Form */}
          <Card className="bg-card/50 backdrop-blur-sm border border-border shadow-elegant">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
                Envie uma Mensagem
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="contact-name" className="sr-only">Seu nome</label>
                    <Input
                      id="contact-name"
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="h-11 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation"
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="sr-only">Seu e-mail</label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="Seu e-mail"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="h-11 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="contact-phone" className="sr-only">Seu telefone</label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="Seu telefone / WhatsApp"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="h-11 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation"
                    required
                    autoComplete="tel"
                  />
                </div>

                {/* CEP e Endereço */}
                <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-border">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Informe seu CEP para recomendarmos imóveis na sua região
                  </p>
                  
                  <CepInput
                    value={formData.cep}
                    onChange={(cep) => setFormData(prev => ({ ...prev, cep }))}
                    onAddressFound={handleAddressFound}
                    onError={setCepError}
                  />

                  {(formData.cidade || formData.logradouro) && (
                    <AddressFields
                      data={{
                        logradouro: formData.logradouro,
                        bairro: formData.bairro,
                        cidade: formData.cidade,
                        estado: formData.estado
                      }}
                      onChange={handleAddressChange}
                      isAutoFilled={isAutoFilled}
                    />
                  )}
                </div>
                
                <div>
                  <label htmlFor="contact-message" className="sr-only">Sua mensagem</label>
                  <Textarea
                    id="contact-message"
                    placeholder="Sua mensagem..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="min-h-[100px] sm:min-h-[120px] bg-input border-border resize-none text-sm sm:text-base touch-manipulation"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 sm:h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-base sm:text-lg font-semibold touch-manipulation"
                >
                  {isSubmitting ? "Enviando..." : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
                Informações de Contato
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                {contactInfo.map((info, index) => (
                  <Card 
                    key={index} 
                    className="bg-card/30 border border-border hover:bg-card/50 transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-primary"
                  >
                    <CardContent className="p-0">
                      <button
                        onClick={info.action}
                        className="w-full p-4 flex items-center space-x-3 sm:space-x-4 min-h-[64px] touch-manipulation text-left"
                        aria-label={`${info.title}: ${info.content}`}
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-foreground text-sm sm:text-base">{info.title}</h4>
                          <p className="text-muted-foreground text-xs sm:text-sm truncate">{info.content}</p>
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                Redes Sociais
              </h4>
              <div className="flex space-x-3 sm:space-x-4">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className={`w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full border-border ${social.color} transition-all duration-300 hover:shadow-glow touch-manipulation`}
                    onClick={() => window.open(social.url, "_blank")}
                    aria-label={`Abrir ${social.name}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <Card className="bg-gradient-primary/10 border border-primary/20">
              <CardContent className="p-4 sm:p-6 text-center">
                <h4 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  Atendimento Personalizado
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                  Fale diretamente comigo pelo WhatsApp e receba atendimento 
                  imediato e personalizado.
                </p>
                <Button
                  onClick={() => {
                    const message = "Olá Andrews! Gostaria de conversar sobre imóveis.";
                    window.open(`https://api.whatsapp.com/send/?phone=5551981220279&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`, '_blank');
                  }}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300 h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                  aria-label="Falar no WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar no WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
