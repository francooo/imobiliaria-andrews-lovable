import { Award, Users, MapPin, TrendingUp, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import corretorAndrews from '@/assets/corretor-andrews.jpg';

const AboutSection = () => {
  const achievements = [
    {
      icon: TrendingUp,
      title: "500+ Imóveis Vendidos",
      description: "Mais de 500 famílias realizaram o sonho da casa própria"
    },
    {
      icon: Award,
      title: "15+ Anos de Experiência",
      description: "Mais de uma década dedicada ao mercado imobiliário"
    },
    {
      icon: Users,
      title: "98% Satisfação",
      description: "Índice de satisfação comprovado pelos nossos clientes"
    },
    {
      icon: MapPin,
      title: "Região Metropolitana",
      description: "Atuação em toda Grande Porto Alegre e Litoral Norte"
    }
  ];

  const services = [
    "Compra e venda de imóveis residenciais",
    "Locação e administração predial",
    "Consultoria em investimentos imobiliários",
    "Avaliação técnica de imóveis",
    "Regularização documental",
    "Financiamento imobiliário"
  ];

  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Sobre <span className="text-primary">Andrews Franco</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Corretor de imóveis especialista com mais de 15 anos de experiência no mercado.
            Comprometido em encontrar a solução perfeita para cada cliente.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* About Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Sua jornada imobiliária começa aqui
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Com mais de 15 anos de experiência no mercado imobiliário, dedico-me 
                integralmente a ajudar pessoas a realizarem seus sonhos. Seja comprando 
                sua primeira casa, investindo em um imóvel ou vendendo uma propriedade, 
                estou aqui para guiá-lo em cada etapa do processo.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Minha missão é tornar a experiência imobiliária simples, transparente 
                e bem-sucedida. Acredito que cada cliente é único e merece um atendimento 
                personalizado e de qualidade.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xl font-semibold text-foreground mb-4">
                Meus Serviços
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-muted-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => {
                  const message = "Olá Andrews! Gostaria de mais informações sobre seus serviços.";
                  window.open(`https://api.whatsapp.com/send/?phone=5551981220279&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`, '_blank');
                }}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 flex items-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Falar no WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                <span>Outros Contatos</span>
              </Button>
            </div>
          </div>

          {/* Photo and Achievements */}
          <div className="space-y-8">
            {/* Photo */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-glow">
                  <img 
                    src={corretorAndrews} 
                    alt="Andrews Franco - Corretor de Imóveis"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                  CRECI: 123456
                </div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="bg-gradient-card border border-border hover:shadow-glow transition-all duration-300 hover-scale">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <achievement.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {achievement.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 bg-gradient-card rounded-2xl p-8 md:p-12 border border-border text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Minha Missão
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            "Transformar sonhos em realidade através do mercado imobiliário. 
            Cada cliente é único e merece um atendimento excepcional, 
            transparente e comprometido com os melhores resultados."
          </p>
          <div className="mt-6">
            <span className="text-primary font-semibold text-lg">— Andrews Franco</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;