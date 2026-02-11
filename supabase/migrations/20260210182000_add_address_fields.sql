-- Migration: Adicionar campos de endereço completo à tabela properties
-- Descrição: Adiciona campos CEP, Estado e Logradouro para melhor gestão de endereços

-- Adicionar campos de endereço à tabela properties
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS cep TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS street TEXT;

-- Comentários para documentação
COMMENT ON COLUMN public.properties.cep IS 'CEP do imóvel no formato 00000-000';
COMMENT ON COLUMN public.properties.state IS 'Estado (UF) do imóvel, ex: SP, RJ, MG';
COMMENT ON COLUMN public.properties.street IS 'Logradouro/rua do imóvel';
