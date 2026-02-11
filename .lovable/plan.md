

## Correcao do erro de build e orientacoes de configuracao

### 1. Corrigir erro de build na Edge Function

O erro ocorre porque o import `npm:resend@2.0.0` nao esta sendo resolvido corretamente no `send-confirmation-email/index.ts`. A correcao sera alterar o import para usar `https://esm.sh/resend@2.0.0` em ambas as Edge Functions para garantir consistencia.

**Arquivos a editar:**
- `supabase/functions/send-confirmation-email/index.ts` - linha 2: trocar `npm:resend@2.0.0` por `https://esm.sh/resend@2.0.0`
- `supabase/functions/send-lead-email/index.ts` - linha 2: mesma alteracao preventiva

Ambas as Edge Functions serao reimplantadas apos a correcao.

### 2. Migracoes no Supabase

As migracoes ja existentes no projeto (`supabase/migrations/`) sao aplicadas automaticamente pelo Lovable quando aprovadas. Nao e necessario executa-las manualmente no SQL Editor, a menos que alguma migracao especifica tenha falhado. Verifique no Supabase Dashboard se as tabelas `profiles` e `favorites` ja existem.

### 3. Configurar Email Templates no Supabase

Isso deve ser feito manualmente no Supabase Dashboard:
- Acesse **Authentication > Email Templates**
- Configure os templates de **Confirm signup** e **Reset password** com a marca "AF Negocios Imobiliarios"

Essa configuracao nao pode ser feita via codigo, precisa ser feita diretamente no painel.

### Detalhes tecnicos

A unica alteracao de codigo sera na linha de import do Resend em ambas as Edge Functions:

```text
Antes:  import { Resend } from "npm:resend@2.0.0";
Depois: import { Resend } from "https://esm.sh/resend@2.0.0";
```

Apos a correcao, as duas funcoes serao reimplantadas automaticamente.

