<div align="center">

# 🔗 Link Shortener

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)

**Aplicação full stack de encurtamento de URLs com painel de estatísticas**

Desenvolvido por **Marcos Vinicius Oliveira Rocha**

</div>

---

## 📖 Visão Geral

Link Shortener é uma aplicação web inspirada em serviços como bit.ly, que permite criar links curtos personalizados e acompanhar estatísticas de acesso em tempo real.

**O problema:** URLs longas são difíceis de compartilhar, lembrar e analisar métricas de clique. Esta aplicação resolve isso gerando códigos únicos de 6 caracteres e registrando cada acesso com dados de IP e user agent.

**A solução:** Backend robusto com autenticação JWT e frontend responsivo com dashboard interativo para gestão e análise de links.

---

## ✨ Funcionalidades

### Frontend
- Autenticação com login e cadastro
- Dashboard com lista de links criados
- Formulário para criação de novos links
- Visualização de estatísticas com gráfico de cliques por dia
- Interface responsiva (mobile-first)
- Feedback visual de sucesso/erro nas operações

### Backend
- Cadastro e autenticação de usuários com JWT
- Encurtamento de URLs com geração de código único
- Redirecionamento HTTP 302 com registro de clique
- Estatísticas de acesso por link (últimos 7 dias)
- Listagem paginada de links por usuário
- Remoção de links

---

## 🛠️ Stack Tecnológica

**Backend:**
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Node.js | 20+ | Runtime |
| TypeScript | 5+ | Tipagem |
| Express | 5 | Framework HTTP |
| Prisma | 7 | ORM |
| PostgreSQL | 16 | Banco de dados |
| Redis | 7 | Cache |
| Zod | 4 | Validação de dados |
| JWT | 9 | Autenticação |

**Frontend:**
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| React | 19 | Biblioteca UI |
| TypeScript | 5 | Tipagem |
| Vite | 8 | Bundler |
| TailwindCSS | 4 | Estilização |
| React Router | 7 | Roteamento |
| React Hook Form | 7 | Gerenciamento de formulários |
| Zod | 4 | Validação de formulários |
| Recharts | 3 | Gráficos |
| Axios | 1 | Cliente HTTP |

**Infraestrutura:**
- Docker Compose para PostgreSQL e Redis
- Rate limiting com express-rate-limit
- Helmet para segurança HTTP
- ESLint + Prettier para linting e formatação

---

## 🏗️ Arquitetura

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│   Frontend  │ ──►   │   Backend    │ ──►   │  PostgreSQL  │
│  React 19   │  HTTP │  Express 5   │       │    v16       │
│  Vite + TS  │ ◄──   │  JWT + Zod   │       │   Prisma     │
└─────────────┘       └──────────────┘       └──────────────┘
                             │
                             ▼
                       ┌──────────────┐
                       │    Redis     │
                       │    v7        │
                       └──────────────┘
```

**Camadas do Backend:**
```
Controller → Service → Repository → Database
```

**Modelo de Dados:**
```
User   { id, name, email, password_hash, created_at }
Link   { id, user_id, original_url, short_code, created_at }
Click  { id, link_id, ip_address, user_agent, clicked_at }
```

---

## 📡 API Endpoints

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/register` | Cadastro de usuário | ❌ |
| POST | `/auth/login` | Login e geração de JWT | ❌ |
| POST | `/links` | Encurtar URL | ✅ |
| GET | `/links` | Listar links (paginado) | ✅ |
| GET | `/links/:id/stats` | Estatísticas do link | ✅ |
| DELETE | `/links/:id` | Remover link | ✅ |
| GET | `/:codigo` | Redirecionar para URL original | ❌ |

---

## 📸 Screenshots

> *(Em breve: screenshots do dashboard, formulário de criação e gráficos)*

---

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 20+
- Docker + Docker Compose
- npm ou pnpm

### Passo a passo

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd marcos-vinicius-oliveira-rocha

# 2. Subir banco de dados e Redis
docker-compose up -d

# 3. Instalar dependências do backend
cd tests/backend
npm install
npx prisma migrate dev
npm run dev   # Porta 3001

# 4. Instalar dependências do frontend (outro terminal)
cd tests/frontend
npm install
npm run dev   # Porta 5173
```

### Variáveis de Ambiente

**Backend** (`tests/backend/.env`):
```env
DATABASE_URL=postgresql://shortener:shortener123@localhost:5432/shortener
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-local
PORT=3001
BASE_URL=http://localhost:3001
```

**Frontend** (`tests/frontend/.env`):
```env
VITE_API_URL=http://localhost:3001
```

---

## ⭐ Diferenciais

- **Rate limiting** nos endpoints públicos para proteção contra abuso
- **Cache com Redis** para otimização de redirecionamentos
- **Segurança HTTP** com Helmet
- **Validação robusta** com Zod em todos os níveis
- **Código tipado** com TypeScript em toda a aplicação
- **Separação de responsabilidades** (Controller → Service → Repository)
- **Gráficos interativos** com Recharts para visualização de estatísticas

---

<div align="center">

**Marcos Vinicius Oliveira Rocha**

Desenvolvedor Full Stack · React + Node.js + TypeScript

</div>
