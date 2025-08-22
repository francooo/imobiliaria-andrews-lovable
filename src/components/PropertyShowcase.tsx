import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from "./PropertyCard";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  description?: string;
  property_type: string;
  transaction_type: string;
  price_min?: number;
  price_max?: number;
  city: string;
  neighborhood?: string;
  bedrooms?: number;
  bathrooms?: number;
  garage_spaces?: number;
  area_size?: number;
  images?: string[];
  features?: string[];
  status: string;
  featured: boolean;
  created_at: string;
}

const PropertyShowcase = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    type: "all",
    city: "all",
    transaction: "all",
    sortBy: "featured"
  });

  const propertiesPerPage = 6;

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, filters]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'disponivel')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    // Filtrar por tipo de transação
    if (filters.transaction !== "all") {
      filtered = filtered.filter(p => p.transaction_type === filters.transaction);
    }

    // Filtrar por tipo de imóvel
    if (filters.type !== "all") {
      filtered = filtered.filter(p => p.property_type === filters.type);
    }

    // Filtrar por cidade
    if (filters.city !== "all") {
      filtered = filtered.filter(p => p.city.toLowerCase().includes(filters.city));
    }

    // Ordenar
    switch (filters.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => (a.price_min || 0) - (b.price_min || 0));
        break;
      case "price_desc":
        filtered.sort((a, b) => (b.price_min || 0) - (a.price_min || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default: // featured
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  };

  const handleViewDetails = (property: Property) => {
    // Implementar visualização de detalhes ou abrir WhatsApp
    const message = `Olá! Tenho interesse no imóvel: ${property.title} - ${property.city}. Poderia me dar mais informações?`;
    const whatsappUrl = `https://wa.me/5551999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Paginação
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = filteredProperties.slice(startIndex, startIndex + propertiesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <section id="imoveis" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando imóveis...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="imoveis" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Imóveis em <span className="text-primary">Destaque</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conheça nossa seleção especial de imóveis com as melhores oportunidades do mercado
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 bg-card p-6 rounded-2xl border border-border">
          <div className="flex items-center space-x-2 text-sm font-medium text-foreground">
            <Filter className="w-4 h-4" />
            <span>Filtros:</span>
          </div>

          <Select value={filters.transaction} onValueChange={(value) => setFilters(prev => ({...prev, transaction: value}))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Transação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="venda">Venda</SelectItem>
              <SelectItem value="aluguel">Aluguel</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({...prev, type: value}))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="sobrado">Sobrado</SelectItem>
              <SelectItem value="cobertura">Cobertura</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({...prev, city: value}))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Cidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              <SelectItem value="porto alegre">Porto Alegre</SelectItem>
              <SelectItem value="canoas">Canoas</SelectItem>
              <SelectItem value="novo hamburgo">Novo Hamburgo</SelectItem>
              <SelectItem value="gramado">Gramado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({...prev, sortBy: value}))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Destaques</SelectItem>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="price_asc">Menor preço</SelectItem>
              <SelectItem value="price_desc">Maior preço</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </p>
        </div>

        {/* Properties Grid */}
        {currentProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum imóvel encontrado com os filtros selecionados.
            </p>
            <Button
              onClick={() => setFilters({ type: "all", city: "all", transaction: "all", sortBy: "featured" })}
              className="mt-4"
              variant="outline"
            >
              Limpar filtros
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </Button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-primary" : ""}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-2"
            >
              <span>Próxima</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyShowcase;