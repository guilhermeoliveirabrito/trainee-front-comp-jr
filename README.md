# MeuCine

Aplicação web para montar a sua watchlist de filmes: explore o catálogo, busque e filtre por gênero, ordene pelas melhores notas e salve os favoritos para assistir depois.

Projeto desenvolvido para o desafio de front-end do processo trainee da Comp Júnior (UFLA).

## Tema

O MeuCine segue o estilo das plataformas de streaming, com visual escuro e cards de filmes. Os dados vêm da CineComp API, que oferece listagem, detalhes, cadastro, edição, exclusão, favoritos e autenticação por JWT.

## Tecnologias e justificativas

| Tecnologia | Uso | Por que foi escolhida |
| ---------- | --- | --------------------- |
| React | Interface | Divide a tela em componentes reutilizáveis (Header, Footer, cards, formulário) e é a opção recomendada no desafio |
| Vite | Ambiente de desenvolvimento e build | Inicialização rápida, atualização instantânea no navegador e configuração mínima |
| React Router DOM | Rotas | Navegação entre páginas sem recarregar, rotas protegidas para usuários autenticados e filtros guardados na URL |
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

No Windows (PowerShell), use `Copy-Item .env.example .env` no lugar do `cp .env.example .env`.

Acesse o endereço mostrado no terminal, normalmente http://localhost:5173.

### Variáveis de ambiente

| Variável | Descrição | Valor no `.env.example` |
| -------- | --------- | ----------------------- |
| `VITE_API_URL` | URL base da CineComp API | `http://localhost:3000/api` |
| `VITE_TMDB_API_KEY` | Chave gratuita do TMDB para buscar as capas dos filmes (opcional) | vazio |

### Capas dos filmes (opcional)

A API não guarda capas reais, então o MeuCine busca os pôsteres no [TMDB](https://www.themoviedb.org) pelo título e ano do filme e guarda o resultado no navegador. Este produto usa a API do TMDB, mas não é endossado nem certificado por ele. Sem a chave, o projeto funciona normalmente e mostra uma capa gerada no lugar do pôster.

Para ativar as capas reais:

1. Crie uma conta gratuita em https://www.themoviedb.org
2. Em Configurações, aba API, solicite uma chave do tipo Developer e copie a "Chave da API"
3. No arquivo `.env`, preencha `VITE_TMDB_API_KEY=sua_chave`
4. Reinicie o `npm run dev`

### Usuário de teste

A CineComp API já vem com um usuário cadastrado:

- E-mail: marcospaulo@compjunior.com.br
- Senha: PaczinBalaTensa000-

Também é possível criar uma conta nova pela página de cadastro.

### Scripts disponíveis

| Comando | O que faz |
| ------- | --------- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção na pasta `dist` |
| `npm run preview` | Serve localmente a versão de produção |
| `npm run lint` | Verifica o código com o ESLint |

## Funcionalidades

- Cadastro, login e logout, com a sessão mantida no navegador (JWT)
- Listagem de filmes com busca, filtro por gênero, ordenação e paginação
- Página de detalhes de cada filme
- Favoritar e desfavoritar filmes (área restrita)
- Cadastro, edição e exclusão de filmes, com confirmação e notificações (área restrita)
- Perfil com os filmes favoritados e edição de nome e e-mail (área restrita)
- Capas reais dos filmes via TMDB, com capa gerada quando não houver pôster
- Tratamento de erros da API, indicadores de carregamento e página 404
- Encerramento automático da sessão quando o token expira
- Layout responsivo, do celular ao desktop

## Rotas

| Rota | Acesso | Descrição |
| ---- | ------ | --------- |
| `/` | Público | Página inicial com os filmes mais bem avaliados |
| `/movies` | Público | Lista com busca, filtros e paginação |
| `/movies/:id` | Público | Detalhes do filme |
| `/login` | Público | Entrar |
| `/register` | Público | Criar conta |
| `/favorites` | Restrito | Filmes favoritos |
| `/admin/movies` | Restrito | Cadastro, edição e exclusão de filmes |
| `/profile` | Restrito | Filmes favoritados e edição de nome e e-mail |

As rotas restritas redirecionam para o login e, depois de entrar, voltam para a página que o usuário tentou acessar.

## Como testar

Com a API e o front-end rodando (veja "Instalação e execução"), abra http://localhost:5173 e siga o roteiro abaixo. Para testar do zero, com o catálogo original, rode `npm run reset-db` na pasta da API.

### 1. Navegação sem login

1. Na **Home**, confira o destaque e a lista "Mais bem avaliados". Clique em "Ver filmes".
2. Em **Filmes**, busque por um título (por exemplo, `matrix`), escolha um gênero e uma ordenação. Repare que a URL muda a cada filtro. Use o botão voltar do navegador e o "Limpar filtros".
3. Navegue pela paginação no final da lista.
4. Clique em um filme para abrir os **Detalhes**.
5. Digite um endereço que não existe, como `/qualquer-coisa`, para ver a página 404.

### 2. Rotas restritas e login

1. Sem estar logado, acesse `/favorites`, `/profile` ou `/admin/movies`. Você é levado ao login.
2. Entre com o usuário de teste. Depois do login, você volta para a página que tentou abrir.
3. Tente entrar com uma senha errada para ver a mensagem de erro.
4. Em **Criar conta**, teste uma senha curta, senhas diferentes e um e-mail já usado. Cada caso mostra uma mensagem própria.

### 3. Favoritos e perfil

1. Em **Filmes**, clique no coração de um card para favoritar. Clique de novo para desfavoritar.
2. Abra **Favoritos** e confira a lista.
3. Abra **Perfil**: ele mostra o total de filmes favoritados e a lista deles. Em "Editar perfil", altere o nome e salve. A notificação de sucesso aparece e o nome muda no cabeçalho.

### 4. Gerenciar filmes (CRUD)

1. Em **Gerenciar**, clique em "Novo filme", deixe campos vazios e envie para ver as validações. Depois preencha tudo e cadastre.
2. Clique em "Editar" em um filme, altere algo e salve.
3. Clique em "Excluir" e confirme no modal. O botão "Cancelar" e a tecla Esc fecham o modal sem excluir nada.

### 5. Erros e sessão

- **API fora do ar:** pare a API (Ctrl+C no terminal dela) e recarregue a lista de filmes. Aparece uma mensagem de erro com o botão "Tentar novamente".
- **Sessão expirada:** logado, abra as ferramentas do navegador (F12), vá em Application, Local Storage, e troque o valor de `meucine:token` por qualquer texto. Ao abrir Favoritos, a sessão é encerrada e você volta ao login.

### 6. Responsividade

1. Abra as ferramentas do navegador (F12) e ative o modo de dispositivo (Ctrl+Shift+M).
2. Teste três larguras: celular (375 px), tablet (768 px) e desktop (1280 px).
3. Confira o cabeçalho, a grade de filmes, os formulários e a tela de gerenciamento em cada uma.

## Decisões de projeto

- **Sessão:** o token e os dados do usuário ficam no `localStorage`. Um interceptor do Axios envia o token em todas as requisições e, se a API responder 401 em uma rota protegida, encerra a sessão e leva o usuário ao login.
- **Estado global:** apenas a autenticação usa Context API. O restante do estado fica nas próprias páginas, sem bibliotecas extras.
- **Filtros na URL:** busca, gênero, ordenação e página ficam na query string (`/movies?genre=Acao&page=2`), então o botão voltar do navegador e os links compartilhados mantêm o estado.
- **Componentes reutilizáveis:** carregamento, mensagem de erro, notificação, modal de confirmação, paginação, card de filme e formulário de filme são usados por mais de uma página.

## Estrutura de pastas

```
src/
├── components/  componentes reutilizáveis (Header, Footer, Layout, MovieCard, MovieForm, Pagination, Notification, ConfirmModal, Loading, ErrorMessage, PrivateRoute)
├── contexts/    estado global da autenticação
├── hooks/       hooks reutilizáveis (useAuth, useFavorites)
├── pages/       páginas da aplicação
├── services/    configuração do Axios e chamadas à API
├── styles/      estilos globais e variáveis de tema
├── utils/       sessão no navegador e lista de gêneros
├── App.jsx      definição das rotas
└── main.jsx     ponto de entrada
```

## Padrão de commits

Os commits seguem o padrão Conventional Commits, em português: `feat` para novas funcionalidades, `fix` para correções, `refactor` para reorganização de código, `style` para estilos, `docs` para documentação e `chore` para configurações e manutenção.

## Status do projeto

- [x] Semana 1: configuração do ambiente, repositório e estrutura de pastas
- [x] Semana 2: listagem de filmes e primeiros componentes
- [x] Semana 3: login, cadastro e feedback visual
- [x] Semana 4: navegação, layout e responsividade
- [x] Semana 5: CRUD completo de filmes
- [x] Semana 6: refinamento, tratamento de erros e feedback visual
- [x] Semana 7: documentação final e vídeo de demonstração

## Autor

Guilherme Oliveira de Brito Silva
