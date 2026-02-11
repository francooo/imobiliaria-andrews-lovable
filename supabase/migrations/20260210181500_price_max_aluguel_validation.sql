-- Migration: Validação de price_max para imóveis de aluguel
-- Descrição: Garante que o campo price_max seja sempre NULL quando transaction_type for 'aluguel'
-- Isso previne inconsistências de dados mesmo em caso de requisições manuais ou bypass do frontend

-- Criar função trigger para validar price_max em aluguéis
CREATE OR REPLACE FUNCTION validate_price_max_for_aluguel()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o tipo de transação for aluguel, forçar price_max como NULL
  IF NEW.transaction_type = 'aluguel' THEN
    NEW.price_max = NULL;
    
    -- Opcional: Log para auditoria (comentado por padrão)
    -- RAISE NOTICE 'price_max foi automaticamente definido como NULL para imóvel de aluguel: %', NEW.title;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger que executa antes de INSERT ou UPDATE
CREATE TRIGGER enforce_price_max_aluguel
BEFORE INSERT OR UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION validate_price_max_for_aluguel();

-- Comentário descritivo para documentação
COMMENT ON FUNCTION validate_price_max_for_aluguel() IS 
'Valida regra de negócio: imóveis de aluguel não devem ter price_max definido. Força NULL automaticamente.';

COMMENT ON TRIGGER enforce_price_max_aluguel ON public.properties IS 
'Trigger que garante integridade da regra de negócio: price_max = NULL quando transaction_type = aluguel';
