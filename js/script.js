// ============================================================
//  AniSearch — script.js
// ============================================================

const BASE_URL = "https://api.jikan.moe/v4";

var estado = {
  query:    "",
  tipo:     "",
  status:   "",
  genero:   "",
  ordem:    "score",
  pagina:   1,
  totalPaginas: 1,
  totalItens:   0,
  modoTop:  true
};

document.addEventListener("DOMContentLoaded", function () {

  var searchInput     = document.getElementById("searchInput");
  var searchBtn       = document.getElementById("searchBtn");
  var animeGrid       = document.getElementById("animeGrid");
  var loadingState    = document.getElementById("loadingState");
  var errorState      = document.getElementById("errorState");
  var errorMessage    = document.getElementById("errorMessage");
  var emptyState      = document.getElementById("emptyState");
  var resultsSection  = document.getElementById("resultsSection");
  var resultsCount    = document.getElementById("resultsCount");
  var sectionTitle    = document.getElementById("sectionTitle");
  var paginationWrap  = document.getElementById("paginationWrapper");
  var paginationInfo  = document.getElementById("paginationInfo");
  var paginationCtrls = document.getElementById("paginationControls");
  var filterType      = document.getElementById("filterType");
  var filterStatus    = document.getElementById("filterStatus");
  var filterGenre     = document.getElementById("filterGenre");
  var filterOrder     = document.getElementById("filterOrder");
  var clearFilters    = document.getElementById("clearFilters");

  // ── Visibilidade de estados ────────────────────────────────
  function showLoading() {
    loadingState.classList.remove("d-none");
    errorState.classList.add("d-none");
    emptyState.classList.add("d-none");
    resultsSection.classList.add("d-none");
    paginationWrap.classList.add("d-none");
  }

  function showError(msg) {
    loadingState.classList.add("d-none");
    resultsSection.classList.add("d-none");
    paginationWrap.classList.add("d-none");
    emptyState.classList.add("d-none");
    errorMessage.textContent = msg;
    errorState.classList.remove("d-none");
  }

  function showEmpty() {
    loadingState.classList.add("d-none");
    resultsSection.classList.add("d-none");
    paginationWrap.classList.add("d-none");
    errorState.classList.add("d-none");
    emptyState.classList.remove("d-none");
  }

  function showResults() {
    loadingState.classList.add("d-none");
    errorState.classList.add("d-none");
    emptyState.classList.add("d-none");
    resultsSection.classList.remove("d-none");
  }

  // ── Monta URL da API ───────────────────────────────────────
  function montarURL() {
    var params = new URLSearchParams();
    params.set("limit", "20");
    params.set("sfw", "true");
    params.set("page", estado.pagina);
    params.set("order_by", estado.ordem || "score");
    params.set("sort", "desc");
    if (estado.tipo)   params.set("type", estado.tipo);
    if (estado.status) params.set("status", estado.status);
    if (estado.genero) params.set("genres", estado.genero);
    if (estado.query)  params.set("q", estado.query);
    return BASE_URL + "/anime?" + params.toString();
  }

  // ── Cria card de anime ─────────────────────────────────────
  function criarCard(anime) {
    var col = document.createElement("div");
    col.className = "col card-fade-in";

    var score = anime.score ? anime.score.toFixed(1) : "N/A";
    var year  = anime.year || (anime.aired && anime.aired.prop && anime.aired.prop.from ? anime.aired.prop.from.year : "") || "?";
    var title = anime.title_english || anime.title || "Sem título";
    var image = (anime.images && anime.images.jpg && anime.images.jpg.image_url)
      ? anime.images.jpg.image_url
      : "https://placehold.co/225x318?text=Sem+Imagem";

    col.innerHTML =
      '<a href="detalhes.html?id=' + anime.mal_id + '" class="anime-card-link">' +
        '<div class="anime-card">' +
          '<div class="anime-card-img-wrapper">' +
            '<img src="' + image + '" alt="' + title + '" loading="lazy" />' +
            '<span class="anime-score">★ ' + score + '</span>' +
            '<span class="anime-type-badge">' + (anime.type || "?") + '</span>' +
          '</div>' +
          '<div class="anime-card-body">' +
            '<h6 class="anime-title">' + title + '</h6>' +
            '<p class="anime-meta">' + year + '</p>' +
          '</div>' +
        '</div>' +
      '</a>';

    return col;
  }

  // ── Renderiza paginação ────────────────────────────────────
  function renderPaginacao() {
    var total = estado.totalPaginas;
    var atual = estado.pagina;

    if (total <= 1) {
      paginationWrap.classList.add("d-none");
      return;
    }

    paginationWrap.classList.remove("d-none");
    paginationInfo.textContent =
      "Página " + atual + " de " + total +
      (estado.totalItens ? " · " + estado.totalItens.toLocaleString("pt-BR") + " títulos" : "");

    paginationCtrls.innerHTML = "";

    // Botão Anterior
    var btnAnterior = document.createElement("button");
    btnAnterior.className = "page-btn";
    btnAnterior.innerHTML = '<i class="bi bi-chevron-left"></i>';
    btnAnterior.disabled = atual === 1;
    btnAnterior.addEventListener("click", function () { irParaPagina(atual - 1); });
    paginationCtrls.appendChild(btnAnterior);

    // Calcula quais páginas mostrar
    var paginas = calcularPaginas(atual, total);

    paginas.forEach(function (p) {
      var btn = document.createElement("button");
      if (p === "...") {
        btn.className = "page-btn ellipsis";
        btn.textContent = "…";
        btn.disabled = true;
      } else {
        btn.className = "page-btn" + (p === atual ? " active" : "");
        btn.textContent = p;
        btn.addEventListener("click", function () { irParaPagina(p); });
      }
      paginationCtrls.appendChild(btn);
    });

    // Botão Próximo
    var btnProximo = document.createElement("button");
    btnProximo.className = "page-btn";
    btnProximo.innerHTML = '<i class="bi bi-chevron-right"></i>';
    btnProximo.disabled = atual === total;
    btnProximo.addEventListener("click", function () { irParaPagina(atual + 1); });
    paginationCtrls.appendChild(btnProximo);
  }

  // Gera array de páginas com reticências quando necessário
  function calcularPaginas(atual, total) {
    if (total <= 7) {
      var arr = [];
      for (var i = 1; i <= total; i++) arr.push(i);
      return arr;
    }

    var paginas = [];

    if (atual <= 4) {
      // Início: 1 2 3 4 5 ... último
      for (var i = 1; i <= 5; i++) paginas.push(i);
      paginas.push("...");
      paginas.push(total);
    } else if (atual >= total - 3) {
      // Final: 1 ... (total-4) ... último
      paginas.push(1);
      paginas.push("...");
      for (var i = total - 4; i <= total; i++) paginas.push(i);
    } else {
      // Meio: 1 ... (atual-1) atual (atual+1) ... último
      paginas.push(1);
      paginas.push("...");
      paginas.push(atual - 1);
      paginas.push(atual);
      paginas.push(atual + 1);
      paginas.push("...");
      paginas.push(total);
    }

    return paginas;
  }

  // ── Navega para uma página específica ─────────────────────
  function irParaPagina(pagina) {
    estado.pagina = pagina;
    buscarAnimes();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Busca principal ────────────────────────────────────────
  async function buscarAnimes() {
    showLoading();

    try {
      var url = montarURL();
      console.log("📡 Requisição:", url);

      var response = await fetch(url);

      if (!response.ok) throw new Error("HTTP " + response.status);

      var json = await response.json();
      var animes = json.data;
      var pag = json.pagination;

      console.log("✅ Animes recebidos:", animes ? animes.length : 0);

      if (!animes || animes.length === 0) {
        showEmpty();
        return;
      }

      // Salva dados de paginação
      if (pag) {
        estado.totalPaginas = pag.last_visible_page || 1;
        estado.totalItens   = pag.items ? pag.items.total : 0;
      }

      // Renderiza cards
      animeGrid.innerHTML = "";
      animes.forEach(function (anime) {
        animeGrid.appendChild(criarCard(anime));
      });

      // Atualiza badge
      if (estado.totalItens) {
        resultsCount.textContent = estado.totalItens.toLocaleString("pt-BR") + " títulos";
      } else {
        resultsCount.textContent = animes.length + " títulos";
      }

      showResults();
      renderPaginacao();

    } catch (erro) {
      console.error("❌ Erro:", erro);
      if (erro.message.includes("429")) {
        showError("Muitas requisições. Aguarde alguns segundos e tente de novo.");
      } else if (erro.message.includes("Failed to fetch")) {
        showError("Sem conexão com a API. Use o Live Server e verifique sua internet.");
      } else {
        showError("Erro ao buscar: " + erro.message);
      }
    }
  }

  // ── Nova busca (reseta para página 1) ──────────────────────
  function iniciarBusca() {
    estado.query  = searchInput.value.trim();
    estado.tipo   = filterType.value;
    estado.status = filterStatus.value;
    estado.genero = filterGenre.value;
    estado.ordem  = filterOrder.value;
    estado.pagina = 1;
    estado.modoTop = !estado.query;

    sectionTitle.textContent = estado.query
      ? 'Resultados para "' + estado.query + '"'
      : "Top Animes";

    buscarAnimes();
  }

  // ── Event listeners ────────────────────────────────────────
  searchBtn.addEventListener("click", iniciarBusca);
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") iniciarBusca();
  });

  [filterType, filterStatus, filterGenre, filterOrder].forEach(function (sel) {
    sel.addEventListener("change", iniciarBusca);
  });

  clearFilters.addEventListener("click", function () {
    filterType.value = ""; filterStatus.value = "";
    filterGenre.value = ""; filterOrder.value = "score";
    searchInput.value = "";
    estado.query = ""; estado.modoTop = true;
    sectionTitle.textContent = "Top Animes";
    iniciarBusca();
  });

  // Carrega top animes ao abrir
  buscarAnimes();
});
