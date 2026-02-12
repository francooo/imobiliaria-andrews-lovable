-- Inserir role admin para o email autorizado
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'andrewsfranco93@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Comentário
COMMENT ON TABLE public.user_roles IS 'Role admin atribuída apenas para andrewsfranco93@gmail.com';
