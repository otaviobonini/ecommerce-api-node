# Ecommerce API

API RESTful de e-commerce com autenticação JWT, carrinho de compras, checkout via Stripe e cache com Redis.

## Sobre o projeto

API construída com foco em boas práticas de arquitetura backend, incluindo:

- Arquitetura modular por domínio (Controller → Service → Repository)
- Inversão de dependência com interfaces e injeção via Factory Pattern
- Validação de entrada com Zod
- Autenticação e autorização com JWT (roles: USER e ADMIN)
- Checkout e webhooks com Stripe
- Cache de produtos com Redis
- Transações de banco de dados com rollback automático em caso de falha no pagamento
- Testes unitários com Jest e mocks por interface
- Documentação interativa com Swagger

## Tecnologias

- **Runtime:** Node.js 22
- **Framework:** Express 5
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL
- **Cache:** Redis
- **Pagamentos:** Stripe
- **Validação:** Zod
- **Testes:** Jest
- **Documentação:** Swagger UI

## Pré-requisitos

- Node.js 22+
- Docker e Docker Compose
- Conta no Stripe (para obter as chaves de API)

## Configuração do ambiente

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd ecommerce-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o `.env` com os seus valores:

```env
PORT=3000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:6000/ecommerce"
REDIS_URL=redis://localhost:6379

JWT_SECRET=sua_chave_secreta_aqui

# URL do seu frontend (para configuração de CORS)
CLIENT_URL=http://localhost:5173

# URL base da API (usada nos links de sucesso/cancelamento do Stripe)
APP_URL=http://localhost:3000

# Chaves do Stripe (https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Suba o banco de dados e o Redis

```bash
docker compose up -d
```

Isso inicia o PostgreSQL na porta `6000` e o Redis na porta `6379`.

### 5. Execute as migrations

```bash
npx prisma migrate deploy
```

### 6. Inicie o servidor

```bash
npm run dev
```

Servidor disponível em `http://localhost:3000`.

A documentação interativa estará disponível em `http://localhost:3000/docs`.

## Scripts

| Comando         | Descrição                                        |
| --------------- | ------------------------------------------------ |
| `npm run dev`   | Inicia em modo de desenvolvimento com hot reload |
| `npm run build` | Compila o TypeScript para `dist/`                |
| `npm start`     | Inicia o servidor compilado (produção)           |
| `npm test`      | Roda os testes unitários                         |

## Testes

```bash
npm test
```

Os testes são unitários, com mocks por interface — nenhuma dependência externa (banco ou Redis) é necessária para rodá-los.

## Autenticação

A API usa JWT via header `Authorization`:

```
Authorization: Bearer <token>
```

O token é retornado no login e tem validade de 7 dias. Rotas marcadas com 🔒 exigem autenticação. Rotas marcadas com 👑 exigem role `ADMIN`.

## Endpoints

### Auth

| Método | Rota        | Descrição                   |
| ------ | ----------- | --------------------------- |
| `POST` | `/register` | Cadastro de usuário         |
| `POST` | `/login`    | Login — retorna o token JWT |

### Produtos

| Método   | Rota                  | Descrição                                    |
| -------- | --------------------- | -------------------------------------------- |
| `GET`    | `/product`            | Listar produtos (com paginação, cache Redis) |
| `POST`   | `/product`            | 🔒 👑 Criar produto                          |
| `PATCH`  | `/product/:productId` | 🔒 👑 Editar produto                         |
| `DELETE` | `/product/:productId` | 🔒 👑 Remover produto                        |

### Carrinho

| Método   | Rota                       | Descrição                            |
| -------- | -------------------------- | ------------------------------------ |
| `GET`    | `/carts`                   | 🔒 Obter carrinho do usuário         |
| `POST`   | `/carts`                   | 🔒 Criar carrinho                    |
| `DELETE` | `/carts/:cartId`           | 🔒 Limpar todos os itens do carrinho |
| `GET`    | `/carts/:cartId/items`     | 🔒 Listar itens do carrinho          |
| `POST`   | `/carts/items`             | 🔒 Adicionar item ao carrinho        |
| `PATCH`  | `/carts/items/:cartItemId` | 🔒 Atualizar quantidade de um item   |
| `DELETE` | `/carts/items/:cartItemId` | 🔒 Remover item do carrinho          |

### Pedidos

| Método | Rota               | Descrição                                           |
| ------ | ------------------ | --------------------------------------------------- |
| `POST` | `/orders`          | 🔒 Criar pedido e gerar link de pagamento Stripe    |
| `GET`  | `/orders/me`       | 🔒 Listar pedidos do usuário (filtrável por status) |
| `GET`  | `/orders/:orderId` | 🔒 Detalhe de um pedido                             |
| `GET`  | `/orders`          | 🔒 👑 Listar todos os pedidos                       |
| `POST` | `/orders/webhook`  | Webhook do Stripe (sem autenticação, raw body)      |

### Endereços

| Método   | Rota                          | Descrição                      |
| -------- | ----------------------------- | ------------------------------ |
| `POST`   | `/address`                    | 🔒 Criar endereço              |
| `GET`    | `/address`                    | 🔒 Listar endereços do usuário |
| `PUT`    | `/address/:addressId`         | 🔒 Editar endereço             |
| `PUT`    | `/address/:addressId/default` | 🔒 Definir endereço padrão     |
| `DELETE` | `/address/:addressId`         | 🔒 Remover endereço            |

## Exemplos de uso

### Criar conta

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "joao", "email": "joao@email.com", "password": "123456"}'
```

### Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "password": "123456"}'
```

### Listar produtos

```bash
curl "http://localhost:3000/product?limit=10&offset=0"
```

### Criar um pedido

```bash
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"addressId": 1}'
```

A resposta inclui um `paymentLink` gerado pelo Stripe para completar o pagamento.

## Fluxo de pagamento

1. Usuário adiciona produtos ao carrinho
2. `POST /orders` cria o pedido, decrementa o estoque (transação atômica) e gera um link de checkout no Stripe
3. Usuário completa o pagamento no link retornado
4. Stripe envia evento para `POST /orders/webhook`
5. Webhook atualiza o status do pedido para `PAID` (ou `CANCELLED` em caso de falha, restaurando o estoque)

### Status de pedido

| Status      | Descrição                           |
| ----------- | ----------------------------------- |
| `PENDING`   | Pedido criado, aguardando pagamento |
| `PAID`      | Pagamento confirmado                |
| `ONGOING`   | Em separação/envio                  |
| `DELIVERED` | Entregue                            |
| `CANCELLED` | Cancelado                           |

## Configuração do Webhook Stripe (desenvolvimento)

Para testar o webhook localmente, use o [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to http://localhost:3000/orders/webhook
```

O CLI exibirá o `STRIPE_WEBHOOK_SECRET` para usar no `.env`.

## Docker (produção)

O projeto inclui um `Dockerfile` para build de produção:

```bash
# Build
npm run build

# Imagem
docker build -t ecommerce-api .
docker run -p 3000:3000 --env-file .env ecommerce-api
```

## Arquitetura

```
src/
├── app/               # Inicialização do Express e servidor
├── common/            # Classes compartilhadas (AppError)
├── config/            # Configuração do Swagger
├── database/          # Clientes Prisma e Redis, helper de cache
├── docs/              # Documentação Swagger por módulo
├── middlewares/       # Auth, admin, validação, error handler
├── modules/           # Domínios da aplicação
│   ├── auth/          # Controller, Service, Factory, Routes, Tests
│   ├── products/
│   ├── cart/
│   ├── address/
│   └── order/
├── providers/         # Integrações externas (Stripe)
├── repositories/      # Implementações dos repositórios (Prisma)
├── schemas/           # Schemas Zod (validação + tipos)
├── types/             # Interfaces de repositório e tipos globais
└── utils/             # Rate limiters
```

Cada módulo em `modules/` é autossuficiente: contém seu controller, service, factory, rotas e testes. Os repositórios em `repositories/` implementam interfaces definidas em `types/`, permitindo mocks limpos nos testes sem dependência do banco de dados.
