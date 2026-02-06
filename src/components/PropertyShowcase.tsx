import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Filter, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import PropertyCard from "./PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { normalizeCidade } from "@/hooks/useCep";

type Property = Database['public']['Tables']['properties']['Row'];

const PropertyShowcase = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [leadCidade, setLeadCidade] = useState<string | null>(null);
  const [usingLeadFilter, setUsingLeadFilter] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    city: "all",
    transaction: "all",
    sortBy: "featured"
  });

  const propertiesPerPage = 6;

  useEffect(() => {
    fetchProperties();
    loadLeadCidade();

    // Ouvir mudanças na cidade do lead
    const handleLeadCidadeChanged = () => {
      loadLeadCidade();
    };
    window.addEventListener('leadCidadeChanged', handleLeadCidadeChanged);

    return () => {
      window.removeEventListener('leadCidadeChanged', handleLeadCidadeChanged);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, filters, leadCidade, usingLeadFilter]);

  const loadLeadCidade = () => {
    const cidade = localStorage.getItem('leadCidade');
    if (cidade) {
      setLeadCidade(cidade);
      setUsingLeadFilter(true);
    }
  };

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('active', true)
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

    // Primeiro, aplicar filtro da cidade do lead se ativo
    if (usingLeadFilter && leadCidade && filters.city === "all") {
      const cidadeNormalizada = leadCidade.toLowerCase();
      const matchedInCity = filtered.filter(p => {
        const propCidade = p.city ? normalizeCidade(p.city) : "";
        return propCidade.includes(cidadeNormalizada) || cidadeNormalizada.includes(propCidade);
      });
      
      // Se encontrou imóveis na cidade, usa eles; senão, mostra todos
      if (matchedInCity.length > 0) {
        filtered = matchedInCity;
      }
    }

    // Filtrar por tipo de transação
    if (filters.transaction !== "all") {
      filtered = filtered.filter(p => p.transaction_type === filters.transaction);
    }

    // Filtrar por tipo de imóvel
    if (filters.type !== "all") {
      filtered = filtered.filter(p => p.property_type === filters.type);
    }

    // Filtrar por cidade (seleção manual)
    if (filters.city !== "all") {
      filtered = filtered.filter(p => p.city?.toLowerCase().includes(filters.city));
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

  const clearLeadFilter = () => {
    localStorage.removeItem('leadCidade');
    setLeadCidade(null);
    setUsingLeadFilter(false);
  };

  const handleViewDetails = (property: Property) => {
    // Navegar para página de detalhes do imóvel
    window.location.href = `/imovel/${property.id}`;
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
    <section id="imoveis" className="py-12 sm:py-20 bg-background" aria-label="Imóveis em destaque">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Imóveis em <span className="text-primary">Destaque</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Conheça nossa seleção especial de imóveis com as melhores oportunidades
          </p>
        </header>

        {/* Lead Location Filter Badge */}
        {usingLeadFilter && leadCidade && filters.city === "all" && (
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <Badge 
              variant="secondary" 
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-primary/10 border border-primary/20 text-foreground"
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary" />
              <span className="truncate">Imóveis em: <span className="font-semibold capitalize">{leadCidade}</span></span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-5 w-5 p-0 hover:bg-destructive/20 min-w-[20px] min-h-[20px]"
                onClick={clearLeadFilter}
                aria-label="Limpar filtro de localização"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          </div>
        )}

        {/* Filters - Mobile Optimized */}
        <div className="mb-6 sm:mb-8 bg-card p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border">
          <div className="flex items-center space-x-2 text-sm font-medium text-foreground mb-3 sm:mb-4">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <Select value={filters.transaction} onValueChange={(value) => setFilters(prev => ({ ...prev, transaction: value }))}>
              <SelectTrigger className="h-10 sm:h-11 text-xs sm:text-sm touch-manipulation">
                <SelectValue placeholder="Transação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="venda">Venda</SelectItem>
                <SelectItem value="aluguel">Aluguel</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="h-10 sm:h-11 text-xs sm:text-sm touch-manipulation">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="apartamento">Apartamento</SelectItem>
                <SelectItem value="casa">Casa</SelectItem>
                <SelectItem value="sobrado">Sobrado</SelectItem>
                <SelectItem value="cobertura">Cobertura</SelectItem>
                <SelectItem value="terreno">Terreno</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
              <SelectTrigger className="h-10 sm:h-11 text-xs sm:text-sm touch-manipulation">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="porto alegre">Porto Alegre</SelectItem>
                <SelectItem value="canoas">Canoas</SelectItem>
                <SelectItem value="novo hamburgo">Novo Hamburgo</SelectItem>
                <SelectItem value="gramado">Gramado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
              <SelectTrigger className="h-10 sm:h-11 text-xs sm:text-sm touch-manipulation">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destaques</SelectItem>
                <SelectItem value="newest">Recentes</SelectItem>
                <SelectItem value="price_asc">Menor preço</SelectItem>
                <SelectItem value="price_desc">Maior preço</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 sm:mb-6">
          <p className="text-sm sm:text-base text-muted-foreground">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </p>
        </div>

        {/* Properties Grid - Responsive */}
        {currentProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {currentProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground text-base sm:text-lg mb-4">
              Nenhum imóvel encontrado com os filtros selecionados.
            </p>
            <Button
              onClick={() => setFilters({ type: "all", city: "all", transaction: "all", sortBy: "featured" })}
              variant="outline"
              className="min-h-[44px] touch-manipulation"
            >
              Limpar filtros
            </Button>
          </div>
        )}

        {/* Pagination - Mobile Optimized */}
        {totalPages > 1 && (
          <nav className="flex flex-col sm:flex-row items-center justify-center gap-4" aria-label="Navegação de páginas">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="min-h-[44px] min-w-[44px] sm:min-w-[100px] touch-manipulation"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>

              <div className="flex items-center space-x-1 sm:space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] touch-manipulation ${currentPage === page ? "bg-primary" : ""}`}
                    aria-label={`Página ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="min-h-[44px] min-w-[44px] sm:min-w-[100px] touch-manipulation"
                aria-label="Próxima página"
              >
                <span className="hidden sm:inline">Próxima</span>
                <ChevronRight className="w-4 h-4 sm:ml-1" />
              </Button>
            </div>
          </nav>
        )}
      </div>
    </section>
  );
};

export default PropertyShowcase;