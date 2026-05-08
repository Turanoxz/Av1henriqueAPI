# 🎌 AniSearch — Catálogo de Animes

Projeto desenvolvido para a **AV1 de Desenvolvimento de Websites (DWB)** — 2º Bimestre.

## 📋 Descrição

Aplicação web que consome a [Jikan API](https://jikan.moe) (API não-oficial do MyAnimeList) para exibir um catálogo completo de animes. O usuário pode buscar títulos, filtrar por gênero, tipo e status, visualizar detalhes completos de cada anime e salvar seus favoritos no navegador.

## 🚀 Funcionalidades

### Página inicial (`index.html`)
- Top animes carregados automaticamente ao abrir o site (do mais ao menos avaliado)
- Busca de animes por nome com `fetch` + `async/await`
- Filtros combinados por **tipo** (TV, Filme, OVA, ONA, Especial), **status** (em exibição, completo, em breve), **gênero** (13 opções) e **ordenação** (nota, popularidade, ranking, título, data)
- Paginação completa com números de página, reticências inteligentes e navegação anterior/próximo
- Feedback de carregamento (spinner) e tratamento de erros
- Layout responsivo com Bootstrap 5

### Página de detalhes (`detalhes.html`)
- Navegação via parâmetro de URL (`?id=`) com `URLSearchParams`
- Nova requisição à API para buscar todos os dados do anime
- Exibe: poster, título em japonês, sinopse, episódios, duração, estúdio, temporada, fonte, nota, ranking, popularidade, membros, favoritos MAL, gêneros, badges de tipo/status/classificação e trailer embutido (quando disponível)
- Botão **Favoritar** que salva/remove o anime no `localStorage` do navegador
- Link direto para o MyAnimeList
- Toast de confirmação ao favoritar/desfavoritar

### Página de favoritos (`favoritos.html`)
- Lista todos os animes salvos no `localStorage` do navegador
- Os favoritos persistem mesmo após fechar o navegador
- Botão de remoção individual em cada card
- Botão "Limpar tudo" com modal de confirmação

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização personalizada com tema escuro |
| Bootstrap 5 | Layout responsivo e componentes |
| JavaScript puro | Lógica, manipulação do DOM e navegação entre páginas |
| Fetch API + Async/Await | Consumo da API |
| URLSearchParams | Passagem de parâmetros entre páginas |
| localStorage | Persistência dos favoritos no navegador |
| Jikan API v4 | Fonte de dados (MyAnimeList) |
| Git + GitHub | Versionamento |

## 📁 Estrutura do Projeto

```
av1-dwb-turano-2bimestre/
├── index.html          # Página de listagem e busca
├── detalhes.html       # Página de detalhes do anime
├── favoritos.html      # Página de favoritos salvos
├── css/
│   └── style.css       # Estilos personalizados
├── js/
│   ├── script.js       # Lógica da listagem, filtros e paginação
│   ├── detalhes.js     # Lógica da página de detalhes e favoritos
│   └── favoritos.js    # Lógica da página de favoritos
└── README.md
```

## 🔗 API Utilizada

**Jikan API v4** — `https://api.jikan.moe/v4`

| Endpoint | Uso |
|---|---|
| `GET /anime?q={busca}&...` | Busca e listagem com filtros e paginação |
| `GET /anime/{id}/full` | Detalhes completos de um anime |

## ▶️ Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/av1-dwb-turano-2bimestre.git
   ```
2. Abra a pasta no **VS Code**
3. Clique com botão direito no `index.html` → **Open with Live Server**

> ⚠️ É obrigatório usar o **Live Server** (ou qualquer servidor local). Abrir o arquivo diretamente pelo explorador de arquivos (`file:///`) bloqueia as requisições à API por restrições de segurança do navegador.

> ⚠️ A Jikan API tem limite de requisições por segundo. Se aparecer erro 429, aguarde alguns segundos e tente novamente.

## 📌 Observações

- Os favoritos são salvos no `localStorage` do navegador onde o site é acessado. Cada navegador/computador tem sua própria lista.
- A API não exige cadastro, chave de acesso ou autenticação.

---

Projeto desenvolvido por **Turano** · AV1 DWB · 2025
