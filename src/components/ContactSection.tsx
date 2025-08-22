import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
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
          source: 'contact_form'
        }]);

      if (insertError) throw insertError;

      // Chamar edge function para enviar email
      const { error: emailError } = await supabase.functions.invoke('send-lead-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
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

      setFormData({ name: "", email: "", phone: "", message: "" });

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
      content: "andrews@corretorandrews.com.br",
      action: () => window.open("mailto:andrews@corretorandrews.com.br", "_blank")
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
      url: "https://instagram.com/andrewsfrancoimoveis",
      color: "hover:text-pink-500"
    },
    {
      icon: Facebook,
      name: "Facebook",
      url: "https://facebook.com/andrewsfrancoimoveis",
      color: "hover:text-blue-500"
    }
  ];

  return (
    <section id="contato" className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Entre em <span className="text-primary">Contato</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pronto para encontrar o imóvel dos seus sonhos? Entre em contato e 
            vamos começar essa jornada juntos!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-card/50 backdrop-blur-sm border border-border shadow-elegant">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Envie uma Mensagem
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12 bg-input border-border"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12 bg-input border-border"
                    required
                  />
                </div>
                
                <Input
                  type="tel"
                  placeholder="Seu telefone / WhatsApp"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="h-12 bg-input border-border"
                  required
                />
                
                <Textarea
                  placeholder="Sua mensagem..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="min-h-[120px] bg-input border-border resize-none"
                  required
                />
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg font-semibold"
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
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Informações de Contato
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <Card 
                    key={index} 
                    className="bg-card/30 border border-border hover:bg-card/50 transition-all duration-300 cursor-pointer"
                    onClick={info.action}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{info.title}</h4>
                          <p className="text-muted-foreground">{info.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-xl font-semibold text-foreground mb-4">
                Redes Sociais
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    className={`w-12 h-12 rounded-full border-border ${social.color} transition-all duration-300 hover:shadow-glow`}
                    onClick={() => window.open(social.url, "_blank")}
                  >
                    <social.icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <Card className="bg-gradient-primary/10 border border-primary/20">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold text-foreground mb-2">
                  Atendimento Personalizado
                </h4>
                <p className="text-muted-foreground mb-4">
                  Fale diretamente comigo pelo WhatsApp e receba atendimento 
                  imediato e personalizado.
                </p>
                <Button
                  onClick={() => {
                    const message = "Olá Andrews! Gostaria de conversar sobre imóveis.";
                    window.open(`https://api.whatsapp.com/send/?phone=5551981220279&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`, '_blank');
                  }}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
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