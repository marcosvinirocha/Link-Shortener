# 🔗 ShortLinks Frontend

Frontend da aplicação de encurtador de URLs, desenvolvido como parte do teste técnico da ASA Digital.

## 🎯 Features

### Autenticação
Sistema completo de login e registro com validação de formulários usando **React Hook Form** e **Zod**. Tokens JWT são armazenados no localStorage e utilizados automaticamente em todas as requisições. Redirecionamento automático para o dashboard após login bem-sucedido.

### Dashboard
Interface administrativa com cards de estatísticas mostrando:
- **Total de Links**: Quantidade de links criados pelo usuário
- **Total de Cliques**: Soma de todos os cliques nos links

Os cards possuem ícones representativos e são estilizados com sombras sutis para diferenciação visual.

### Gráfico de Cliques
Visualização de dados usando **Recharts** com gráfico de barras responsivo. Cada barra representa um link缩短, exibindo a quantidade de cliques. Tooltip customizado mostra o shortCode, número de cliques e URL original ao passar o mouse. Estados de loading (skeleton) e vazio (mensagem amigável) são tratados.

### Listagem de Links
Tabela completa com as seguintes funcionalidades:
- Exibição de URL original (truncada), shortCode, data de criação e contagem de cliques
- Botão "Copiar" para copiar o link reduzido para a área de transferência
- Botão "Deletar" com confirmação
- Skeleton loading animado durante o carregamento
- Estado vazio quando não há links cadastrados

### Criar Link
Modal com formulário para encurtar URLs. O formulário valida se a URL é válida antes de enviar. Após criação bem-sucedida, exibe toast de confirmação e atualiza automaticamente a listagem.

### Deletar Link
Modal de confirmação antes de remover um link缩短. O botão de exclusão utiliza a variante "danger" (vermelho) para identificação clara. Durante a requisição, exibe estado de loading no botão.

### Responsividade
Implementação mobile-first com:
- **Drawer Sidebar**: Menu lateral deslizante que aparece ao clicar no botão hamburger
- **Overlay**: Fundo escuro semi-transparente quando o drawer está aberto
- **Fechar**: ESC, clique no overlay, ou navegação fecham o drawer automaticamente
- **Desktop**: Sidebar visível permanentemente em telas médias e maiores

### Notificações
Sistema de toast customizado com três tipos:
- **Sucesso** (verde): Feedback de operações concluídas
- **Erro** (vermelho): Feedback de erros
- **Info** (azul): Mensagens informativas

Toasts desaparecem automaticamente após 3 segundos e aparecem no canto inferior direito da tela.

## 🛠️ Tecnologias

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Bundler e servidor de desenvolvimento
- **Tailwind CSS v4** - Estilização utility-first
- **Recharts** - Biblioteca de visualização de dados
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **Axios** - Cliente HTTP
- **React Router v6** - Roteamento
- **clsx + tailwind-merge** - Utilitários de classes CSS

## 📁 Estrutura de Pastas

```
src/
├── components/
│   ├── ui/                    # Componentes reutilizáveis
│   │   ├── Button.tsx         # Botão com 8 variantes (primary, secondary, outline, ghost, link, dark, danger)
│   │   ├── Card.tsx           # Card composável com Header, Title, Content, Footer
│   │   ├── ConfirmModal.tsx   # Modal de confirmação reutilizável
│   │   ├── Input.tsx          # Input com suporte a label, ícones e mensagens de erro
│   │   ├── Modal.tsx          # Modal base acessível (ESC, overlay, foco)
│   │   ├── Pagination.tsx     # Componente de paginação
│   │   ├── StatsCard.tsx      # Card de estatísticas com ícone
│   │   └── Toast/             # Sistema de notificações
│   │       ├── Toast.tsx      # ToastProvider + useToast hook
│   │       └── index.ts
│   └── layout/
│       ├── DashboardLayout.tsx # Layout principal do dashboard
│       ├── Navbar.tsx         # Barra de navegação superior
│       ├── Sidebar.tsx        # Menu lateral (drawer em mobile)
│       └── index.ts
├── features/
│   ├── auth/                  # Módulo de autenticação
│   │   ├── components/
│   │   │   ├── LoginForm.tsx   # Formulário de login
│   │   │   └── RegisterForm.tsx # Formulário de cadastro
│   │   ├── context/
│   │   │   ├── AuthContext.tsx # Context API para autenticação
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── useAuth.ts      # Hook para acessar contexto de auth
│   │   ├── schemas/
│   │   │   └── auth.schema.ts  # Schemas Zod para validação
│   │   ├── services/
│   │   │   └── auth.service.ts # Chamadas à API de autenticação
│   │   └── index.ts
│   └── links/                  # Módulo de gerenciamento de links
│       ├── components/
│       │   ├── LinkList.tsx     # Tabela de listagem
│       │   ├── CreateLinkForm.tsx # Formulário de criação
│       │   └── ClicksChart.tsx   # Gráfico de cliques
│       ├── schemas/
│       │   └── link.schema.ts  # Schema Zod para URL
│       ├── services/
│       │   └── links.service.ts # Chamadas à API de links
│       └── index.ts
├── pages/
│   ├── DashboardPage.tsx       # Página do dashboard (stats + gráfico)
│   ├── LinksPage.tsx           # Página de listagem de links
│   └── auth/
│       ├── LoginPage.tsx       # Página de login
│       └── RegisterPage.tsx     # Página de cadastro
├── types/
│   └── links.ts               # Tipos TypeScript (Link, Pagination, LinksResponse)
├── lib/
│   ├── api.ts                 # Instância Axios com interceptors
│   └── utils.ts               # Função cn() para classes CSS
├── styles/
│   └── globals.css            # Estilos globais e animações
├── App.tsx                    # Componente principal com rotas
└── main.tsx                   # Ponto de entrada
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Backend rodando em `http://localhost:3001`

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Entrar no diretório do frontend
cd tests/frontend

# Instalar dependências
npm install
```

### Execução

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# O projeto estará disponível em http://localhost:5173
```

### Build

```bash
# Criar build de produção
npm run build

# Visualizar build de produção
npm run preview
```

### Verificação de Tipos

```bash
# Verificar tipos TypeScript
npm run build

# O build já inclui verificação de tipos
```

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` no diretório `tests/frontend/`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `VITE_API_BASE_URL` | URL base da API backend | `http://localhost:3001/api` |

## 📡 API Endpoints

O frontend se comunica com a API REST do backend usando os seguintes endpoints:

| Método | Endpoint | Descrição | Body/Query |
|--------|----------|-----------|------------|
| POST | `/auth/login` | Autenticação de usuário | `{ email, password }` |
| POST | `/auth/register` | Cadastro de novo usuário | `{ name, email, password }` |
| GET | `/links` | Listar links do usuário | Query: `page`, `limit` |
| POST | `/links` | Criar novo link encurtado | `{ url }` |
| DELETE | `/links/{id}` | Remover link | - |

### Resposta da API

**Listar Links:**
```json
{
  "data": [
    {
      "id": "uuid",
      "shortCode": "abc123",
      "originalUrl": "https://exemplo.com",
      "shortUrl": "http://localhost:3001/abc123",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "clickCount": 42
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

## 🎨 Design System

### Cores
- **Primary**: `#6366f1` (Indigo 500)
- **Dark**: `#111827` (Gray 900)
- **Danger**: `#dc2626` (Red 600)
- **Success**: `#16a34a` (Green 600)

### Tipografia
- Fonte padrão: Sistema (sans-serif)
- Títulos: 2xl, semibold
- Texto: base, regular
- Labels: sm, medium

### Espaçamento
- Padding padrão: 4 (1rem)
- Gap entre elementos: 6 (1.5rem)
- Margens de seção: space-y-6

## 📱 Responsividade

| Breakpoint | Comportamento |
|------------|---------------|
| `< md` (768px) | Sidebar como drawer, hamburger visível |
| `md+` | Sidebar visível, hamburger oculto |

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Iniciar servidor de desenvolvimento |
| `npm run build` | Build de produção com verificação de tipos |
| `npm run preview` | Visualizar build de produção |

## 👨‍💻 Autor

Desenvolvido por **Marcos Vinicius Oliveira Rocha**
