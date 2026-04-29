# API Test HTTP - Guia de Uso

## Visão Geral

Este arquivo contém todos os endpoints HTTP para testar a API do Link Shortener. Permite testar facilmente as rotas sem precisar usar ferramentas externas como Postman ou cURL.

## Instalação da Extensão REST Client

Para usar este arquivo no VS Code, é necessário instalar a extensão **REST Client**.

### VS Code

1. Abra o VS Code
2. Vá em Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Pesquise por "REST Client"
4. Instale a extensão criada por **Huachao Mao**

### Derivativos do VS Code

| Editor   | Suporte                          |
| -------- | -------------------------------- |
| VS Code  | ✅ Native (extensão REST Client) |
| VSCodium | ✅ Native (mesma extensão)       |
| Cursor   | ✅ Native (extensão REST Client) |
| Windsurf | ⚠️ Suporte limitado              |
| Other    | ⚠️ Verificar suporte             |

### Alternativas (se não usar VS Code)

| Ferramenta           | Link                                                                        |
| -------------------- | --------------------------------------------------------------------------- |
| Postman              | https://www.postman.com/                                                    |
| Insomnia             | https://insomnia.rest/                                                      |
| HTTPie               | https://httpie.io/                                                          |
| IntelliJ HTTP Client | https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html |

## Como Usar

### No VS Code

1. Abra o arquivo `api_test.http`
2. Localize o endpoint desejado
3. Clique no botão **"Send Request"** acima de cada endpoint (ou use `Ctrl+Alt+R` / `Cmd+Alt+R`)

### Variáveis Definidas

| Variável          | Descrição                  | Valor Padrão               |
| ----------------- | -------------------------- | -------------------------- |
| `{{BASE_URL}}`    | URL base do servidor       | `http://localhost:3001`    |
| `YOUR_TOKEN_HERE` | Placeholder para token JWT | Substituir pelo token real |

### Como Obter o Token JWT

1. Faça login ou registro via endpoint `/api/auth/login` ou `/api/auth/register`
2. Copie o campo `token` da resposta JSON
3. Substitua `YOUR_TOKEN_HERE` pelo token real

## Endpoints Disponíveis

### Seção 1: Health Check

| Método | Endpoint      | Descrição                          | Auth |
| ------ | ------------- | ---------------------------------- | ---- |
| GET    | `/api/health` | Verificar se servidor está rodando | ❌   |

### Seção 2: Autenticação

| Método | Endpoint             | Descrição              | Auth |
| ------ | -------------------- | ---------------------- | ---- |
| POST   | `/api/auth/register` | Cadastrar novo usuário | ❌   |
| POST   | `/api/auth/login`    | Login do usuário       | ❌   |
| GET    | `/api/auth/profile`  | Perfil do usuário      | ✅   |

### Seção 3: Links (Protegidos)

| Método | Endpoint                      | Descrição               | Auth |
| ------ | ----------------------------- | ----------------------- | ---- |
| POST   | `/api/links`                  | Criar link encurtado    | ✅   |
| GET    | `/api/links`                  | Listar links (paginado) | ✅   |
| GET    | `/api/links/:shortCode/stats` | Estatísticas do link    | ✅   |
| DELETE | `/api/links/:id`              | Deletar link            | ✅   |

### Seção 4: Redirect (Público)

| Método | Endpoint      | Descrição                      | Auth |
| ------ | ------------- | ------------------------------ | ---- |
| GET    | `/:shortCode` | Redirecionar para URL original | ❌   |

## Exemplos de Uso

### 1. Cadastrar e Obter Token

```http
POST {{BASE_URL}}/api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

Resposta:

```json
{
  "user": {
    "id": "...",
    "name": "João Silva",
    "email": "joao@exemplo.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Criar Link

```http
POST {{BASE_URL}}/api/links
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "url": "https://github.com"
}
```

### 3. Testar Redirect

```http
GET {{BASE_URL}}/abc123
```

> Este endpoint redireciona para a URL original e registra o clique.

## Notas Importantes

- ⚠️ Substitua `YOUR_TOKEN_HERE` pelo token real antes de testar rotas protegidas
- ⚠️ Substitua `SHORT_CODE` pelo código real do link
- ⚠️ O servidor deve estar rodando em `http://localhost:3001`
- ✅ Linhas com `###` são separadores de seções
- ✅ Clique em "Send Request" para executar cada endpoint

## Troubleshooting

### Erro "No such file or directory"

Certifique-se de que o servidor está rodando na porta correta.

### Erro 401 Unauthorized

- Token expirado - Faça login novamente
- Token não informado - Adicione header `Authorization: Bearer TOKEN`

### Erro de CORS

O backend está configurado para permitir requests de `http://localhost:5173`. Se usar outra porta, ajuste a variável `FRONTEND_URL` no arquivo `.env`.
