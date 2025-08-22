-- Criar tabela de imóveis
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartamento', 'casa', 'sala_comercial', 'terreno', 'sobrado', 'cobertura', 'casa_condominio', 'area', 'chacara', 'terreno_condominio')),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('venda', 'aluguel')),
  price_min DECIMAL(15,2),
  price_max DECIMAL(15,2),
  city TEXT NOT NULL,
  neighborhood TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  garage_spaces INTEGER,
  area_size DECIMAL(10,2),
  images TEXT[], -- Array de URLs das imagens
  features TEXT[], -- Array de características do imóvel
  status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'vendido', 'alugado', 'reservado')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de leads capturados
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  source TEXT DEFAULT 'popup_home', -- fonte do lead
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de depoimentos
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_photo TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  property_sold TEXT, -- imóvel que foi vendido/alugado
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Políticas para imóveis (público pode ver, apenas admin pode modificar)
CREATE POLICY "Imóveis são visíveis para todos" 
ON public.properties 
FOR SELECT 
USING (true);

-- Políticas para leads (apenas admin pode ver)
CREATE POLICY "Leads são privados" 
ON public.leads 
FOR SELECT 
USING (false); -- Apenas através de edge functions

CREATE POLICY "Qualquer um pode inserir leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Políticas para depoimentos (público pode ver)
CREATE POLICY "Depoimentos ativos são visíveis para todos" 
ON public.testimonials 
FOR SELECT 
USING (active = true);

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir alguns imóveis de exemplo
INSERT INTO public.properties (title, description, property_type, transaction_type, price_min, price_max, city, neighborhood, bedrooms, bathrooms, garage_spaces, area_size, images, features, featured) VALUES
('Casa Moderna no Centro', 'Belíssima casa com acabamento de primeira qualidade, localizada no coração da cidade. Perfeita para famílias que buscam conforto e praticidade.', 'casa', 'venda', 450000, 480000, 'Porto Alegre', 'Centro', 3, 2, 2, 180.5, 
 ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'], 
 ARRAY['Piscina', 'Churrasqueira', 'Área de lazer', 'Portaria 24h'], true),
 
('Apartamento Luxo Vista Mar', 'Apartamento de alto padrão com vista deslumbrante para o mar. Mobiliado e equipado com os melhores acabamentos.', 'apartamento', 'venda', 650000, 700000, 'Capão da Canoa', 'Zona Nova', 2, 2, 1, 95.0,
 ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
 ARRAY['Vista para o mar', 'Mobiliado', 'Academia', 'Piscina'], true),

('Terreno Comercial Estratégico', 'Excelente terreno para investimento comercial, localizado em área de grande movimento e fácil acesso.', 'terreno', 'venda', 280000, 320000, 'Novo Hamburgo', 'Industrial', 0, 0, 0, 1200.0,
 ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
 ARRAY['Esquina', 'Zoneamento comercial', 'Fácil acesso'], false);

-- Inserir alguns depoimentos de exemplo
INSERT INTO public.testimonials (client_name, client_photo, rating, comment, property_sold) VALUES
('Maria Silva Santos', 'https://images.unsplash.com/photo-1494790108755-2616b332c5a0?w=200', 5, 'Profissional excepcional! O Andrews me ajudou a encontrar a casa dos meus sonhos. Sempre atencioso e dedicado, superou todas as minhas expectativas.', 'Casa no Bairro Jardim'),
('João Carlos Oliveira', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', 5, 'Recomendo de olhos fechados! Venda rápida e sem complicações. O Andrews conhece muito bem o mercado imobiliário da região.', 'Apartamento Centro'),
('Ana Paula Costa', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', 5, 'Atendimento personalizado e resultado incrível! Consegui vender meu imóvel pelo preço que eu queria. Muito obrigada!', 'Cobertura Vista Alegre');