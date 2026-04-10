# s2 Clube — Cadastro de Dependentes

## Visão Geral

Sistema de 3 automações para gestão de benefícios do **s2 Clube (Saúde & Sucesso)**:

| Automação | Responsável | O que faz |
|-----------|-------------|-----------|
| 1 | n8n | Recebe webhook de assinatura aprovada → salva titular no Supabase |
| **2** | **Este app (Next.js)** | **Portal para titulares cadastrarem dependentes** |
| 3 | n8n | Escuta INSERT na tabela `dependentes` → envia para API Clube Certo |

---

## Automação 2 — Este App

### Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + CSS customizado (identidade s2 Clube)
- **Database**: Supabase (`@supabase/supabase-js`)
- **Deploy**: Vercel

### Fluxo de Usuário

```
/ (Etapa 1)          → Usuário digita CPF do titular
                       ↓ CPF encontrado no Supabase
/cadastro?cpf=XXX    → Exibe formulários de dependentes conforme oferta
                       ↓ oferta1 = 4 deps | oferta2 = 2 deps | oferta3 = upsell
/sucesso             → Confirmação de cadastro
/upsell              → Oferta 3: mostra planos para upgrade
```

### Páginas
| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `app/page.tsx` | Validação de CPF |
| `/cadastro` | `app/cadastro/page.tsx` | Cadastro de dependentes |
| `/sucesso` | `app/sucesso/page.tsx` | Confirmação |
| `/upsell` | `app/upsell/page.tsx` | Upsell para oferta3 |

### API Routes
| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/validar-cpf` | POST | Verifica CPF na tabela `Compradores_Clube_Certo` |
| `/api/cadastrar-dependentes` | POST | Salva dependentes na tabela `dependentes` |

---

## Supabase

### Projeto
- **URL**: `https://gzdznjnxyfuuzgdgjjft.supabase.co`

### Tabelas

**`Compradores_Clube_Certo`** — criada/gerenciada pela Automação 1 (n8n)
```
id              int
created_at      timestamp
nome_titular    text
telefone_titular text
cpf_titular     text (chave de busca)
email_titular   text
oferta          text  ← adicionado pela migration (valores: oferta1, oferta2, oferta3)
```

**`dependentes`** — criada/gerenciada por este app
```
id            uuid (PK)
cpf_titular   text
nome          text
email         text
cpf           text
telefone      text
created_at    timestamp
```

### Migration necessária
Execute o arquivo `supabase-migration.sql` no Supabase SQL Editor antes de usar o app.

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://gzdznjnxyfuuzgdgjjft.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SALES_URL=https://...  ← URL do checkout/vendas para CTA
```

---

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # verificar build de produção
```

---

## Deploy (Vercel)

```bash
npx vercel --prod
```

Configurar as 4 variáveis de ambiente no dashboard da Vercel antes do deploy.

---

## Automação 3 — n8n (referência)

Configurar um trigger no n8n para INSERT na tabela `dependentes`:

### 1. Obter token da empresa
```
POST https://node.clubecerto.com.br/superapp/companyAPI/login
Body: { "cnpj": "44.545.447/0001-11", "password": "flynow@3425" }
Response: { "token": "Bearer ..." }
```

### 2. Registrar dependente
```
POST https://node.clubecerto.com.br/superapp/companyAPI/associate
Headers: Authorization: Bearer {token}
Body: {
  "name": "{{ nome }}",
  "cpf": "{{ cpf }}",
  "email": "{{ email }}",
  "phone": "{{ telefone }}",
  "fatherCPF": "{{ cpf_titular }}"
}
```

### Erros comuns
| Código | Significado |
|--------|-------------|
| `fatherNotFounded` | Titular não cadastrado no Clube Certo |
| `MaxDependence` | Titular já tem 4 dependentes |
| `invalidCPF` | CPF com formato inválido |
| `fatherHasADependenceFounded` | CPF informado como titular é dependente de outro |

---

## Identidade Visual

- **Marca**: s2 Clube — Saúde & Sucesso
- **Cor primária**: `#E85A7A` (rosa/coral)
- **Gradiente**: `#E85A7A → #C94068`
- **Fundo**: `#fafafa`
- **Tipografia**: Geist Sans
