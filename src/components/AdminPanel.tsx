import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
}

const AdminPanel = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: '',
    transaction_type: '',
    price_min: '',
    price_max: '',
    city: '',
    neighborhood: '',
    bedrooms: '',
    bathrooms: '',
    garage_spaces: '',
    area_size: '',
    status: 'disponivel',
    featured: false,
    features: [] as string[],
    images: [] as string[]
  });
  const [newFeature, setNewFeature] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os imóveis.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const propertyData = {
        title: formData.title,
        description: formData.description || null,
        property_type: formData.property_type,
        transaction_type: formData.transaction_type,
        price_min: formData.price_min ? parseFloat(formData.price_min) : null,
        price_max: formData.price_max ? parseFloat(formData.price_max) : null,
        city: formData.city,
        neighborhood: formData.neighborhood || null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        garage_spaces: formData.garage_spaces ? parseInt(formData.garage_spaces) : null,
        area_size: formData.area_size ? parseFloat(formData.area_size) : null,
        status: formData.status,
        featured: formData.featured,
        features: formData.features.length > 0 ? formData.features : null,
        images: formData.images.length > 0 ? formData.images : null
      };

      let error;
      if (editingProperty) {
        const result = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id);
        error = result.error;
      } else {
        const result = await supabase
          .from('properties')
          .insert([propertyData]);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Imóvel ${editingProperty ? 'atualizado' : 'criado'} com sucesso!`,
      });

      resetForm();
      fetchProperties();
    } catch (error) {
      console.error('Erro ao salvar imóvel:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o imóvel.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description || '',
      property_type: property.property_type,
      transaction_type: property.transaction_type,
      price_min: property.price_min?.toString() || '',
      price_max: property.price_max?.toString() || '',
      city: property.city,
      neighborhood: property.neighborhood || '',
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      garage_spaces: property.garage_spaces?.toString() || '',
      area_size: property.area_size?.toString() || '',
      status: property.status,
      featured: property.featured,
      features: property.features || [],
      images: property.images || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Imóvel excluído com sucesso!",
      });

      fetchProperties();
    } catch (error) {
      console.error('Erro ao excluir imóvel:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o imóvel.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      property_type: '',
      transaction_type: '',
      price_min: '',
      price_max: '',
      city: '',
      neighborhood: '',
      bedrooms: '',
      bathrooms: '',
      garage_spaces: '',
      area_size: '',
      status: 'disponivel',
      featured: false,
      features: [],
      images: []
    });
    setEditingProperty(null);
    setShowForm(false);
    setNewFeature('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
          <Button onClick={() => setShowForm(true)} className="bg-gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Imóvel
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingProperty ? 'Editar Imóvel' : 'Novo Imóvel'}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="property_type">Tipo de Imóvel *</Label>
                    <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="sobrado">Sobrado</SelectItem>
                        <SelectItem value="cobertura">Cobertura</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="sala_comercial">Sala Comercial</SelectItem>
                        <SelectItem value="casa_condominio">Casa em Condomínio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="transaction_type">Tipo de Transação *</Label>
                    <Select value={formData.transaction_type} onValueChange={(value) => handleInputChange('transaction_type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a transação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="venda">Venda</SelectItem>
                        <SelectItem value="aluguel">Aluguel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price_min">Preço Mínimo</Label>
                    <Input
                      id="price_min"
                      type="number"
                      value={formData.price_min}
                      onChange={(e) => handleInputChange('price_min', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price_max">Preço Máximo</Label>
                    <Input
                      id="price_max"
                      type="number"
                      value={formData.price_max}
                      onChange={(e) => handleInputChange('price_max', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Banheiros</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="garage_spaces">Vagas de Garagem</Label>
                    <Input
                      id="garage_spaces"
                      type="number"
                      value={formData.garage_spaces}
                      onChange={(e) => handleInputChange('garage_spaces', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="area_size">Área (m²)</Label>
                    <Input
                      id="area_size"
                      type="number"
                      value={formData.area_size}
                      onChange={(e) => handleInputChange('area_size', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponivel">Disponível</SelectItem>
                        <SelectItem value="vendido">Vendido</SelectItem>
                        <SelectItem value="alugado">Alugado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Características</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Nova característica"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={addFeature}>
                      Adicionar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-xs hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange('featured', e.target.checked)}
                  />
                  <Label htmlFor="featured">Imóvel em destaque</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-gradient-primary">
                    {editingProperty ? 'Atualizar' : 'Salvar'} Imóvel
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {property.title}
                  </h3>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(property)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(property.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <Badge variant="outline">{property.property_type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Transação:</span>
                    <Badge variant="outline">{property.transaction_type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={property.status === 'disponivel' ? 'default' : 'secondary'}>
                      {property.status}
                    </Badge>
                  </div>
                  {property.featured && (
                    <Badge className="w-full justify-center">Destaque</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;