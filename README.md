<div align="center">

# 🧪 Teste Técnico — Desenvolvedor Full Stack

![ASA Digital](https://img.shields.io/badge/ASA%20Digital-Teste%20T%C3%A9cnico-FF7700?style=flat-square&logo=gitlab&logoColor=white)
![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)

**Encurtador de Links — aplicação Full Stack estilo bit.ly**

</div>

---

## 👋 Olá, Marcos Vinicius Oliveira Rocha!

Bem-vindo(a) ao teste técnico da ASA Digital para a vaga de **Desenvolvedor Full Stack (React + Node.js)**.

Não buscamos perfeição — buscamos código limpo, decisões justificadas e entrega funcional.

---

## 🚀 Acesso ao Repositório

| Campo | Valor |
|-------|-------|
| 🌐 GitLab | https://git.asadigital.io |
| 👤 Usuário | `marcos.rocha` |
| 🔑 Senha | `whHzXSBsMtCk` |
| 📁 Projeto | `https://git.asadigital.io/asa/digital/internal/interview/fullstack/marcos-vinicius-oliveira-rocha` |
| ⏰ Expira em | 04/04/2026 |

## 📥 Passo a Passo para Começar

### 1. Clone o repositório

```bash
git clone https://git.asadigital.io/asa/digital/internal/interview/fullstack/marcos-vinicius-oliveira-rocha
cd marcos-vinicius-oliveira-rocha
```

Quando pedir autenticação:
- **Username:** `marcos.rocha`
- **Password:** `whHzXSBsMtCk`

### 2. Crie sua branch de desenvolvimento

```bash
git checkout -b feat/marcos-vinicius-oliveira-rocha
```

### 3. Desenvolva sua solução

Coloque todo o código em **`tests/backend/ e tests/frontend/`**

### 4. Envie seu código (commits e push)

```bash
# Adicionar arquivos
git add .

# Fazer commit (use mensagens descritivas)
git commit -m "feat: implementar endpoints de livros"

# Enviar para o GitLab
git push origin feat/marcos-vinicius-oliveira-rocha
```

Repita o `git add → commit → push` quantas vezes quiser durante o desenvolvimento.

### 5. Abra o Merge Request

Quando terminar (ou quando o prazo estiver chegando):

1. Acesse: `https://git.asadigital.io/asa/digital/internal/interview/fullstack/marcos-vinicius-oliveira-rocha`
2. Clique em **"Create merge request"** na sua branch
3. Preencha o template de entrega
4. Clique em **"Submit merge request"**

> ⚠️ **Importante:** Somente código enviado via Merge Request será avaliado. Não deixe para abrir o MR no último minuto — abra cedo, você pode continuar fazendo push depois.
---

## 🎯 O Desafio

Construir um **encurtador de links** com painel de estatísticas.

**Por que esse desafio?** É simples de entender mas rico em decisões reais: autenticação, redirect HTTP com registro de clique, analytics por dia, paginação e consumo de API no front.

---

## 📝 Requisitos Funcionais

### Back-End (porta 3001)

**Autenticação**
- `POST /auth/register` — cadastro (nome, email, senha)
- `POST /auth/login` — retorna JWT
- Rotas de links exigem token no header `Authorization: Bearer {token}`

**Links**
- `POST   /links` — encurtar URL (gera código único de 6 chars, ex: `abc123`)
- `GET    /links` — listar links do usuário autenticado (paginado)
- `GET    /links/:id/stats` — total de cliques + cliques por dia (últimos 7 dias)
- `DELETE /links/:id` — remover link

**Redirect público (sem autenticação)**
- `GET /:codigo` — redirecionar para a URL original (HTTP 302) e registrar o clique

### Front-End (porta 5173 com Vite, ou 3000)

- Tela de login e cadastro
- Dashboard: lista de links com código, URL original e total de cliques
- Formulário para criar novo link (com feedback de sucesso/erro)
- Página ou modal com estatísticas do link (gráfico ou tabela de cliques por dia)
- Responsivo (mobile-first)

---

## 🛠️ Stack Obrigatória

**Back-End:**
```
Node.js 20+ com TypeScript
Framework  : Express, Fastify ou NestJS
ORM        : Prisma (preferencial) ou TypeORM
Banco      : PostgreSQL 16 — sobe via docker-compose
Auth       : JWT
Validação  : Zod, Joi ou class-validator
```

**Front-End:**
```
React 18+ com TypeScript
Bundler    : Vite
HTTP       : Axios ou Fetch API
```

**Diferenciais (não obrigatórios):**
- Cache Redis no redirect (já disponível no docker-compose)
- Rate limiting nos endpoints públicos
- Testes unitários no back-end
- Gráfico de cliques com Recharts ou Chart.js

---

## 🗃️ Modelo de Dados Sugerido

```
User   { id, name, email, password_hash, created_at }
Link   { id, user_id, original_url, short_code, created_at }
Click  { id, link_id, ip_address, user_agent, clicked_at }
```

---

## 📁 Estrutura Esperada

```
tests/
├── backend/
│   ├── src/
│   ├── prisma/         # ou migrations/ se usar TypeORM
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md       # suas instruções de execução
└── frontend/
    ├── src/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── README.md
docker-compose.yml      # já na raiz — sobe PostgreSQL e Redis
```

---

## ▶️ Como Rodar

```bash
# 1. Subir a infraestrutura (PostgreSQL + Redis)
docker-compose up -d

# 2. Configurar e iniciar o back-end (porta 3001)
cd tests/backend
npm install
# Criar tests/backend/.env com:
# DATABASE_URL=postgresql://shortener:shortener123@localhost:5432/shortener
# REDIS_URL=redis://localhost:6379
# JWT_SECRET=dev-secret-local
# PORT=3001
# BASE_URL=http://localhost:3001

npx prisma migrate dev   # ou equivalente do seu ORM
npm run dev

# 3. Configurar e iniciar o front-end (porta 5173 ou 3000)
cd tests/frontend
npm install
# Criar tests/frontend/.env com:
# VITE_API_URL=http://localhost:3001

npm run dev

# 4. Testar o redirect (em outra aba ou curl)
curl -v http://localhost:3001/abc123
# Deve retornar HTTP 302 Location: <url original>
```

---

## ✅ Checklist de Entrega

- [ ] Back-end rodando na porta 3001 com todos os endpoints
- [ ] Redirect `GET /:codigo` retorna HTTP 302 e registra o clique
- [ ] Front-end conectado ao back-end e exibindo os links
- [ ] `docker-compose up -d` sobe PostgreSQL e Redis sem erros
- [ ] README em `tests/backend/` e `tests/frontend/` com instruções
- [ ] Merge Request aberto para `main`
- [ ] Commits organizados (conventional commits)

---

## ⏱️ Prazo

**Máximo:** 48 horas — seu acesso expira em **04/04/2026**

📧 suporte@asadigital.io se precisar de mais tempo (avise antes).

---

## ✅ O Que Valorizamos

- TypeScript bem usado (sem `any` em excesso)
- Separação clara de responsabilidades (controller → service → repository)
- Tratamento de erros adequado (não deixar exceções sem tratamento)
- README honesto — se não terminou algo, escreva o que implementaria

---

<div align="center">

**Boa sorte, Marcos Vinicius Oliveira Rocha! 🚀**

ASA Digital · suporte@asadigital.io · asadigital.io

*2026 | Vaga: Desenvolvedor Full Stack (React + Node.js)*

</div>
