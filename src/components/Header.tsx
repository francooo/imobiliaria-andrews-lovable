import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MobileNav from "./MobileNav";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=5551981220279&text&type=phone_number&app_absent=0";

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
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">

          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("inicio");
            }}
            className="flex items-center space-x-2 min-h-[44px] touch-manipulation flex-shrink-0"
            aria-label="AF Negócios Imobiliários - Início"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-base sm:text-lg">AF</span>
            </div>
            <div className="min-w-0 hidden xs:block">
              <h1 className="text-sm sm:text-base lg:text-lg font-bold text-foreground leading-tight truncate">
                AF Negócios Imobiliários
              </h1>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center space-x-4 xl:space-x-6"
            role="navigation"
            aria-label="Navegação principal"
          >
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
                className="text-foreground hover:text-primary transition-colors font-medium text-sm py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded whitespace-nowrap"
                aria-label={`Ir para ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {/* WhatsApp Icon */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 rounded-full hover:opacity-80 transition-opacity"
              aria-label="Entrar em contato pelo WhatsApp"
              title="WhatsApp: (51) 98122-0279"
            >
              <img
                src="/whatsapp-icon.png"
                alt="WhatsApp"
                className="w-7 h-7 object-contain"
              />
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/cliente/login")}
              className="min-h-[36px] text-xs xl:text-sm px-2 xl:px-3"
            >
              <User className="w-3.5 h-3.5 mr-1" />
              <span className="hidden xl:inline">Área </span>Cliente
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/login")}
              className="min-h-[36px] text-xs xl:text-sm px-2 xl:px-3"
            >
              Admin
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open("https://condoagent.lovable.app/login", "_blank")
              }
              className="min-h-[36px] text-xs xl:text-sm px-2 xl:px-3 whitespace-nowrap"
            >
              🤖 <span className="hidden xl:inline ml-1">Agente IA Cond.</span>
              <span className="xl:hidden ml-1">IA Cond.</span>
            </Button>

            <Button
              size="sm"
              onClick={() => scrollToSection("contato")}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 min-h-[36px] text-xs xl:text-sm px-2 xl:px-4 whitespace-nowrap"
            >
              Fale Comigo
            </Button>
          </div>

          {/* Mobile: WhatsApp icon + hamburger */}
          <div className="flex lg:hidden items-center space-x-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition-opacity touch-manipulation"
              aria-label="Entrar em contato pelo WhatsApp"
            >
              <img
                src="/whatsapp-icon.png"
                alt="WhatsApp"
                className="w-8 h-8 object-contain"
              />
            </a>
            <MobileNav onNavigate={scrollToSection} />
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;