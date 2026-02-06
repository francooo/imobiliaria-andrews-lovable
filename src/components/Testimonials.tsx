import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Testimonial = Database['public']['Tables']['testimonials']['Row'];

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Erro ao buscar depoimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const renderStars = (rating: number | null) => {
    const stars = rating || 5; // Default to 5 if null
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < stars ? 'text-primary fill-current' : 'text-muted-foreground'
          }`}
      />
    ));
  };

  if (loading || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="depoimentos" className="py-12 sm:py-16 md:py-20 bg-gradient-card" aria-label="Depoimentos de clientes">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            O que nossos <span className="text-primary">clientes</span> dizem
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A satisfação dos nossos clientes é a nossa maior conquista.
          </p>
        </header>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border border-border shadow-elegant">
            <CardContent className="p-6 sm:p-8 md:p-12">
              <div className="relative">
                {/* Quote Icon */}
                <Quote className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-8 h-8 sm:w-12 sm:h-12 text-primary/20" aria-hidden="true" />

                <div className="text-center pt-4 sm:pt-0">
                  {/* Rating */}
                  <div className="flex justify-center items-center space-x-1 mb-4 sm:mb-6" aria-label={`Avaliação: ${currentTestimonial.rating || 5} de 5 estrelas`}>
                    {renderStars(currentTestimonial.rating)}
                  </div>

                  {/* Comment */}
                  <blockquote className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed mb-6 sm:mb-8 font-medium">
                    "{currentTestimonial.content}"
                  </blockquote>

                  {/* Client Info */}
                  <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                    {/* Photo */}
                    <div className="relative">
                      <img
                        src={currentTestimonial.avatar_url || '/placeholder.svg'}
                        alt={`Foto de ${currentTestimonial.name}`}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-primary/20"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground fill-current" />
                      </div>
                    </div>

                    {/* Name and Property */}
                    <div className="text-center">
                      <h4 className="text-base sm:text-lg font-semibold text-foreground">
                        {currentTestimonial.name}
                      </h4>
                      {currentTestimonial.role && (
                        <p className="text-muted-foreground text-sm">
                          {currentTestimonial.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 mt-6 sm:mt-8" role="group" aria-label="Navegação de depoimentos">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 touch-manipulation"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Dots */}
              <div className="flex space-x-2" role="tablist">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 touch-manipulation min-w-[20px] min-h-[20px] flex items-center justify-center ${
                      index === currentIndex
                        ? 'bg-primary scale-125'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    role="tab"
                    aria-selected={index === currentIndex}
                    aria-label={`Ir para depoimento ${index + 1}`}
                  >
                    <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                      index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}></span>
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="w-11 h-11 sm:w-12 sm:h-12 min-w-[44px] min-h-[44px] rounded-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 touch-manipulation"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-16 max-w-3xl mx-auto">
          {[
            { value: "60+", label: "Imóveis Vendidos" },
            { value: "98%", label: "Satisfação" },
            { value: "2+", label: "Anos de Experiência" },
            { value: "24h", label: "Suporte" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-3 sm:p-0">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;