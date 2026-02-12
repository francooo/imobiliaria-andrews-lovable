-- Criar tabela user_roles para gerenciar permissões de usuários
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Ativar Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas suas próprias roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Apenas admins podem inserir roles
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Política: Apenas admins podem atualizar roles
CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Política: Apenas admins podem deletar roles
CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Comentários para documentação
COMMENT ON TABLE public.user_roles IS 'Armazena as roles (permissões) dos usuários do sistema';
COMMENT ON COLUMN public.user_roles.user_id IS 'ID do usuário (referência para auth.users)';
COMMENT ON COLUMN public.user_roles.role IS 'Role do usuário: admin ou client';
