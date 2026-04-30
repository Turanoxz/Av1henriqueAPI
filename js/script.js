// ============================================================
//  AniSearch — script.js
// ============================================================

const BASE_URL = "https://api.jikan.moe/v4";

document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ script.js carregado com sucesso!");

  var searchInput    = document.getElementById("searchInput");
  var searchBtn      = document.getElementById("searchBtn");
  var animeGrid      = document.getElementById("animeGrid");
  var loadingState   = document.getElementById("loadingState");
  var errorState     = document.getElementById("errorState");
  var errorMessage   = document.getElementById("errorMessage");
  var emptyState     = document.getElementById("emptyState");
  var initialState   = document.getElementById("initialState");
  var resultsSection = document.getElementById("resultsSection");
  var resultsCount   = document.getElementById("resultsCount");

  if (!searchBtn) {
    console.error("❌ Botão #searchBtn não encontrado no HTML!");
    return;
  }
  console.log("✅ Elementos do DOM encontrados!");

  function showState(state) {
    loadingState.classList.add("d-none");
    errorState.classList.add("d-none");
    emptyState.classList.add("d-none");
    initialState.classList.add("d-none");
    resultsSection.classList.add("d-none");

    if (state === "loading")  loadingState.classList.remove("d-none");
    if (state === "error")    errorState.classList.remove("d-none");
    if (state === "empty")    emptyState.classList.remove("d-none");
    if (state === "initial")  initialState.classList.remove("d-none");
    if (state === "results")  resultsSection.classList.remove("d-none");
  }

  function criarCard(anime) {
    var col = document.createElement("div");
    col.className = "col";

    var score = anime.score ? anime.score.toFixed(1) : "N/A";
    var year  = anime.year || "?";
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
          '</div>' +
          '<div class="anime-card-body">' +
            '<h6 class="anime-title">' + title + '</h6>' +
            '<p class="anime-meta">' + (anime.type || "Anime") + ' · ' + year + '</p>' +
          '</div>' +
        '</div>' +
      '</a>';

    return col;
  }

  async function buscar() {
    var query = searchInput.value.trim();
    console.log("🔍 Buscando por:", query);

    if (!query) {
      alert("Digite o nome de um anime para buscar!");
      return;
    }

    showState("loading");

    try {
      var url = BASE_URL + "/anime?q=" + encodeURIComponent(query) + "&limit=20&sfw=true";
      console.log("📡 Requisição para:", url);

      var response = await fetch(url);
      console.log("📥 Status da resposta:", response.status);

      if (!response.ok) {
        throw new Error("Erro HTTP: " + response.status);
      }

      var json = await response.json();
      var animes = json.data;
      console.log("✅ Animes recebidos:", animes.length);

      if (!animes || animes.length === 0) {
        showState("empty");
        return;
      }

      animeGrid.innerHTML = "";
      animes.forEach(function (anime) {
        animeGrid.appendChild(criarCard(anime));
      });

      resultsCount.textContent = animes.length + " título(s) encontrado(s)";
      showState("results");

    } catch (erro) {
      console.error("❌ Erro na busca:", erro);

      if (erro.message.includes("429")) {
        errorMessage.textContent = "Muitas requisições seguidas. Aguarde alguns segundos e tente de novo.";
      } else if (erro.message.includes("Failed to fetch")) {
        errorMessage.textContent = "Não foi possível conectar à API. Verifique sua internet ou abra pelo Live Server.";
      } else {
        errorMessage.textContent = "Erro: " + erro.message;
      }

      showState("error");
    }
  }

  searchBtn.addEventListener("click", buscar);

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") buscar();
  });

  showState("initial");
  console.log("✅ Pronto para buscar!");
});
