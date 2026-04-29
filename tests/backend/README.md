# Link Shortener Backend

Backend service for the link shortener application (bit.ly style).

## Technologies

- Node.js 20+ with TypeScript
- Express 5.x
- Prisma 7.x (PostgreSQL)
- JWT Authentication
- Zod Validation
- Redis (caching)
- Jest (testing)
- ESLint

## Prerequisites

- Node.js 20+
- PostgreSQL 16 (via docker-compose)
- Redis (optional, via docker-compose)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

## Running

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Testing

```bash
npm test              # Run all tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description       | Auth |
| ------ | -------------------- | ----------------- | ---- |
| POST   | `/api/auth/register` | Register new user | ❌   |
| POST   | `/api/auth/login`    | Login             | ❌   |
| GET    | `/api/auth/profile`  | Get user profile  | ✅   |

### Links (protected)

| Method | Endpoint                      | Description                  | Auth |
| ------ | ----------------------------- | ---------------------------- | ---- |
| POST   | `/api/links`                  | Create short link            | ✅   |
| GET    | `/api/links?page=1&limit=10`  | List user links (paginated)  | ✅   |
| GET    | `/api/links/:shortCode/stats` | Get link statistics          | ✅   |
| DELETE | `/api/links/:id`              | Delete link (by internal ID) | ✅   |

### Public

| Method | Endpoint      | Description                         | Auth |
| ------ | ------------- | ----------------------------------- | ---- |
| GET    | `/:shortCode` | Redirect to original URL (HTTP 302) | ❌   |
| GET    | `/api/health` | Health check                        | ❌   |

## Environment Variables

| Variable       | Description                  | Default                  |
| -------------- | ---------------------------- | ------------------------ |
| `DATABASE_URL` | PostgreSQL connection string | Required                 |
| `REDIS_URL`    | Redis connection string      | `redis://localhost:6379` |
| `JWT_SECRET`   | JWT secret key               | Required (min 10 chars)  |
| `PORT`         | Server port                  | `3001`                   |
| `BASE_URL`     | Base URL for the service     | `http://localhost:3001`  |
| `FRONTEND_URL` | Frontend URL for CORS        | `http://localhost:5173`  |
| `NODE_ENV`     | Environment                  | `development`            |

## Project Structure

```
src/
├── config/           # Configuration (database, redis, env)
├── dto/              # Zod validation schemas
│   ├── user/         # User DTOs (create, login)
│   └── link/         # Link DTOs (create, pagination)
├── errors/           # Custom error classes
├── middlewares/      # Express middlewares
│   ├── auth.ts       # JWT authentication
│   ├── rateLimit.ts  # Rate limiting
│   └── validate.ts   # Zod validation
├── repositories/     # Data access layer
│   ├── user.repository.ts
│   └── link.repository.ts
├── routes/          # Route definitions
│   ├── auth.ts       # Auth routes
│   ├── links.ts      # Links routes
│   ├── redirect.ts   # Public redirect route
│   └── index.ts      # Route aggregator
├── services/        # Business logic
│   ├── user.service.ts
│   ├── link.service.ts
│   └── redirect.service.ts
├── types/           # TypeScript types
│   ├── user.types.ts
│   └── link.types.ts
├── app.ts           # Express app setup
└── server.ts       # Entry point
```

## Architecture

### Layered Architecture

```
Controller (routes/) → Service (business logic) → Repository (data access)
```

### Features

- **Authentication**: JWT-based with bcrypt password hashing
- **Link Shortening**: Random 6-char codes (base62)
- **Caching**: Redis cache for redirects (1 hour TTL)
- **Click Tracking**: Records IP and User-Agent for each click
- **Rate Limiting**: Separate limits for auth and redirects

## API Testing

Use the REST Client extension in VS Code to test the API:

1. Install **"REST Client"** extension in VS Code
2. Open `Api/api_test.http`
3. Click **"Send Request"** on any endpoint
4. See `Api/api_test.http.md` for complete documentation

### Manual Testing

```bash
# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}'

# Create link
curl -X POST http://localhost:3001/api/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"url":"https://github.com"}'

# Redirect (public)
curl -I http://localhost:3001/abc123
```

## Development Notes

- All endpoints are fully implemented with proper error handling
- Use Jest for unit testing with mocked dependencies
- Redis is optional - app works without it (graceful degradation)
- Click registration failures do not block redirects
