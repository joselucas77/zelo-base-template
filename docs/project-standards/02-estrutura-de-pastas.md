# 02. Estrutura de Pastas e Organização do Repositório (Core Standard)

Este documento estabelece a estrutura de diretórios e arquivos mandatória para todos os projetos fullstack baseados neste Boilerplate (Next.js 15, Prisma, Zustand, Serwist PWA).

---

## 1. Onde Criar Cada Tipo de Arquivo (Guia de Alocação)

Para manter a separação estrita de responsabilidades, siga rigorosamente a tabela de alocação:

| Tipo de Artefato           | Onde Armazenar                         | Exemplo de Caminho                    | Convenção de Nomenclatura            |
| :------------------------- | :------------------------------------- | :------------------------------------ | :----------------------------------- |
| **Página (Tela)**          | `src/app/(contexto)/<rota>/page.tsx`   | `src/app/(auth)/tarefas/page.tsx`     | `page.tsx` (export default)          |
| **Layout Compartilhado**   | `src/app/(contexto)/layout.tsx`        | `src/app/(auth)/layout.tsx`           | `layout.tsx` (export default)        |
| **Endpoint de API**        | `src/app/api/<entidade>/route.ts`      | `src/app/api/tasks/route.ts`          | `route.ts` (export GET, POST...)     |
| **Endpoint com ID**        | `src/app/api/<entidade>/[id]/route.ts` | `src/app/api/tasks/[id]/route.ts`     | `route.ts` (export PATCH, DELETE...) |
| **Componente Base de UI**  | `src/components/ui/`                   | `src/components/ui/button.tsx`        | `kebab-case.tsx`                     |
| **Componente de Domínio**  | `src/components/<modulo>/`             | `src/components/tasks/task-form.tsx`  | `kebab-case.tsx`                     |
| **Tabela TanStack**        | `src/app/(contexto)/<modulo>/`         | `src/app/(auth)/tasks/data-table.tsx` | `data-table.tsx`, `columns.tsx`      |
| **Custom Hook**            | `src/hooks/`                           | `src/hooks/use-media-query.ts`        | `use-kebab-case.ts`                  |
| **Schema Zod**             | `src/lib/validations/`                 | `src/lib/validations/task.ts`         | `<entidade>.ts`                      |
| **Serviço Client-side**    | `src/services/`                        | `src/services/tasks.service.ts`       | `<entidade>.service.ts`              |
| **Store Global Zustand**   | `src/store/`                           | `src/store/useTaskStore.ts`           | `use<Entidade>Store.ts`              |
| **Tipos TypeScript**       | `src/types/`                           | `src/types/task.ts`                   | `<entidade>.ts`                      |
| **Função Utilitária Pura** | `src/lib/`                             | `src/lib/date-utils.ts`               | `kebab-case.ts`                      |

---

## 2. A Regra de Ouro: Fracionamento de Componentes (Max 300 Linhas)

Para evitar que telas e formulários concentrem centenas de linhas e misturem responsabilidades, decomponha o módulo obrigatoriamente em 4 partes padronizadas:

1. **`page.tsx` (Orquestrador de Tela):**
   - Responsável apenas por obter parâmetros, verificar permissão com `usePermissions`, controlar estados de modal aberto/fechado e disparar toasts com `sonner`.
2. **`columns.tsx` (Definição de Colunas TanStack):**
   - Isola exclusivamente as colunas da tabela, formatação de células e badges de status.
3. **`data-table.tsx` (Renderização da Lista):**
   - Concentra o hook `useReactTable`, a barra de pesquisa, paginação e botões de lote (bulk actions).
4. **`<modulo>-form.tsx` (Formulário Polimórfico):**
   - Concentra as entradas de dados, validação de inputs controlados por `useState`, máscaras e a casca polimórfica (Drawer no mobile / Dialog no desktop).

---

## 3. Estrutura de Referência do Boilerplate

Ao inicializar o template, a estrutura de diretórios obedecerá estritamente a esta topologia:

```text
/
├── docs/
│   └── project-standards/       # Manuais de engenharia consolidados
├── prisma/
│   ├── migrations/
│   ├── schema.prisma            # Modelagem Core (Tenant, User, AccessGroup, AuditLog)
│   └── seed.ts                  # Script de população inicial do banco
├── public/
│   ├── site.webmanifest         # PWA Manifest configurado (Standalone)
│   └── sw.js                    # Output compilado do Service Worker (Serwist)
├── scripts/                     # ÚNICO local permitido para scripts de automação/migração
├── src/
│   ├── app/
│   │   ├── (auth)/              # Route Group autenticado
│   │   │   ├── dashboard/page.tsx
│   │   │   └── layout.tsx       # Auth layout (Validação DB + Injeção de user_context)
│   │   ├── api/                 # Endpoints HTTP REST
│   │   │   ├── auth/            # /login, /logout (Criptografia com jose)
│   │   │   └── sync/route.ts    # Agregação PostgreSQL para o BroadcastChannel
│   │   ├── login/page.tsx       # Tela de autenticação pública
│   │   ├── globals.css          # Tailwind CSS v4 (Design tokens OKLCH)
│   │   ├── layout.tsx           # RootLayout com PWAUpdater e Toaster
│   │   └── sw.ts                # Service Worker Serwist (StaleWhileRevalidate / NetworkOnly)
│   ├── components/
│   │   ├── auth/                # PermissionsProviderWrapper
│   │   ├── layout/              # Sidebar (Desktop) e BottomNavigation (Mobile)
│   │   ├── ui/                  # Componentes Base UI (Button, Dialog, Drawer, Input, BoxIcon)
│   ├── hooks/                   # useIsMobile, useDataSync, useUserContext
│   ├── lib/
│   │   ├── validations/         # Schemas Zod (Frontend e Backend unificados)
│   │   ├── api-request.ts       # Wrapper fetch padronizado
│   │   ├── auth.ts              # getCurrentUser() no servidor
│   │   ├── jwt-auth.ts          # Assinatura JWT
│   │   └── utils.ts             # cn (clsx + tailwind-merge)
│   ├── services/                # Camada de requisições API
│   ├── store/                   # Zustand stores (com skipHydration: true)
│   └── types/                   # Tipagens TS estritas (proibido o uso de 'any')
├── tests/                       # Testes de integração Vitest
├── tests-e2e/                   # Testes de interface Playwright
├── Dockerfile                   # Build standalone multi-stage otimizado
├── middleware.ts                # Interceptação rápida de rotas via JWT
└── next.config.ts               # Configuração Serwist + Standalone
```
