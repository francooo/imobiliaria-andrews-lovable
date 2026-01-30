-- Adicionar campos de endereço na tabela leads
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS cep text,
ADD COLUMN IF NOT EXISTS logradouro text,
ADD COLUMN IF NOT EXISTS bairro text,
ADD COLUMN IF NOT EXISTS cidade text,
ADD COLUMN IF NOT EXISTS estado text;

-- Criar índice para cidade para otimizar filtros
CREATE INDEX IF NOT EXISTS idx_leads_cidade ON public.leads(cidade);

-- Criar índice para cidade na tabela properties (já existe a coluna)
CREATE INDEX IF NOT EXISTS idx_properties_cidade ON public.properties(city);

-- Criar índice composto para filtros de destaque por cidade
CREATE INDEX IF NOT EXISTS idx_properties_featured_city ON public.properties(city, featured) WHERE active = true;