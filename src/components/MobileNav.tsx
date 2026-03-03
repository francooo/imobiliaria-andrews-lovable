import { useState } from "react";
import { Menu, X, ChevronRight, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=5551981220279&text&type=phone_number&app_absent=0";

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
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-[320px] p-0 flex flex-col">
        {/* Header do menu */}
        <SheetHeader className="p-5 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-base">AF</span>
            </div>
            <SheetTitle className="text-left text-foreground text-base font-bold">
              AF Negócios Imobiliários
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Links de navegação */}
        <nav className="flex flex-col flex-1" role="navigation" aria-label="Menu principal">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="flex items-center justify-between px-6 py-4 text-left text-foreground hover:bg-accent/10 active:bg-accent/20 transition-colors min-h-[56px] touch-manipulation border-b border-border/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
              aria-label={`Ir para ${item.label}`}
            >
              <span className="text-base font-medium">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </nav>

        {/* Ações no rodapé do menu */}
        <div className="p-5 border-t border-border space-y-3">
          {/* WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 active:bg-green-500/25 transition-colors min-h-[52px] touch-manipulation"
            aria-label="Entrar em contato pelo WhatsApp"
          >
            <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <img
                src="/whatsapp-icon.png"
                alt="WhatsApp"
                className="w-5 h-5 object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">WhatsApp</p>
              <p className="text-xs text-muted-foreground">(51) 98122-0279</p>
            </div>
          </a>

          {/* Botões */}
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = "/cliente/login";
              setIsOpen(false);
            }}
            className="w-full min-h-[48px] text-sm touch-manipulation"
          >
            <User className="w-4 h-4 mr-2" />
            Área Cliente
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              window.location.href = "/login";
              setIsOpen(false);
            }}
            className="w-full min-h-[48px] text-sm touch-manipulation"
          >
            Área Admin
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              window.open("https://condoagent.lovable.app/login", "_blank");
              setIsOpen(false);
            }}
            className="w-full min-h-[48px] text-sm touch-manipulation"
          >
            <Bot className="w-4 h-4 mr-2" />
            Agente de IA para Condomínio
          </Button>

          <Button
            onClick={() => handleNavigate("contato")}
            className="w-full min-h-[48px] text-sm bg-gradient-primary hover:shadow-glow transition-all duration-300 touch-manipulation"
          >
            Fale Comigo
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
