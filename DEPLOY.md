# FeedbackHub — Plano de Deploy

## Visão Geral

```
Cliente (navegador)
    ↓ (HTTPS)
Frontend (Vercel)  ← Next.js, React
    ↓ (HTTPS)
Backend (Render)  ← FastAPI
    ↓
Banco de Dados (Supabase Postgres)
```

**O que vamos fazer:**
1. Deploy do **Backend** no Render (FastAPI + Postgres)
2. Deploy do **Frontend** na Vercel (Next.js)
3. Conectar Frontend → Backend com variáveis de ambiente
4. CI/CD automático (cada push para main faz deploy automático)

---

## Pré-requisitos

✓ GitHub account (para alocar o repositório)
✓ Render account (para deploy do backend)
✓ Vercel account (para deploy do frontend)
✓ Supabase account (para o banco de dados em produção)

---

## Fase 1: Preparar o Repositório para Deploy

### 1.1 Criar um repositório GitHub

```bash
git remote add origin https://github.com/SEU_USER/feedbackhub.git
git branch -M main
git push -u origin main
```

Agora seu código está no GitHub, e Render/Vercel conseguem acessar.

---

## Fase 2: Deploy do Backend (Render)

### 2.1 Criar um novo serviço no Render

1. Vá em [render.com](https://render.com)
2. Clique em **New** → **Web Service**
3. Conecte seu repositório GitHub
4. Preencha:
   - **Name:** `feedbackhub-api`
   - **Environment:** `Python 3.12`
   - **Build Command:** `pip install -r requirements.txt && alembic upgrade head`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 8000`

### 2.2 Variáveis de Ambiente no Render

No dashboard do Render, vá em **Environment** e adicione:

```
APP_NAME=FeedbackHub API
ENVIRONMENT=production
DATABASE_URL=postgresql+psycopg://[usuario]:[senha]@[host]:[porta]/[database]
```

**De onde vem DATABASE_URL?**
- Supabase → Settings → Database → Connection string (URI)
- Formato: `postgresql+psycopg://postgres:SENHA@db.XXXXX.supabase.co:5432/postgres`

### 2.3 O que acontece após Deploy

- Render vai puxar seu código do GitHub
- Rodar `pip install -r requirements.txt` (instalar FastAPI, SQLAlchemy, etc.)
- Rodar `alembic upgrade head` (criar as tabelas no banco)
- Iniciar o servidor `uvicorn` na porta 8000
- Gerar um domínio automático: `https://feedbackhub-api.onrender.com`

**Seu backend fica acessível em:** `https://feedbackhub-api.onrender.com/api/v1/companies`

---

## Fase 3: Deploy do Frontend (Vercel)

### 3.1 Conectar repositório na Vercel

1. Vá em [vercel.com](https://vercel.com)
2. Clique em **Add New** → **Project**
3. Importe seu repositório GitHub
4. Vercel detecta automaticamente que é Next.js
5. Clique em **Deploy**

### 3.2 Variáveis de Ambiente na Vercel

No dashboard, vá em **Settings** → **Environment Variables** e adicione:

```
NEXT_PUBLIC_API_URL=https://feedbackhub-api.onrender.com/api/v1
```

**Por que `NEXT_PUBLIC_`?**
- Variáveis que começam com `NEXT_PUBLIC_` são expostas no navegador (cliente)
- O frontend precisa saber a URL do backend para fazer requisições

### 3.3 O que acontece após Deploy

- Vercel vai puxar seu código do GitHub
- Rodar `npm install` (instalar Next.js, React, axios)
- Rodar `npm run build` (compilar o React para otimizado)
- Iniciar em produção na porta 3000 (interna)
- Gerar um domínio automático: `https://feedbackhub-frontend.vercel.app`

**Seu frontend fica acessível em:** `https://feedbackhub-frontend.vercel.app`

---

## Fase 4: CI/CD Automático

Após configurar os dois serviços, **toda vez que você fizer push para main:**

```bash
git push origin main
```

**Automaticamente:**
1. GitHub notifica Render e Vercel
2. Render pula o código do backend, roda testes/migrations, faz deploy
3. Vercel pula o código do frontend, compila, faz deploy
4. Em ~2-5 minutos, suas mudanças estão em produção

**Sem você fazer nada manualmente.**

---

## Fase 5: Entender o que Acontece (Bastidores)

### 5.1 Variáveis de Ambiente

```
Frontend (.env.local — DEV):
NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1

Frontend (Vercel — PROD):
NEXT_PUBLIC_API_URL=https://feedbackhub-api.onrender.com/api/v1

Backend (.env — DEV):
DATABASE_URL=postgresql+psycopg://feedbackhub:changeme@localhost:5433/feedbackhub_dev

Backend (Render — PROD):
DATABASE_URL=postgresql+psycopg://postgres:SENHA_SUPABASE@db.XXXXX.supabase.co:5432/postgres
```

**Por quê separar?** Em desenvolvimento você usa localhost; em produção você usa os domínios reais. As variáveis controlam isso sem alterar o código.

### 5.2 HTTPS Automático

- Vercel gera um certificado SSL automaticamente (HTTPS grátis)
- Render também gera automaticamente
- Seu browser tem cadeado verde, dados são criptografados

### 5.3 DNS e Domínios

```
vercel.com → aponta para → servidores da Vercel (frontend)
onrender.com → aponta para → servidores do Render (backend)
```

Quando você digita `https://feedbackhub-frontend.vercel.app` no navegador:
1. DNS resolve para o servidor da Vercel
2. Browser conecta (HTTPS)
3. Vercel envia HTML/CSS/JS (Next.js)
4. React carrega no navegador
5. Faz requisições para `https://feedbackhub-api.onrender.com/api/v1/companies`
6. Render responde com JSON
7. React renderiza a tabela

### 5.4 Segurança com Variáveis

**NUNCA commit a senha do banco:**
```bash
# ERRADO — vai para o GitHub:
DATABASE_URL=postgresql://postgres:MINHA_SENHA_REAL@...
git add .env && git commit

# CORRETO — nunca sai do seu computador:
# .gitignore ignora .env
# Você copia a senha via Render/Vercel dashboard (seguro)
```

---

## Checklist de Deploy

### Antes de Fazer Deploy

- [ ] Código commitado no GitHub (`git push origin main`)
- [ ] `.env` com senhas **não está** no repositório (checado por `.gitignore`)
- [ ] Backend tem `requirements.txt` atualizado
- [ ] Frontend tem `package.json` atualizado
- [ ] Todas as migrations Alembic estão commitadas

### Deploy Backend (Render)

- [ ] Criar Web Service no Render
- [ ] Conectar repositório GitHub
- [ ] Adicionar variáveis de ambiente (DATABASE_URL, etc.)
- [ ] Verificar que o build foi bem-sucedido
- [ ] Testar: `curl https://feedbackhub-api.onrender.com/health`

### Deploy Frontend (Vercel)

- [ ] Importar projeto no Vercel
- [ ] Adicionar `NEXT_PUBLIC_API_URL` apontando para o backend do Render
- [ ] Verificar que o build compilou
- [ ] Testar: abrir `https://feedbackhub-frontend.vercel.app` no navegador

### Teste End-to-End

- [ ] Frontend carrega
- [ ] Consegue criar uma nova empresa
- [ ] Lista aparece na tabela
- [ ] Validação funciona (slug com maiúscula é rejeitado)

---

## Problemas Comuns e Soluções

### "Frontend retorna erro de conexão"
**Causa:** `NEXT_PUBLIC_API_URL` está errada ou o backend não está respondendo
**Solução:** 
```bash
# Verificar se backend está de pé:
curl https://feedbackhub-api.onrender.com/health

# Verificar variável no Vercel dashboard:
Settings → Environment Variables → NEXT_PUBLIC_API_URL deve ser correto
```

### "Backend retorna erro de banco de dados"
**Causa:** DATABASE_URL está errada ou Supabase está offline
**Solução:**
```bash
# Verificar connection string do Supabase:
Supabase → Settings → Database → Connection string (copiar exato)

# Re-fazer as migrations:
Render → Logs → Verificar se alembic upgrade head rodou sem erro
```

### "Vercel diz 'Build failed'"
**Causa:** Geralmente falta de dependência ou erro de TypeScript
**Solução:**
```bash
# Rodar localmente:
cd frontend && npm run build

# Ver erro real, corrigir, fazer push:
git push origin main
```

---

## Próximas Etapas (Após Deploy Básico Funcionar)

1. **Custom Domain:** Apontar seu domínio próprio (feedbackhub.com) em vez de vercel.app
2. **CORS:** Frontend e backend em domínios diferentes? Precisa configurar CORS
3. **Monitoramento:** Render/Vercel têm logs; aprender a ler e debugar
4. **Banco de Dados em Produção:** Conectar de verdade ao Supabase (não é localhost)
5. **Testes Automatizados:** Adicionar testes que rodam em cada push
6. **Secrets Seguros:** Usar o Render Secrets Manager em vez de digitar senhas no dashboard

---

## Resumo do Fluxo

```
1. Você edita código localmente
2. git push origin main
3. GitHub notifica Render + Vercel
4. Render: pip install → alembic upgrade → uvicorn
5. Vercel: npm install → npm run build → next start
6. ~2-5 minutos depois: seu app está em produção
7. Clientes acessam https://feedbackhub-frontend.vercel.app
```

É isso. Deploy automático, sem você mexer em servidores, SSH, ou AWS. Render + Vercel + GitHub fazem tudo.
