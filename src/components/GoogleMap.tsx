import { useEffect, useRef } from 'react';

interface GoogleMapProps {
  className?: string;
}

const GoogleMap = ({ className = "" }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // CEP: 91720150 - Rua Engenheiro Ludolfo Boehl
    const address = "Rua Engenheiro Ludolfo Boehl, Porto Alegre, RS, 91720-150";
    
    // Create iframe with Google Maps embed
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = '0';
    iframe.style.borderRadius = '12px';
    iframe.loading = 'lazy';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    
    // Clear previous content and add iframe
    mapRef.current.innerHTML = '';
    mapRef.current.appendChild(iframe);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full min-h-[300px] rounded-xl overflow-hidden" />
      
      {/* Contact Info Overlay */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-md border border-border rounded-xl p-4 shadow-lg">
        <h3 className="font-semibold text-foreground mb-2">Escritório</h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Rua Engenheiro Ludolfo Boehl</p>
          <p>Porto Alegre, RS - 91720-150</p>
          <p className="text-primary font-medium">
            <a 
              href="https://api.whatsapp.com/send/?phone=5551981220279&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              (51) 98122-0279
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;