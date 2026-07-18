# Ecommerce API

API RESTful de e-commerce com autenticação JWT, carrinho de compras, checkout via Stripe e cache com Redis.

## Sobre o projeto

API construída com foco em boas práticas de arquitetura backend, incluindo:

- Arquitetura modular por domínio (Controller → Service → Repository)
- Inversão de dependência com interfaces e injeção via Factory Pattern
- Validação de entrada com Zod
- Autenticação com JWT de curta duração + refresh token rotativo em cookie httpOnly (roles: USER e ADMIN)
- Checkout e webhooks com Stripe (verificação de assinatura, preços calculados no servidor)
- Cache de produtos com Redis
- Rate limiting distribuído com Redis (funciona com múltiplas instâncias da API)
- Upload de imagens para S3 com entrega via CloudFront
- Transações de banco de dados com rollback automático em caso de falha no pagamento
- Índices em chaves estrangeiras e `onDelete: Restrict` protegendo o histórico de pedidos
- Health check (`/health`) verificando Postgres e Redis
- Docker multi-stage (build dentro do container, usuário não-root, HEALTHCHECK)
- CI no GitHub Actions: build, testes e build da imagem Docker
- Testes unitários com Jest e mocks por interface
- Documentação interativa com Swagger
- Detalhe! o projeto não precisa de async error handling nos controllers já que o Express 5 resolve

## Tecnologias

- **Runtime:** Node.js 22
- **Framework:** Express 5
- **Linguagem:** TypeScript
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL
- **Cache e rate limiting:** Redis
- **Pagamentos:** Stripe
- **Armazenamento de imagens:** AWS S3 + CloudFront
- **Validação:** Zod
- **Testes:** Jest
- **Documentação:** Swagger UI
- **Infra:** Docker (multi-stage) + GitHub Actions

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
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:6000/ecommerce"
REDIS_URL=redis://localhost:6379

JWT_SECRET=sua_chave_secreta_aqui

# URL do seu frontend (para configuração de CORS)
CLIENT_URL=http://localhost:3000

# URL base da API (usada nos links de sucesso/cancelamento do Stripe)
APP_URL=http://localhost:5000

# Chaves do Stripe (https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# S3 + CloudFront (upload e entrega de imagens de produto)
BUCKET_NAME=seu-bucket
BUCKET_REGION=sa-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
CDN_URL=https://seu-dominio.cloudfront.net

# Opcional (produção): domínio pai compartilhado entre frontend e backend
# (ex: .seusite.com) para o cookie refreshToken ser visível entre subdomínios
# COOKIE_DOMAIN=.seusite.com
```

### 4. Suba as dependências (modo desenvolvimento)

```bash
docker compose up -d postgres redis
```

Isso inicia o PostgreSQL na porta `6000` e o Redis na porta `6379`. O serviço `app` do compose fica de fora — em desenvolvimento a API roda local com hot reload (passo 6).

### 5. Execute as migrations

```bash
npx prisma migrate deploy
```

### 6. Inicie o servidor

```bash
npm run dev
```

Servidor disponível em `http://localhost:5000`.

A documentação interativa estará disponível em `http://localhost:5000/docs`.

### Alternativa: stack completa via Docker

Para subir tudo containerizado (API + Postgres + Redis) com um comando:

```bash
docker compose up --build -d
npx prisma migrate deploy   # primeira vez, para criar as tabelas
```

A imagem da API é construída pelo `Dockerfile` multi-stage — o build do TypeScript acontece dentro do container, sem depender do ambiente da sua máquina.

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

A API usa dois tokens com papéis diferentes:

- **Access token (JWT, 15 min)** — retornado no corpo do login e enviado em cada requisição via header:

  ```
  Authorization: Bearer <token>
  ```

- **Refresh token (7 dias)** — nunca aparece no corpo da resposta: é gravado num cookie `httpOnly` (`refreshToken`) que o navegador envia automaticamente. No banco só é armazenado o hash (SHA-256) dele, e a cada uso em `/refresh-token` ele é **rotacionado** (o antigo é invalidado e um novo cookie é emitido).

O frontend renova o access token chamando `POST /refresh-token` com `credentials: "include"` — sem tocar no refresh token via JavaScript, o que protege contra roubo por XSS.

Rotas marcadas com 🔒 exigem autenticação. Rotas marcadas com 👑 exigem role `ADMIN`.

## Rate limiting

Os limites são armazenados no Redis, então valem para o conjunto de instâncias da API (não por processo):

| Grupo                  | Limite  | Janela |
| ---------------------- | ------- | ------ |
| `/register` e `/login` | 8 req   | 15 min |
| `/refresh-token`       | 60 req  | 15 min |
| Produtos e endereços   | 70 req  | 10 min |
| Carrinho               | 70 req  | 5 min  |
| Pedidos                | 20 req  | 5 min  |

## Endpoints

### Auth

| Método | Rota             | Descrição                                                     |
| ------ | ---------------- | ------------------------------------------------------------- |
| `POST` | `/register`      | Cadastro de usuário                                            |
| `POST` | `/login`         | Login — retorna o access token e seta o cookie de refresh      |
| `POST` | `/refresh-token` | Renova o access token usando o cookie httpOnly (com rotação)   |
| `POST` | `/logout`        | Invalida o refresh token da sessão e limpa o cookie            |
| `POST` | `/logout-all`    | 🔒 Invalida todos os refresh tokens do usuário (todos os dispositivos) |

### Conta

| Método | Rota  | Descrição                                              |
| ------ | ----- | ------------------------------------------------------ |
| `GET`  | `/me` | 🔒 Perfil do usuário logado com endereços e pedidos    |

### Health

| Método | Rota      | Descrição                                        |
| ------ | --------- | ------------------------------------------------ |
| `GET`  | `/health` | Liveness probe — verifica Postgres e Redis       |

### Produtos

| Método   | Rota                                           | Descrição                                    |
| -------- | ---------------------------------------------- | -------------------------------------------- |
| `GET`    | `/products`                                    | Listar produtos (com paginação, cache Redis) |
| `GET`    | `/product/:productId`                          | Detalhe de um produto                        |
| `POST`   | `/product`                                     | 🔒 👑 Criar produto                          |
| `PATCH`  | `/product/:productId`                          | 🔒 👑 Editar produto                         |
| `DELETE` | `/product/:productId`                          | 🔒 👑 Remover produto                        |
| `POST`   | `/product/:productId/images`                   | 🔒 👑 Upload de imagem (S3, máx. 5MB)        |
| `DELETE` | `/product/:productId/images/:imageId`          | 🔒 👑 Remover imagem                         |
| `PATCH`  | `/product/:productId/images/:imageId/primary`  | 🔒 👑 Definir imagem principal               |

### Categorias

| Método   | Rota                               | Descrição                                |
| -------- | ---------------------------------- | ---------------------------------------- |
| `GET`    | `/categories`                      | Listar categorias                        |
| `GET`    | `/categories/:categoryId/products` | Produtos de uma categoria                |
| `GET`    | `/categories/featured/products`    | Produtos em destaque                     |
| `POST`   | `/categories`                      | 🔒 👑 Criar categoria                    |
| `PUT`    | `/categories/:categoryId`          | 🔒 👑 Editar categoria                   |
| `DELETE` | `/categories/:categoryId`          | 🔒 👑 Remover categoria                  |
| `POST`   | `/categories/:categoryId/image`    | 🔒 👑 Upload da imagem da categoria      |

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
| `POST` | `/orders`                  | 🔒 Criar pedido e gerar link de pagamento Stripe    |
| `GET`  | `/orders/me`               | 🔒 Listar pedidos do usuário (filtrável por status) |
| `GET`  | `/orders/:orderId`         | 🔒 Detalhe de um pedido                             |
| `GET`  | `/orders`                  | 🔒 👑 Listar todos os pedidos                       |
| `PUT`  | `/orders/:orderId/status`  | 🔒 👑 Atualizar o status de um pedido               |
| `POST` | `/orders/webhook`          | Webhook do Stripe (sem autenticação, raw body)      |

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
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "joao", "email": "joao@email.com", "password": "123456"}'
```

### Login

```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "password": "123456"}'
```

### Listar produtos

```bash
curl "http://localhost:5000/products?limit=10&offset=0"
```

### Criar um pedido

```bash
curl -X POST http://localhost:5000/orders \
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
stripe listen --forward-to http://localhost:5000/orders/webhook
```

O CLI exibirá o `STRIPE_WEBHOOK_SECRET` para usar no `.env`.

## Docker (produção)

O `Dockerfile` é **multi-stage**: o primeiro estágio instala todas as dependências e compila o TypeScript; o segundo instala apenas dependências de produção e recebe só o `dist/` — não é preciso buildar nada antes na sua máquina:

```bash
docker build -t ecommerce-api .
docker run -p 5000:5000 --env-file .env ecommerce-api
```

A imagem roda com usuário não-root (`node`) e tem `HEALTHCHECK` apontando para `/health` (espera `PORT=5000`). O CI (GitHub Actions) valida o build da imagem a cada push.

## Arquitetura

```
src/
├── app/               # Inicialização do Express e servidor
├── common/            # Classes compartilhadas (AppError)
├── config/            # Configuração do Swagger
├── database/          # Clientes Prisma e Redis, helper de cache
├── docs/              # Documentação Swagger por módulo
├── interfaces/        # Interfaces dos repositórios e gateways (I*Repository, IPaymentGateway...)
├── middlewares/       # Auth, admin, validação, upload, error handlers
├── modules/           # Domínios da aplicação
│   ├── auth/          # Controller, Service, Factory, Routes, Tests
│   ├── products/
│   ├── categories/
│   ├── cart/
│   ├── address/
│   ├── order/
│   ├── me/            # Perfil agregado do usuário logado
│   └── health/        # Liveness probe (Postgres + Redis)
├── providers/         # Integrações externas (Stripe, S3)
├── repositories/      # Implementações dos repositórios (Prisma)
├── schemas/           # Schemas Zod (validação + tipos + env)
├── types/             # DTOs e tipos globais
└── utils/             # Rate limiters (Redis)
```

Cada módulo em `modules/` é autossuficiente: contém seu controller, service, factory, rotas e testes. Os repositórios em `repositories/` implementam interfaces definidas em `interfaces/`, permitindo mocks limpos nos testes sem dependência do banco de dados.
