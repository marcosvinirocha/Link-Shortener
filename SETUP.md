## ▶️ Como rodar localmente

```bash
# 1. Copiar variáveis de ambiente
cp .env.example .env

# 2. Subir infraestrutura (PostgreSQL + Redis)
docker-compose up -d

# 3. Back-end
cd tests/backend
npm install
# Configurar o banco no .env do backend
npm run dev        # inicia na porta 3001

# 4. Migrations (em outro terminal)
cd tests/backend
npx prisma migrate dev   # se usar Prisma
# ou: npm run migration:run  # se usar TypeORM

# 5. Front-end (em outro terminal)
cd tests/frontend
npm install
npm run dev        # inicia na porta 5173 (Vite) ou 3000

# 6. Testar redirect (abrir no browser ou curl)
curl -v http://localhost:3001/abc123
```

### Variáveis de ambiente do back-end

Crie `tests/backend/.env`:
```
DATABASE_URL=postgresql://shortener:shortener123@localhost:5432/shortener
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-local
PORT=3001
BASE_URL=http://localhost:3001
```

### Variáveis de ambiente do front-end

Crie `tests/frontend/.env`:
```
VITE_API_URL=http://localhost:3001
```
