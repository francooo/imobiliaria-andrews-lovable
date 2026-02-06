import { useState } from "react";
import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroImage from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const [searchData, setSearchData] = useState({
    type: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    propertyType: ""
  });

  const handleSearch = () => {
    // Implementar busca aqui
    console.log("Buscar imóveis com:", searchData);
    // Rolar para a seção de imóveis
    document.getElementById("imoveis")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20"
      aria-label="Seção principal"
    >
      {/* Background Image with reserved space to prevent CLS */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Imóveis de luxo"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto animate-fade-up">
          {/* Hero Text */}
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-primary text-sm sm:text-lg font-medium mb-3 sm:mb-4 tracking-wide">
              O imóvel que você procura está aqui!
            </p>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              E se não estiver,{" "}
              <span className="text-shimmer block sm:inline mt-1 sm:mt-0">
                te ajudo a encontrar!
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
              Especialista no mercado imobiliário da região, com anos de experiência 
              em compra, venda e locação de imóveis.
            </p>
          </div>

          {/* Search Form - Mobile Optimized */}
          <div className="bg-background/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-elegant border border-border">
            {/* First Row - Transaction Type & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-6">
              <Select value={searchData.type} onValueChange={(value) => setSearchData(prev => ({...prev, type: value}))}>
                <SelectTrigger className="h-12 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation">
                  <SelectValue placeholder="Venda ou Aluguel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="aluguel">Aluguel</SelectItem>
                </SelectContent>
              </Select>

              <Select value={searchData.city} onValueChange={(value) => setSearchData(prev => ({...prev, city: value}))}>
                <SelectTrigger className="h-12 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation">
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="porto-alegre">Porto Alegre</SelectItem>
                  <SelectItem value="canoas">Canoas</SelectItem>
                  <SelectItem value="novo-hamburgo">Novo Hamburgo</SelectItem>
                  <SelectItem value="sao-leopoldo">São Leopoldo</SelectItem>
                  <SelectItem value="gramado">Gramado</SelectItem>
                  <SelectItem value="capao-da-canoa">Capão da Canoa</SelectItem>
                </SelectContent>
              </Select>

              <Select value={searchData.propertyType} onValueChange={(value) => setSearchData(prev => ({...prev, propertyType: value}))}>
                <SelectTrigger className="h-12 sm:h-12 bg-input border-border text-sm sm:text-base touch-manipulation sm:col-span-2 lg:col-span-1">
                  <SelectValue placeholder="Tipo de Imóvel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="sobrado">Sobrado</SelectItem>
                  <SelectItem value="cobertura">Cobertura</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="sala_comercial">Sala Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Second Row - Price Range */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Input
                placeholder="Valor Mín."
                type="number"
                inputMode="numeric"
                className="h-12 bg-input border-border text-sm sm:text-base touch-manipulation"
                value={searchData.minPrice}
                onChange={(e) => setSearchData(prev => ({...prev, minPrice: e.target.value}))}
                aria-label="Valor mínimo"
              />
              <Input
                placeholder="Valor Máx."
                type="number"
                inputMode="numeric"
                className="h-12 bg-input border-border text-sm sm:text-base touch-manipulation"
                value={searchData.maxPrice}
                onChange={(e) => setSearchData(prev => ({...prev, maxPrice: e.target.value}))}
                aria-label="Valor máximo"
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="w-full h-12 sm:h-14 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-base sm:text-lg font-semibold touch-manipulation"
              aria-label="Buscar imóveis"
            >
              <Search className="w-5 h-5 mr-2" />
              BUSCAR IMÓVEIS
            </Button>
          </div>

          {/* Stats - Mobile Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12 max-w-3xl mx-auto">
            {[
              { value: "60+", label: "Imóveis Vendidos" },
              { value: "2+", label: "Anos de Experiência" },
              { value: "100%", label: "Clientes Satisfeitos" },
              { value: "24h", label: "Atendimento" },
            ].map((stat, index) => (
              <div key={index} className="text-center p-3 sm:p-0">
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on very small screens */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden xs:block">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-2 sm:h-3 bg-primary rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;