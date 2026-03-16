import { Button } from "@/components/ui/button";
import whatsappIcon from "@/assets/whatsapp-icon.png";

const WhatsAppFloat = () => {
  const handleWhatsAppClick = () => {
    window.open("https://api.whatsapp.com/send/?phone=5551981220279&text&type=phone_number&app_absent=0", "_blank");
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <Button
        onClick={handleWhatsAppClick}
        size="lg"
        className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full p-0 bg-transparent hover:bg-transparent shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none hover:scale-110 touch-manipulation"
        aria-label="Falar no WhatsApp"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="w-14 h-14 rounded-full" />
      </Button>
    </div>
  );
};

export default WhatsAppFloat;