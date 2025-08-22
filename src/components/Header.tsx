import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
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
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Space */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">AF</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Corretor Andrews Franco
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Seu imóvel dos sonhos está aqui
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("inicio")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection("imoveis")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Imóveis
            </button>
            <button
              onClick={() => scrollToSection("sobre")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection("depoimentos")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contato
            </button>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-foreground">(51) 99999-9999</span>
            </div>
            <Button
              onClick={() => scrollToSection("contato")}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              Fale Comigo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-left px-4 py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection("imoveis")}
                className="text-left px-4 py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Imóveis
              </button>
              <button
                onClick={() => scrollToSection("sobre")}
                className="text-left px-4 py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Sobre
              </button>
              <button
                onClick={() => scrollToSection("depoimentos")}
                className="text-left px-4 py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Depoimentos
              </button>
              <button
                onClick={() => scrollToSection("contato")}
                className="text-left px-4 py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Contato
              </button>
              <div className="px-4 py-2 border-t border-border">
                <div className="flex items-center space-x-2 text-sm mb-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-foreground">(51) 99999-9999</span>
                </div>
                <Button
                  onClick={() => scrollToSection("contato")}
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  Fale Comigo
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;