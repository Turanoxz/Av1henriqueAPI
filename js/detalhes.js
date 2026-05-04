// ============================================================
//  AniSearch — detalhes.js
//  Lê o ?id= da URL e busca os detalhes do anime na Jikan API
// ============================================================

const BASE_URL = "https://api.jikan.moe/v4";

document.addEventListener("DOMContentLoaded", async function () {

  // ── Pega o ID da URL ───────────────────────────────────────
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");

  console.log("🎌 ID do anime:", id);

  if (!id) {
    mostrarErro("ID de anime não informado na URL.");
    return;
  }

  // ── Elementos DOM ──────────────────────────────────────────
  var loadingState  = document.getElementById("loadingState");
  var errorState    = document.getElementById("errorState");
  var errorMessage  = document.getElementById("errorMessage");
  var animeContent  = document.getElementById("animeContent");

  function mostrarErro(msg) {
    loadingState.classList.add("d-none");
    animeContent.classList.add("d-none");
    errorMessage.textContent = msg;
    errorState.classList.remove("d-none");
  }

  // ── Busca os dados na API ──────────────────────────────────
  try {
    var url = BASE_URL + "/anime/" + id + "/full";
    console.log("📡 Requisição:", url);

    var response = await fetch(url);

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    var json = await response.json();
    var anime = json.data;

    console.log("✅ Anime carregado:", anime.title);

    // ── Preenche os dados na página ────────────────────────
    document.title = "AniSearch — " + (anime.title_english || anime.title);

    // Título
    document.getElementById("detailTitle").textContent =
      anime.title_english || anime.title || "Sem título";

    // Título em japonês
    var titleJp = document.getElementById("detailTitleJp");
    if (anime.title_japanese) {
      titleJp.textContent = anime.title_japanese;
    } else {
      titleJp.style.display = "none";
    }

    // Poster
    var poster = document.getElementById("detailPoster");
    poster.src = anime.images && anime.images.jpg && anime.images.jpg.large_image_url
      ? anime.images.jpg.large_image_url
      : "https://placehold.co/225x318?text=Sem+Imagem";
    poster.alt = anime.title;

    // Banner de fundo borrado
    var banner = document.getElementById("detailBanner");
    if (anime.images && anime.images.jpg && anime.images.jpg.large_image_url) {
      banner.style.backgroundImage = 'url("' + anime.images.jpg.large_image_url + '")';
    }

    // Stats
    document.getElementById("detailScore").textContent =
      anime.score ? "★ " + anime.score.toFixed(1) : "N/A";
    document.getElementById("detailRank").textContent =
      anime.rank ? "#" + anime.rank.toLocaleString("pt-BR") : "N/A";
    document.getElementById("detailPopularity").textContent =
      anime.popularity ? "#" + anime.popularity.toLocaleString("pt-BR") : "N/A";
    document.getElementById("detailMembers").textContent =
      anime.members ? anime.members.toLocaleString("pt-BR") : "N/A";
    document.getElementById("detailFavorites").textContent =
      anime.favorites ? anime.favorites.toLocaleString("pt-BR") : "N/A";

    // Badges (tipo, status, classificação)
    var badges = document.getElementById("detailBadges");
    badges.innerHTML = "";
    if (anime.type)   badges.innerHTML += '<span class="detail-badge badge-type">'   + anime.type   + '</span>';
    if (anime.status) badges.innerHTML += '<span class="detail-badge badge-status">' + anime.status + '</span>';
    if (anime.rating) badges.innerHTML += '<span class="detail-badge badge-rating">' + anime.rating + '</span>';

    // Sinopse
    var synopsis = document.getElementById("detailSynopsis");
    synopsis.textContent = anime.synopsis
      ? anime.synopsis.replace("[Written by MAL Rewrite]", "").trim()
      : "Sinopse não disponível.";

    // Grid de informações
    var infoGrid = document.getElementById("detailInfoGrid");
    var infos = [
      { label: "Episódios",  value: anime.episodes ? anime.episodes + " ep." : "?" },
      { label: "Duração",    value: anime.duration || "?" },
      { label: "Início",     value: anime.aired && anime.aired.from ? new Date(anime.aired.from).toLocaleDateString("pt-BR") : "?" },
      { label: "Estúdio",    value: anime.studios && anime.studios.length ? anime.studios.map(function(s){ return s.name; }).join(", ") : "?" },
      { label: "Fonte",      value: anime.source || "?" },
      { label: "Temporada",  value: anime.season ? anime.season.charAt(0).toUpperCase() + anime.season.slice(1) + " " + (anime.year || "") : "?" },
    ];
    infoGrid.innerHTML = infos.map(function (info) {
      return '<div class="info-item"><span class="info-label">' + info.label + '</span><span class="info-value">' + info.value + '</span></div>';
    }).join("");

    // Gêneros
    var genresDiv = document.getElementById("detailGenres");
    if (anime.genres && anime.genres.length) {
      genresDiv.innerHTML = anime.genres.map(function (g) {
        return '<a href="index.html" class="genre-tag">' + g.name + '</a>';
      }).join("");
    } else {
      document.getElementById("genresSection").classList.add("d-none");
    }

    // Trailer
    if (anime.trailer && anime.trailer.embed_url) {
      var trailerSection = document.getElementById("trailerSection");
      var trailerIframe  = document.getElementById("detailTrailer");
      trailerSection.classList.remove("d-none");
      trailerIframe.src = anime.trailer.embed_url;
    }

    // Link MAL
    var malLink = document.getElementById("detailMALLink");
    malLink.href = anime.url || "https://myanimelist.net";

    // Exibe o conteúdo
    loadingState.classList.add("d-none");
    animeContent.classList.remove("d-none");

  } catch (erro) {
    console.error("❌ Erro:", erro);
    if (erro.message.includes("429")) {
      mostrarErro("Muitas requisições. Aguarde alguns segundos e recarregue a página.");
    } else if (erro.message.includes("Failed to fetch")) {
      mostrarErro("Sem conexão com a API. Verifique sua internet e use o Live Server.");
    } else {
      mostrarErro("Erro ao carregar: " + erro.message);
    }
  }
});
