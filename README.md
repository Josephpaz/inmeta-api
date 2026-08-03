# Inmeta API — Gerenciamento de Documentação de Colaboradores

API RESTful para gerenciar o fluxo de documentação de colaboradores: cadastro de colaboradores e tipos de documento, vinculação de exigências, envio de documentos com versionamento, listagem de pendências e estatísticas gerais.

## Stack

- **Node.js 22.22.2** + **TypeScript** (strict mode)
- **NestJS** (Express) — REST API
- **PostgreSQL** + **Prisma** — persistência e migrations
- **Jest** + **Supertest** — testes unitários e e2e
- **Docker Compose** — Postgres local (dev + teste)
- **class-validator** / **class-transformer** — validação de DTOs
- **Swagger/OpenAPI** — documentação interativa em `/docs`
- **Husky** + **lint-staged** + **commitlint** — qualidade e padronização de commits
- **GitHub Actions** — CI (lint, build, testes) e `semantic-release` (versionamento e changelog automáticos)

## Como rodar

### Pré-requisitos
- Node 22.22.2 (veja `.nvmrc`)
- Docker + Docker Compose

### Passos

```bash
nvm use                     # garante a versão correta do Node
npm install                 # instala dependências (roda `prisma generate` automaticamente)
cp .env.example .env        # variáveis de ambiente (já vem preenchido com os valores do compose)
docker compose up -d        # sobe o Postgres (dev + teste)
npx prisma migrate deploy   # aplica as migrations
npm run db:seed             # popula com dados de exemplo (15 colaboradores, 8 tipos de documento)
npm run start:dev           # inicia a API em modo watch
```

A API sobe em `http://localhost:3000`. Documentação interativa (Swagger) em `http://localhost:3000/docs`.

### Testes

```bash
npm run test        # unitários (mockam os repositories, não tocam banco)
npm run test:e2e    # e2e (sobe a app real contra o banco de teste `inmeta_api_test`)
npm run test:cov    # unitários com cobertura
```

Os testes e2e criam/migram o banco de teste automaticamente (`globalSetup` do Jest) e resetam os dados antes de cada teste — não é preciso nenhum passo manual.

## Arquitetura

O projeto segue princípios de **DDD** e **Clean Architecture**, organizados por módulo de domínio (`employees`, `document-types`, `employee-documents`, `documents`, `statistics`), cada um dividido em três camadas:

```
src/modules/<modulo>/
├── domain/              # entidade rica (invariantes validadas nos setters), exceções de domínio,
│                         # interface do repository (abstract class = token de DI)
├── infrastructure/
│   └── persistence/      # mapper (Prisma <-> domínio) + implementação concreta do repository
└── use-cases/
    └── <acao>/           # vertical slice: um controller + um service por operação
        ├── <acao>.controller.ts
        ├── <acao>.service.ts
        └── <acao>.service.spec.ts
```

**Por que vertical slice em vez de um controller único por recurso**: cada use-case fica isolado, com responsabilidade única (uma rota, um motivo pra mudar) — mais alinhado a Clean Architecture (Interactors) e SOLID (SRP) do que um controller genérico com vários métodos.

**Inversão de dependência**: cada repository é uma `abstract class` (serve de token de DI nativo do Nest, sem precisar de `Symbol` + `@Inject()`). Use-cases dependem só da abstração; o binding concreto (Prisma) acontece no `module`. Isso também facilita trocar a implementação em testes (mock) ou no futuro (outro banco/ORM).

**Entidades sempre válidas**: o construtor de cada entidade é privado; a única forma de criar uma é via `create()`, que passa pelos setters (onde as invariantes são validadas). Não existe caminho para uma entidade inválida existir em memória.

**Exceções de domínio desacopladas do HTTP**: exceções de negócio estendem `DomainException` (que carrega seu próprio `HttpStatus`), sem depender do NestJS. Um `DomainExceptionFilter` global traduz isso pra resposta HTTP na borda. Casos de "não encontrado"/"removido" usam as exceptions nativas do Nest (`NotFoundException`/`GoneException`) diretamente nos use-cases, já que não são invariantes de domínio.

## Modelagem

- **`Employee`** / **`DocumentType`**: soft delete via `deletedAt`, com endpoints de restore. Listagens/filtros/estatísticas sempre excluem registros removidos.
- **`EmployeeDocument`**: tabela de junção representando "colaborador X é obrigado a enviar o tipo de documento Y". **Hard delete** na desvinculação — decisão consciente (veja "Decisões e trade-offs").
- **`Document`**: cada envio é uma **nova linha**, nunca um update. A versão "atual" é derivada (`MAX(version)` pro par colaborador+tipo), não um campo `isActive` armazenado — evita estado redundante que pode dessincronizar. Constraint única `(employeeId, documentTypeId, version)` garante, no banco, que nenhuma versão é atribuída duas vezes, mesmo sob concorrência.
- **Documento pendente** é um estado **derivado**, não uma tabela própria: existe vínculo (`EmployeeDocument`) sem nenhuma linha correspondente em `Document`.

## Atomicidade e concorrência

- **Criação de colaborador/tipo de documento**: checagem de duplicidade (`findByEmail`/`findByName`) *e* constraint única no banco — cobre a corrida entre o `SELECT` de checagem e o `INSERT` (dois cadastros simultâneos com o mesmo e-mail/nome nunca duplicam; o segundo recebe 409).
- **Envio de documento**: a versão seguinte é calculada a partir do `MAX(version)` existente; a constraint única `(employeeId, documentTypeId, version)` garante que, se dois reenvios simultâneos calcularem a mesma "próxima versão", apenas um é persistido — o outro recebe 409 (`ConcurrentDocumentSubmissionException`). Validado em teste e2e (`test/concurrency.e2e-spec.ts`) disparando 5 envios simultâneos e verificando que nenhuma versão se repete.

## Estatísticas

Implementadas como **três endpoints separados** (`/statistics/completion-percentage`, `/statistics/most-pending-document-types`, `/statistics/recent-submissions`) em vez de um dashboard único — o desafio deixa esse formato deliberadamente em aberto. A escolha por endpoints atômicos favorece modularidade e testabilidade independente de cada métrica. As consultas mais complexas (pendência, agregação) usam SQL bruto via `$queryRaw` do Prisma, parametrizado (`Prisma.sql`), já que o Prisma não expressa nativamente "registros sem correspondência em outra tabela" (`NOT EXISTS`) através da API fluente.

## CI/CD

- **CI** (`ci.yml`): roda em PRs e pushes para `main` — sobe um Postgres de serviço, roda lint, build, testes unitários e e2e.
- **Release** (`release.yml`): roda em push para `main`, após o CI passar (branch protection exige o check `ci` antes de permitir merge). Usa `semantic-release` para calcular a próxima versão a partir dos commits (Conventional Commits, validados via `commitlint` em todo commit local), gerar `CHANGELOG.md`, criar a tag Git e publicar uma Release no GitHub — tudo automático.

## Decisões e trade-offs conscientes

- **Soft delete em `EmployeeDocument` (vínculos)**: o requisito de soft delete do desafio cita explicitamente só "colaboradores e documentos". A desvinculação usa **hard delete** — "desvincular" significa "esse par não é mais obrigatório", e o histórico de documentos já enviados fica preservado independentemente em `Document` (que referencia `employeeId`/`documentTypeId` direto, não o vínculo).
- **Soft delete em `Document`**: não existe um campo `deletedAt` próprio — o mecanismo de versionamento (linha antiga nunca é apagada, só deixa de ser a versão mais recente) já cumpre o requisito de "documento não pode ser removido fisicamente", sem precisar de um segundo mecanismo redundante. Não há operação de "excluir documento enviado" no escopo funcional do desafio.
- **Só é possível enviar um documento se existir vínculo prévio**: `POST .../documents` retorna 404 se o colaborador não estiver vinculado ao tipo de documento — evita dados sem sentido de negócio (documento enviado que nunca foi exigido).
- **Sem listagem genérica de documentos**: `GET /employees` e `GET /document-types` (paginados/filtrados) existem por serem necessários pra gerenciar o cadastro na prática, mas **não** há um `GET /documents` genérico — só a listagem de pendentes, que é o único requisito de listagem explícito do desafio.
- **Sem operação de edição** (`PATCH`/`PUT`) em colaboradores ou tipos de documento — o escopo funcional só pede "cadastro" (criação); editar não foi solicitado.
- **Testes e2e focados, não exaustivos**: 3 specs cobrindo integração cruzada entre módulos, concorrência real e soft delete refletido em consultas, sem replicar cada endpoint e cada caso de erro que os testes unitários já cobrem isoladamente.
- **Sem autenticação/autorização** — explicitamente fora do escopo avaliado pelo desafio.
- **Sem endpoint de health check nem logs estruturados** — diferenciais opcionais não implementados por priorização de tempo; o escopo funcional obrigatório e os requisitos técnicos (versionamento, atomicidade, soft delete) tiveram prioridade.
