import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MobileNav from "./MobileNav";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-elegant"
          : "bg-transparent"
      )}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a 
            href="#inicio" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("inicio");
            }}
            className="flex items-center space-x-2 sm:space-x-3 min-h-[44px] touch-manipulation"
            aria-label="AF Negócios Imobiliários - Início"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-lg sm:text-xl">AF</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-foreground truncate">
                Andrews Franco
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden xs:block truncate">
                Corretor de Imóveis
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8" role="navigation" aria-label="Navegação principal">
            {[
              { id: "inicio", label: "Início" },
              { id: "imoveis", label: "Imóveis" },
              { id: "sobre", label: "Sobre" },
              { id: "depoimentos", label: "Depoimentos" },
              { id: "contato", label: "Contato" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground hover:text-primary transition-colors font-medium py-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded"
                aria-label={`Ir para ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="https://api.whatsapp.com/send/?phone=5551981220279&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-foreground hover:text-primary transition-colors min-h-[44px]"
              aria-label="Ligar para 51 98122-0279"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span>(51) 98122-0279</span>
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/login'}
              className="min-h-[40px]"
            >
              Admin
            </Button>
            <Button
              onClick={() => scrollToSection("contato")}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 min-h-[40px]"
            >
              Fale Comigo
            </Button>
          </div>

          {/* Mobile Navigation */}
          <MobileNav onNavigate={scrollToSection} />
        </div>
      </div>
    </header>
  );
};

export default Header;