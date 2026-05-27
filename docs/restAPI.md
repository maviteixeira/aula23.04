
# Protótipo da Aplicação — Laboratório CRUD de Usuários

Este documento apresenta um protótipo funcional e conceitual da aplicação desenvolvida ao longo das aulas do laboratório de desenvolvimento web utilizando:

- Node.js
- Express
- MySQL
- Docker Compose
- NGINX
- HTML/CSS/JavaScript

O objetivo deste protótipo é demonstrar como os conceitos de:

- MVC
- APIs REST
- comunicação cliente-servidor
- responsividade
- CRUD
- containers

serão aplicados no projeto final.

---

# 1. Objetivo da Aplicação

A aplicação consiste em um sistema web simples para gerenciamento de usuários.

O sistema permitirá:

- cadastrar usuários
- listar usuários
- editar usuários
- remover usuários
- validar entradas
- consumir API REST
- persistir dados em MySQL

---

# 2. Arquitetura da Aplicação

```text
+----------------------+
|      Navegador       |
|  HTML/CSS/JS Front   |
+----------+-----------+
           |
           | HTTP/JSON
           ↓
+----------------------+
|        NGINX         |
| Servidor Front-End   |
+----------+-----------+
           |
           | Proxy/API
           ↓
+----------------------+
|     Node.js API      |
|   Express Backend    |
+----------+-----------+
           |
           | SQL
           ↓
+----------------------+
|       MySQL 8        |
| Banco de Dados       |
+----------------------+
```

---

# 3. Estrutura Visual do Front-End

## Tela principal

```text
+------------------------------------------------+
|          LABORATORIO CRUD DE USUARIOS          |
| Projeto didatico com Node.js e MySQL           |
+------------------------------------------------+

+----------------------+-------------------------+
| Cadastro de Usuario  | Usuarios Cadastrados   |
|----------------------|-------------------------|
| Nome:                | ID | Nome | Email      |
| [______________]     |-------------------------|
|                      | 1  | Ana  | ana@email  |
| Email:               | 2  | Joao | joao@email |
| [______________]     |                         |
|                      | [Editar] [Excluir]     |
| [Salvar] [Cancelar]  |                         |
+----------------------+-------------------------+

Mensagem:
Usuario cadastrado com sucesso.
```

---

# 4. Componentes do Sistema

## Front-End

Responsável por:

- renderizar interface
- enviar requisições HTTP
- consumir API REST
- atualizar tabela dinamicamente

Arquivos principais:

```text
frontend/
├── index.html
├── styles.css
└── app.js
```

---

## Back-End

Responsável por:

- processar regras de negócio
- validar entradas
- manipular banco de dados
- responder em JSON

Arquivos principais:

```text
app/
├── server.js
├── db.js
├── routes/
├── controllers/
└── services/
```

---

## Banco de Dados

Tabela principal:

```sql
usuarios
```

Campos:

| Campo | Tipo |
|---|---|
| id | INT |
| nome | VARCHAR(100) |
| email | VARCHAR(100) |
| created_at | TIMESTAMP |

---

# 5. Fluxo de Comunicação

## Cadastro de Usuário

```text
Usuario preenche formulario
          ↓
Frontend envia POST /usuarios
          ↓
Express recebe requisicao
          ↓
Service executa INSERT
          ↓
MySQL grava os dados
          ↓
API retorna JSON
          ↓
Frontend atualiza tabela
```

---

# 6. Estrutura MVC Aplicada

## Model

Responsável pelos dados.

Exemplo:

```js
db.query('SELECT * FROM usuarios')
```

---

## View

Responsável pela interface.

Exemplo:

```html
<form id="usuario-form">
```

---

## Controller

Responsável pelo fluxo da aplicação.

Exemplo:

```js
router.post('/', controller.criar);
```

---

# 7. Endpoints REST da API

## Listar usuários

```http
GET /usuarios
```

Resposta:

```json
[
  {
    "id": 1,
    "nome": "Ana",
    "email": "ana@email.com"
  }
]
```

---

## Buscar usuário

```http
GET /usuarios/:id
```

---

## Criar usuário

```http
POST /usuarios
```

Body:

```json
{
  "nome": "Carlos",
  "email": "carlos@email.com"
}
```

---

## Atualizar usuário

```http
PUT /usuarios/:id
```

---

## Remover usuário

```http
DELETE /usuarios/:id
```

---

# 8. Estrutura Final Esperada

```text
lab-mysql-docker/
├── docker-compose.yml
├── db/
│   └── init.sql
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── nginx/
│   └── default.conf
└── app/
    ├── Dockerfile
    ├── package.json
    ├── server.js
    ├── db.js
    ├── routes/
    ├── controllers/
    ├── services/
    └── middlewares/
```

---

# 9. Containers Utilizados

## MySQL

Responsável pela persistência dos dados.

Porta:

```text
3306
```

---

## Node.js API

Responsável pelo backend.

Porta:

```text
3000
```

---

## NGINX

Responsável pelo frontend.

Porta:

```text
8080
```

---

# 10. Funcionalidades Esperadas

## CRUD completo

- [x] Create
- [x] Read
- [x] Update
- [x] Delete

---

## Front-End

- [x] HTML semântico
- [x] CSS responsivo
- [x] JavaScript modular

---

## Back-End

- [x] API REST
- [x] MVC
- [x] Validação
- [x] Integração com MySQL

---

## Infraestrutura

- [x] Docker Compose
- [x] Containers separados
- [x] NGINX
- [x] Persistência de dados

---

# 11. Evoluções Futuras

Após concluir o CRUD básico, o projeto poderá evoluir para:

- autenticação com sessão
- JWT
- upload de arquivos
- paginação
- busca de usuários
- deploy em Kubernetes
- pipeline CI/CD
- integração com React
- observabilidade
- testes automatizados

---

# 12. Resultado Esperado

Ao final do projeto, os alunos terão desenvolvido uma aplicação web moderna contendo:

- arquitetura cliente-servidor
- API REST
- integração frontend/backend
- persistência relacional
- containers Docker
- separação MVC
- CRUD completo
- organização profissional de código

O projeto representa uma aplicação real simplificada, semelhante à estrutura utilizada em ambientes profissionais modernos.
