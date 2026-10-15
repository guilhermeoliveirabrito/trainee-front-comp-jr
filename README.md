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