-- ============================================================
-- s2 Clube — Migration SQL
-- Execute no Supabase: Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. Adicionar campo "oferta" na tabela de compradores
--    (criada pela Automação 1 no n8n)
ALTER TABLE "Compradores_Clube_Certo"
  ADD COLUMN IF NOT EXISTS oferta text;

-- Exemplo de valores esperados: 'oferta1', 'oferta2', 'oferta3'
-- Configure o n8n para salvar esse valor ao criar o registro

-- 2. Criar tabela de dependentes
--    (alimentada pela Automação 2 — este app Next.js)
CREATE TABLE IF NOT EXISTS dependentes (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cpf_titular   text NOT NULL,
  nome          text NOT NULL,
  email         text,
  cpf           text NOT NULL,
  telefone      text,
  created_at    timestamp with time zone DEFAULT now()
);

-- Índice para buscas por titular
CREATE INDEX IF NOT EXISTS idx_dependentes_cpf_titular
  ON dependentes (cpf_titular);

-- ============================================================
-- Configurar a Automação 3 no n8n:
-- Trigger: INSERT na tabela "dependentes"
-- Ação: POST https://node.clubecerto.com.br/superapp/companyAPI/associate
-- Body: {
--   "name": "{{ $json.nome }}",
--   "cpf": "{{ $json.cpf }}",
--   "email": "{{ $json.email }}",
--   "phone": "{{ $json.telefone }}",
--   "fatherCPF": "{{ $json.cpf_titular }}"
-- }
-- Auth: Bearer token obtido via POST /companyAPI/login
--   { "cnpj": "44.545.447/0001-11", "password": "flynow@3425" }
-- ============================================================
