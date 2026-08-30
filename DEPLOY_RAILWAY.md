# Deploy no Railway com Docker

## Pré-requisitos

- Docker instalado localmente (opcional, só pra testar)
- Railway account (railway.app)
- Seu código commitado

---

## Fase 1: Testar Localmente com Docker

Se tiver Docker instalado, pode testar tudo junto:

```bash
docker-compose up --build
```

Depois:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000/health`
- PostgreSQL: `localhost:5433`

(Ctrl+C para parar)

---

## Fase 2: Deploy no Railway

### 2.1 Criar conta e projeto

1. Vá em [railway.app](https://railway.app)
2. Login (GitHub/Email)
3. Clique em **New Project** → **Deploy from Repo**
4. Conecte seu repositório GitHub

### 2.2 Configurar Railway para Multi-Service

Railway vai detectar automaticamente que tem `backend/Dockerfile` e `frontend/Dockerfile`.

**Clique em "Add Service"** e selecione:
- **Backend:** `./backend/Dockerfile`
- **Frontend:** `./frontend/Dockerfile`
- **Database:** PostgreSQL (Railway gerencia)

### 2.3 Variáveis de Ambiente

#### Backend
```
DATABASE_URL=postgresql+psycopg://[user]:[password]@[host]:5432/[database]
ENVIRONMENT=production
```

Railway oferece PostgreSQL gerenciado — ele passa a URL automaticamente.

#### Frontend
```
NEXT_PUBLIC_API_URL=https://seu-backend-url.railway.app/api/v1
```

Substitui `seu-backend-url` pelo domínio do backend que Railway gera.

---

## Resumo

| Serviço | Porta | URL em Produção |
|---------|-------|-----------------|
| Frontend | 3000 | `https://seu-frontend.railway.app` |
| Backend | 8000 | `https://seu-backend.railway.app` |
| Database | 5432 | `postgresql://...@railway.railway.internal:5432/railway` |

Railway faz:
- Build automático (lê os Dockerfiles)
- HTTPS automático
- Escalabilidade automática
- CI/CD integrado com GitHub

Cada push para main = deploy automático.

---

## Passos Rápidos

1. Commit e push para GitHub
2. Railway → New Project → Deploy from Repo
3. Seleciona seu repositório
4. Railway detecta Dockerfiles
5. Clica em "Deploy"
6. Aguarda ~5 minutos
7. Railway gera URLs automáticas
8. Pronto!
