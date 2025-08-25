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
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Imóveis de luxo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto animate-fade-up">
          {/* Hero Text */}
          <div className="mb-12">
            <p className="text-primary text-lg font-medium mb-4 tracking-wide">
              O imóvel que você procura está aqui!
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              E se não estiver,{" "}
              <span className="text-shimmer">
                te ajudo a encontrar!
              </span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
              Especialista no mercado imobiliário da região, com anos de experiência 
              em compra, venda e locação de imóveis. Seu sonho da casa própria 
              começa aqui.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-background/95 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-elegant border border-border">
            <div className="flex flex-wrap gap-4 mb-6">
              {/* Transaction Type */}
              <div className="flex-1 min-w-[200px]">
                <Select value={searchData.type} onValueChange={(value) => setSearchData(prev => ({...prev, type: value}))}>
                  <SelectTrigger className="h-12 bg-input border-border">
                    <SelectValue placeholder="Venda ou Aluguel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venda">Venda</SelectItem>
                    <SelectItem value="aluguel">Aluguel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="flex-1 min-w-[200px]">
                <Select value={searchData.city} onValueChange={(value) => setSearchData(prev => ({...prev, city: value}))}>
                  <SelectTrigger className="h-12 bg-input border-border">
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
              </div>

              {/* Property Type */}
              <div className="flex-1 min-w-[200px]">
                <Select value={searchData.propertyType} onValueChange={(value) => setSearchData(prev => ({...prev, propertyType: value}))}>
                  <SelectTrigger className="h-12 bg-input border-border">
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
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              {/* Price Range */}
              <div className="flex-1 min-w-[150px]">
                <Input
                  placeholder="Valor Mínimo"
                  className="h-12 bg-input border-border"
                  value={searchData.minPrice}
                  onChange={(e) => setSearchData(prev => ({...prev, minPrice: e.target.value}))}
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <Input
                  placeholder="Valor Máximo"
                  className="h-12 bg-input border-border"
                  value={searchData.maxPrice}
                  onChange={(e) => setSearchData(prev => ({...prev, maxPrice: e.target.value}))}
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="w-full h-14 bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg font-semibold"
            >
              <Search className="w-5 h-5 mr-2" />
              BUSCAR IMÓVEIS
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">60+</div>
              <div className="text-sm text-gray-300">Imóveis Vendidos e Alugados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">2+</div>
              <div className="text-sm text-gray-300">Anos de Experiência</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-gray-300">Clientes Satisfeitos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24h</div>
              <div className="text-sm text-gray-300">Atendimento</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;