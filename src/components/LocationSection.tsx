import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import GoogleMap from './GoogleMap';

const LocationSection = () => {
  return (
    <section id="localizacao" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Nossa <span className="text-primary">Localização</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Para mais informações, entre em contato conosco ou faça-nos uma visita.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <div className="order-2 lg:order-1">
            <GoogleMap className="h-96 lg:h-[500px]" />
          </div>

          {/* Contact Info */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-6">Informações de Contato</h3>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Endereço</h4>
                    <p className="text-muted-foreground">
                      Rua Engenheiro Ludolfo Boehl<br />
                      Porto Alegre, RS - CEP: 91720-150
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Telefone</h4>
                    <a 
                      href="https://api.whatsapp.com/send/?phone=5551981220279&text&type=phone_number&app_absent=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      (51) 98122-0279
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">E-mail</h4>
                    <a 
                      href="mailto:andrews@corretor.com"
                      className="text-primary hover:underline"
                    >
                      andrews@corretor.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Horário de Atendimento</h4>
                    <div className="text-muted-foreground">
                      <p>Segunda a Sexta: 09h às 17h</p>
                      <p>Sábados: 09h às 12h</p>
                      <p>Domingos: Emergências</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-primary p-8 rounded-2xl text-center text-white">
              <h3 className="text-xl font-bold mb-4">Precisa de Ajuda?</h3>
              <p className="mb-6 opacity-90">
                Entre em contato agora mesmo e tire todas suas dúvidas sobre imóveis.
              </p>
              <a 
                href="https://api.whatsapp.com/send/?phone=5551981220279&text=Olá! Preciso de ajuda com imóveis.&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white text-primary px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;