# MeuCine

Aplicação web para montar a sua watchlist de filmes: explore o catálogo, busque e filtre por gênero, diretor, ano e nota, e salve os favoritos para assistir depois.

Projeto desenvolvido para o desafio de front-end do processo trainee da Comp Júnior (UFLA).

## Tema

O MeuCine segue o estilo das plataformas de streaming, com visual escuro e cards de filmes. Os dados vêm da CineComp API, que oferece listagem, detalhes, cadastro, edição, exclusão, favoritos e autenticação por JWT.

## Tecnologias e justificativas

| Tecnologia | Uso | Por que foi escolhida |
| ---------- | --- | --------------------- |
| React | Interface | Divide a tela em componentes reutilizáveis (Header, Footer, cards) e é a opção recomendada no desafio |
| Vite | Ambiente de desenvolvimento e build | Inicialização rápida, atualização instantânea no navegador e configuração mínima |
| React Router DOM | Rotas | Navegação entre páginas sem recarregar e rotas protegidas para usuários autenticados |
| Axios | Requisições HTTP | Permite uma instância única com URL base, envio automático do token JWT e tratamento de erros centralizado |
| ESLint | Qualidade do código | Padroniza o código e aponta problemas antes da execução |

## Back-end

O projeto consome a [CineComp API](https://github.com/jpedroreiss/backend-cinecomp-2026-2) (opção 1 do desafio), feita com Node.js, Express, SQLite e JWT. Ela cria o banco automaticamente, então não exige instalação de banco de dados.

## Pré-requisitos

- Git
- Node.js 20.19 ou superior (ou 22.13 ou superior) com npm

Para conferir as versões instaladas:

```bash
git --version
node -v
npm -v
```

## Instalação e execução

O front-end depende da API em execução. Use dois terminais.

### 1. Back-end (CineComp API)

```bash
git clone https://github.com/jpedroreiss/backend-cinecomp-2026-2.git
cd backend-cinecomp-2026-2
npm install
npm run dev
```

Deixe esse terminal aberto. Para conferir se a API subiu:

- Health check: http://localhost:3000/api/health
- Documentação (Swagger): http://localhost:3000/api/docs

### 2. Front-end (MeuCine)

Em outro terminal:

```bash
git clone https://github.com/guilhermeoliveirabrito/trainee-front-comp-jr.git
cd trainee-front-comp-jr
npm install
cp .env.example .env
npm run dev
```

Acesse o endereço mostrado no terminal, normalmente http://localhost:5173.

### Variáveis de ambiente

| Variável | Descrição | Valor no `.env.example` |
| -------- | --------- | ----------------------- |
| `VITE_API_URL` | URL base da CineComp API | `http://localhost:3000/api` |

### Usuário de teste

A CineComp API já vem com um usuário cadastrado:

- E-mail: marcospaulo@compjunior.com.br
- Senha: PaczinBalaTensa000-

### Scripts disponíveis

| Comando | O que faz |
| ------- | --------- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção na pasta `dist` |
| `npm run preview` | Serve localmente a versão de produção |
| `npm run lint` | Verifica o código com o ESLint |

## Estrutura de pastas

```
src/
├── pages/       páginas da aplicação
├── services/    configuração do Axios e chamadas à API
├── styles/      estilos globais
├── App.jsx      definição das rotas
└── main.jsx     ponto de entrada
```

As pastas `components` e `assets` serão adicionadas conforme o desenvolvimento avança.

## Padrão de commits

Os commits seguem o padrão Conventional Commits, em português: `feat` para novas funcionalidades, `fix` para correções, `refactor` para reorganização de código, `style` para estilos, `docs` para documentação e `chore` para configurações e manutenção.

## Status do projeto

- [x] Semana 1: configuração do ambiente, repositório e estrutura de pastas
- [ ] Semana 2: listagem de filmes e primeiros componentes
- [ ] Semana 3: login, cadastro e feedback visual
- [ ] Semana 4: navegação, layout e responsividade
- [ ] Semana 5: CRUD completo de filmes
- [ ] Semana 6: refinamento, tratamento de erros e feedback visual
- [ ] Semana 7: documentação final e vídeo de demonstração

## Autor

Guilherme Oliveira de Brito Silva