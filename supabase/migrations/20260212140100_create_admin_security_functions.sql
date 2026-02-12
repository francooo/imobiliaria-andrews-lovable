-- Função para verificar se o usuário atual é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    INNER JOIN auth.users u ON u.id = ur.user_id
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
      AND u.email = 'andrewsfranco93@gmail.com'
  );
$$;

-- Função para impedir que outros emails recebam role admin
CREATE OR REPLACE FUNCTION public.prevent_fake_admin()
RETURNS TRIGGER AS $$
BEGIN
  -- Se está tentando inserir/atualizar role admin
  IF NEW.role = 'admin' THEN
    -- Verificar se o email é o autorizado
    IF NOT EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = NEW.user_id
        AND email = 'andrewsfranco93@gmail.com'
    ) THEN
      RAISE EXCEPTION 'Admin role is only allowed for andrewsfranco93@gmail.com';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para proteger role admin
DROP TRIGGER IF EXISTS protect_admin_role ON public.user_roles;
CREATE TRIGGER protect_admin_role
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_fake_admin();

-- Função para auto-atribuir role client a novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Se não for o email admin, atribuir role client
  IF NEW.email != 'andrewsfranco93@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'client')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para auto-atribuir role client
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- Comentários para documentação
COMMENT ON FUNCTION public.is_admin() IS 'Verifica se o usuário atual é admin (apenas andrewsfranco93@gmail.com)';
COMMENT ON FUNCTION public.prevent_fake_admin() IS 'Trigger function que impede role admin para outros emails';
COMMENT ON FUNCTION public.handle_new_user_role() IS 'Trigger function que atribui role client automaticamente a novos usuários';
