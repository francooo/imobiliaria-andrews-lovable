
# Plano de Correção: Upload de Imagens no Painel Admin

## Problema Identificado

O erro de upload de imagens ocorre porque **o bucket de storage `property-images` não existe** no Supabase. O componente `ImageUpload.tsx` tenta fazer upload para esse bucket (linha 26), mas ele nunca foi criado.

## Solução

Criar o bucket de storage `property-images` com as políticas de acesso (RLS) corretas para permitir:
- Upload de imagens por usuários autenticados (administradores)
- Visualização pública das imagens (para exibir no site)

---

## Etapas de Implementação

### 1. Criar Bucket de Storage

Executar uma migração SQL para criar o bucket `property-images` como público (para permitir visualização das imagens no site).

```text
+---------------------------+
|  storage.buckets          |
+---------------------------+
| id: property-images       |
| name: property-images     |
| public: true              |
+---------------------------+
```

### 2. Configurar Políticas de Acesso (RLS)

Criar as seguintes políticas no bucket:

| Operacao | Quem pode executar | Descricao |
|----------|-------------------|-----------|
| SELECT (visualizar) | Todos (anon) | Imagens publicas para exibicao no site |
| INSERT (upload) | Usuarios autenticados | Apenas admins podem fazer upload |
| UPDATE (atualizar) | Usuarios autenticados | Apenas admins podem atualizar |
| DELETE (excluir) | Usuarios autenticados | Apenas admins podem excluir |

### 3. Melhorar Tratamento de Erros

Atualizar o componente `ImageUpload.tsx` para mostrar mensagens de erro mais detalhadas, facilitando a identificacao de problemas futuros.

---

## Detalhes Tecnicos

### SQL da Migracao

A migracao criara:

1. **Bucket de storage**:
   - Nome: `property-images`
   - Tipo: Publico (para visualizacao)

2. **Politicas RLS para `storage.objects`**:
   - Politica de leitura publica para o bucket
   - Politica de insercao para usuarios autenticados
   - Politica de atualizacao para usuarios autenticados
   - Politica de exclusao para usuarios autenticados

### Arquivos a Modificar

1. **Nova migracao SQL** - Criar bucket e politicas
2. **`src/components/ImageUpload.tsx`** - Melhorar logs e mensagens de erro

---

## Resultado Esperado

Apos a implementacao:
- O upload de imagens funcionara corretamente no painel admin
- As imagens serao armazenadas no Supabase Storage
- As URLs publicas serao salvas no banco de dados
- As imagens poderao ser visualizadas publicamente no site
