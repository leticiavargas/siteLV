# leticiavarg.as

Hub de conteúdo para a comunidade dev — artigos, eventos, materiais e projetos de Letícia Vargas. O foco é contribuir com a comunidade, reunindo conteúdo de forma clara e acessível.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 |
| Linguagem | JavaScript (JSX) |
| Estilização | CSS puro com custom properties |
| Backend | Firebase Cloud Functions (Node 22, ESM) + Express |
| Banco de dados | Firestore (via `firebase-admin` nas Functions) |
| Storage | Firebase Storage |
| Autenticação | Auth.js v5 (`next-auth@beta`) com Google Provider |
| Deploy | Firebase App Hosting (frontend) + Cloud Functions (API) |
| Package manager | pnpm |
| Editor WYSIWYG | Tiptap (MIT) |

## Estrutura

```
functions/          # API REST (Express + Firebase Admin)
├── index.js        # App Express, registra rotas
└── src/
    ├── admin.js    # Inicializa Firebase Admin
    └── routes/     # articles, faq, projects, areas, materials, events, upload

src/app/
├── components/     # Componentes públicos (barrel export em index.jsx)
├── admin/          # Área administrativa (layout próprio, protegida por Auth.js)
├── api/            # Route handlers Next.js (contato via Resend)
├── artigos/        # Listagem e detalhe de artigos
├── eventos/        # Agenda de eventos
├── faq/            # Perguntas frequentes
├── materiais/      # Biblioteca de materiais por área
├── projetos/       # Projetos pessoais
├── sobre/          # Sobre + formulário de contato
└── lib/api.js      # Camada de fetch para as Cloud Functions
```

## Rodando localmente

**Pré-requisitos:** Node 22, pnpm, Firebase CLI

```bash
# instalar dependências
pnpm install

# terminal 1 — emulador das Cloud Functions
cd functions && firebase emulators:start --only functions

# terminal 2 — Next.js
pnpm dev
```

O app estará disponível em `http://localhost:3000`.

### Variáveis de ambiente

Crie `.env.local` na raiz:

```env
API_URL=http://localhost:5001/
NEXT_PUBLIC_API_URL=http://localhost:5001/

AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
ADMIN_EMAIL=

RESEND_API_KEY=
CONTATO_EMAIL=
CONTATO_FROM=
```

E `functions/.env`:

```env
STORAGE_BUCKET=XXXXX
```

## Deploy (Firebase Hosting + Functions + Next.js SSR)

Este projeto utiliza:

- Next.js (SSR) rodando em Firebase Functions
- Firebase Hosting como entrypoint
- Express API em /api/**

```bash
pnpm run deploy:firebase
```

## ⚠️ Observações importantes
- O Next SSR roda dentro da function nextServer
- A API Express roda na function api
- Todas as rotas que não começam com /api são tratadas pelo Next
- O build .next precisa estar dentro de functions/
- O functions/package.json deve conter:


## Licença

MIT
