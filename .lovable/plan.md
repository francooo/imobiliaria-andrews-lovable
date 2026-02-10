

## Renomear "Andrews Franco" para "AF Negocios Imobiliarios"

Substituicao do nome "Andrews Franco" por "AF Negocios Imobiliarios" em todos os arquivos do projeto.

### Arquivos e alteracoes

**1. `index.html`** (meta tags e SEO)
- Title, description, og:title, og:description, author

**2. `src/components/Header.tsx`**
- aria-label do logo
- Texto `<h1>` do nome no header

**3. `src/components/AboutSection.tsx`**
- aria-label da section
- Titulo "Sobre ..."
- Alt da imagem
- Citacao "-- Andrews Franco"

**4. `src/components/PropertyDetails.tsx`**
- Alt da imagem do corretor
- Nome exibido no card do corretor

**5. `src/index.css`**
- Comentario de referencia ao tema

**6. `supabase/functions/send-lead-email/index.ts`**
- Campo "from" do email de notificacao
- Texto no corpo do email de confirmacao (titulo, assinatura, rodape)

**7. `supabase/functions/send-confirmation-email/index.ts`**
- Campo "from"
- Subject
- Titulo no header do email
- Texto no footer do email

### Detalhes tecnicos

- Todas as ocorrencias de "Andrews Franco" serao substituidas por "AF Negocios Imobiliarios"
- Variantes como "Andrews Franco Imoveis" passam a "AF Negocios Imobiliarios"
- "Corretor Andrews Franco" passa a "AF Negocios Imobiliarios"
- As Edge Functions `send-lead-email` e `send-confirmation-email` serao reimplantadas apos a alteracao
- O logotipo "AF" no header permanece inalterado, pois ja corresponde a sigla

