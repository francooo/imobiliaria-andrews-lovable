import { useState } from "react";
import { Menu, X, Phone, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileNavProps {
  onNavigate: (sectionId: string) => void;
}

const MobileNav = ({ onNavigate }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (sectionId: string) => {
    onNavigate(sectionId);
    setIsOpen(false);
  };

  const navItems = [
    { id: "inicio", label: "Início" },
    { id: "imoveis", label: "Imóveis" },
    { id: "sobre", label: "Sobre" },
    { id: "depoimentos", label: "Depoimentos" },
    { id: "contato", label: "Contato" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden min-w-[44px] min-h-[44px] touch-manipulation"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-[300px] p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="text-left text-foreground">Menu</SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col" role="navigation" aria-label="Menu principal">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="flex items-center justify-between px-6 py-4 text-left text-foreground hover:bg-accent/10 transition-colors min-h-[56px] touch-manipulation border-b border-border/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
              aria-label={`Ir para ${item.label}`}
            >
              <span className="text-base font-medium">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-border space-y-4">
          {/* Telefone */}
          <a
            href="https://api.whatsapp.com/send/?phone=5551981220279&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors min-h-[44px] touch-manipulation"
            aria-label="Ligar para 51 98122-0279"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <span className="text-base">(51) 98122-0279</span>
          </a>

          {/* Botões de ação */}
          <div className="space-y-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = '/cliente/login';
                setIsOpen(false);
              }}
              className="w-full min-h-[48px] text-base touch-manipulation"
            >
              <User className="w-4 h-4 mr-2" />
              Área Cliente
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = '/login';
                setIsOpen(false);
              }}
              className="w-full min-h-[48px] text-base touch-manipulation"
            >
              Área Admin
            </Button>
            <Button
              onClick={() => handleNavigate("contato")}
              className="w-full min-h-[48px] text-base bg-gradient-primary hover:shadow-glow transition-all duration-300 touch-manipulation"
            >
              Fale Comigo
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
