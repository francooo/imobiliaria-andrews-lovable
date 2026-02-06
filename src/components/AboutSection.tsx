import { Award, Users, MapPin, TrendingUp, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import corretorAndrews from '@/assets/corretor-andrews.jpg';

const AboutSection = () => {
  const achievements = [
    {
      icon: TrendingUp,
      title: "60+ Imóveis Vendidos e Alugados",
      description: "Mais de 60 famílias realizaram o sonho da casa própria"
    },
    {
      icon: Award,
      title: "2+ Anos de Experiência",
      description: "Sólida experiência dedicada ao mercado imobiliário"
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
    <section id="sobre" className="py-12 sm:py-16 md:py-20 bg-background" aria-label="Sobre Andrews Franco">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Sobre <span className="text-primary">Andrews Franco</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Corretor de imóveis especialista com mais de 2 anos de experiência no mercado.
            Comprometido em encontrar a solução perfeita para cada cliente.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* About Content */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
                Sua jornada imobiliária começa aqui
              </h3>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                Com mais de 2 anos de experiência no mercado imobiliário, dedico-me
                integralmente a ajudar pessoas a realizarem seus sonhos. Seja comprando
                sua primeira casa, investindo em um imóvel ou vendendo uma propriedade,
                estou aqui para guiá-lo em cada etapa do processo.
              </p>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Minha missão é tornar a experiência imobiliária simples, transparente
                e bem-sucedida. Acredito que cada cliente é único e merece um atendimento
                personalizado e de qualidade.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
                Meus Serviços
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {services.map((service, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-muted-foreground text-sm sm:text-base leading-relaxed">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={() => {
                  const message = "Olá Andrews! Gostaria de mais informações sobre seus serviços.";
                  window.open(`https://api.whatsapp.com/send/?phone=5551981220279&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`, '_blank');
                }}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 flex items-center justify-center space-x-2 h-12 text-base touch-manipulation"
                aria-label="Falar no WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Falar no WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center justify-center space-x-2 h-12 text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300 touch-manipulation"
                aria-label="Ver outros contatos"
              >
                <Phone className="w-5 h-5" />
                <span>Outros Contatos</span>
              </Button>
            </div>
          </div>

          {/* Photo and Achievements */}
          <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
            {/* Photo */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-glow">
                  <img
                    src={corretorAndrews}
                    alt="Andrews Franco - Corretor de Imóveis"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="bg-gradient-card border border-border hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <achievement.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-foreground" />
                    </div>
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-1 sm:mb-2 leading-tight">
                      {achievement.title}
                    </h4>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-12 sm:mt-16 bg-gradient-card rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 border border-border text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
            Minha Missão
          </h3>
          <blockquote className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            "Transformar sonhos em realidade através do mercado imobiliário.
            Cada cliente é único e merece um atendimento excepcional,
            transparente e comprometido com os melhores resultados."
          </blockquote>
          <footer className="mt-4 sm:mt-6">
            <cite className="text-primary font-semibold text-base sm:text-lg not-italic">— Andrews Franco</cite>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;