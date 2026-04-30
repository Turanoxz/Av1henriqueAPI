# 🎌 AniSearch — Catálogo de Animes

Projeto desenvolvido para a **AV1 de Desenvolvimento de Websites (DWB)** — 2º Bimestre.

## 📋 Descrição

Aplicação web que consome a [Jikan API](https://jikan.moe) (API não-oficial do MyAnimeList) para exibir um catálogo de animes com busca dinâmica. O usuário pode pesquisar títulos e visualizar informações como capa, nota, tipo e ano de lançamento.

## 🚀 Funcionalidades (Parte 1)

- Busca de animes por nome via campo de texto
- Exibição dinâmica de cards com poster, título, nota e tipo
- Feedback de carregamento (spinner)
- Tratamento de erros de requisição
- Layout responsivo com Bootstrap 5
- Tema escuro com estética anime

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização personalizada |
| Bootstrap 5 | Layout responsivo |
| JavaScript puro | Lógica e manipulação do DOM |
| Fetch API + Async/Await | Consumo da API |
| Jikan API v4 | Fonte de dados |
| Git + GitHub | Versionamento |

## 📁 Estrutura do Projeto

```
av1-dwb-turano-2bimestre/
├── index.html        # Página de listagem
├── css/
│   └── style.css     # Estilos personalizados
├── js/
│   └── script.js     # Lógica de busca e renderização
└── README.md
```

## 🔗 API Utilizada

**Jikan API v4** — `https://api.jikan.moe/v4`

Endpoint utilizado na Parte 1:
```
GET /anime?q={busca}&limit=20&sfw=true
```

## ▶️ Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/av1-dwb-turano-2bimestre.git
   ```
2. Abra o arquivo `index.html` em um navegador  
   *(recomenda-se usar a extensão **Live Server** no VS Code)*

> ⚠️ A Jikan API tem limite de requisições. Caso apareça erro 429, aguarde alguns segundos e tente novamente.

---

Projeto desenvolvido por **Turano** · AV1 DWB · 2025
