import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PropertyShowcase from "@/components/PropertyShowcase";
import AboutSection from "@/components/AboutSection";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";
import LeadPopup from "@/components/LeadPopup";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  const [showLeadPopup, setShowLeadPopup] = useState(false);

  useEffect(() => {
    // Verificar se o popup já foi mostrado
    const popupShown = localStorage.getItem('leadPopupShown');
    
    if (!popupShown) {
      // Mostrar popup após 3 segundos
      const timer = setTimeout(() => {
        setShowLeadPopup(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PropertyShowcase />
        <AboutSection />
        <Testimonials />
        <ContactSection />
      </main>
      
      <LeadPopup 
        isOpen={showLeadPopup} 
        onClose={() => setShowLeadPopup(false)} 
      />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;