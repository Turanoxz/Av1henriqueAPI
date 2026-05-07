// ============================================================
//  AniSearch — detalhes.js
// ============================================================

const BASE_URL = "https://api.jikan.moe/v4";

// ── Funções de favoritos (localStorage) ───────────────────────
function getFavoritos() {
  try {
    return JSON.parse(localStorage.getItem("anisearch_favoritos")) || [];
  } catch (e) {
    return [];
  }
}

function salvarFavoritos(lista) {
  localStorage.setItem("anisearch_favoritos", JSON.stringify(lista));
}

function isFavorito(id) {
  return getFavoritos().some(function (a) { return a.mal_id === id; });
}

function toggleFavorito(anime) {
  var lista = getFavoritos();
  var idx = lista.findIndex(function (a) { return a.mal_id === anime.mal_id; });
  if (idx >= 0) {
    lista.splice(idx, 1); // remove
  } else {
    // Salva apenas o necessário para a página de favoritos
    lista.push({
      mal_id:  anime.mal_id,
      title:   anime.title_english || anime.title,
      title_jp: anime.title_japanese || "",
      image:   anime.images && anime.images.jpg ? anime.images.jpg.large_image_url || anime.images.jpg.image_url : "",
      score:   anime.score,
      type:    anime.type,
      year:    anime.year,
      episodes: anime.episodes,
      status:  anime.status
    });
  }
  salvarFavoritos(lista);
  return idx < 0; // true = foi adicionado, false = foi removido
}

// ── Atualiza visual do botão de favorito ──────────────────────
function atualizarBotaoFav(btn, favoritado) {
  if (favoritado) {
    btn.innerHTML = '<i class="bi bi-heart-fill"></i> Favoritado';
    btn.classList.add("btn-fav-ativo");
    btn.classList.remove("btn-fav");
  } else {
    btn.innerHTML = '<i class="bi bi-heart"></i> Favoritar';
    btn.classList.add("btn-fav");
    btn.classList.remove("btn-fav-ativo");
  }
}

// ── Main ───────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async function () {

  var params = new URLSearchParams(window.location.search);
  var id = parseInt(params.get("id"));

  if (!id) {
    mostrarErro("ID de anime não informado na URL.");
    return;
  }

  var loadingState = document.getElementById("loadingState");
  var errorState   = document.getElementById("errorState");
  var errorMessage = document.getElementById("errorMessage");
  var animeContent = document.getElementById("animeContent");

  function mostrarErro(msg) {
    loadingState.classList.add("d-none");
    animeContent.classList.add("d-none");
    errorMessage.textContent = msg;
    errorState.classList.remove("d-none");
  }

  try {
    var response = await fetch(BASE_URL + "/anime/" + id + "/full");
    if (!response.ok) throw new Error("HTTP " + response.status);

    var json = await response.json();
    var anime = json.data;

    document.title = "AniSearch — " + (anime.title_english || anime.title);

    document.getElementById("detailTitle").textContent = anime.title_english || anime.title || "Sem título";

    var titleJp = document.getElementById("detailTitleJp");
    if (anime.title_japanese) {
      titleJp.textContent = anime.title_japanese;
    } else {
      titleJp.style.display = "none";
    }

    var poster = document.getElementById("detailPoster");
    poster.src = anime.images && anime.images.jpg && anime.images.jpg.large_image_url
      ? anime.images.jpg.large_image_url : "https://placehold.co/225x318?text=Sem+Imagem";
    poster.alt = anime.title;

    var banner = document.getElementById("detailBanner");
    if (anime.images && anime.images.jpg && anime.images.jpg.large_image_url) {
      banner.style.backgroundImage = 'url("' + anime.images.jpg.large_image_url + '")';
    }

    document.getElementById("detailScore").textContent      = anime.score ? "★ " + anime.score.toFixed(1) : "N/A";
    document.getElementById("detailRank").textContent       = anime.rank ? "#" + anime.rank.toLocaleString("pt-BR") : "N/A";
    document.getElementById("detailPopularity").textContent = anime.popularity ? "#" + anime.popularity.toLocaleString("pt-BR") : "N/A";
    document.getElementById("detailMembers").textContent    = anime.members ? anime.members.toLocaleString("pt-BR") : "N/A";
    document.getElementById("detailFavorites").textContent  = anime.favorites ? anime.favorites.toLocaleString("pt-BR") : "N/A";

    var badges = document.getElementById("detailBadges");
    badges.innerHTML = "";
    if (anime.type)   badges.innerHTML += '<span class="detail-badge badge-type">'   + anime.type   + '</span>';
    if (anime.status) badges.innerHTML += '<span class="detail-badge badge-status">' + anime.status + '</span>';
    if (anime.rating) badges.innerHTML += '<span class="detail-badge badge-rating">' + anime.rating + '</span>';

    document.getElementById("detailSynopsis").textContent = anime.synopsis
      ? anime.synopsis.replace("[Written by MAL Rewrite]", "").trim()
      : "Sinopse não disponível.";

    var infos = [
      { label: "Episódios", value: anime.episodes ? anime.episodes + " ep." : "?" },
      { label: "Duração",   value: anime.duration || "?" },
      { label: "Início",    value: anime.aired && anime.aired.from ? new Date(anime.aired.from).toLocaleDateString("pt-BR") : "?" },
      { label: "Estúdio",   value: anime.studios && anime.studios.length ? anime.studios.map(function(s){ return s.name; }).join(", ") : "?" },
      { label: "Fonte",     value: anime.source || "?" },
      { label: "Temporada", value: anime.season ? anime.season.charAt(0).toUpperCase() + anime.season.slice(1) + " " + (anime.year || "") : "?" },
    ];
    document.getElementById("detailInfoGrid").innerHTML = infos.map(function (i) {
      return '<div class="info-item"><span class="info-label">' + i.label + '</span><span class="info-value">' + i.value + '</span></div>';
    }).join("");

    var genresDiv = document.getElementById("detailGenres");
    if (anime.genres && anime.genres.length) {
      genresDiv.innerHTML = anime.genres.map(function (g) {
        return '<span class="genre-tag">' + g.name + '</span>';
      }).join("");
    } else {
      document.getElementById("genresSection").classList.add("d-none");
    }

    if (anime.trailer && anime.trailer.embed_url) {
      document.getElementById("trailerSection").classList.remove("d-none");
      document.getElementById("detailTrailer").src = anime.trailer.embed_url;
    }

    document.getElementById("detailMALLink").href = anime.url || "https://myanimelist.net";

    // ── Botão de favorito ────────────────────────────────────
    var btnFav = document.getElementById("btnFavoritar");
    atualizarBotaoFav(btnFav, isFavorito(id));

    btnFav.addEventListener("click", function () {
      var foiAdicionado = toggleFavorito(anime);
      atualizarBotaoFav(btnFav, foiAdicionado);

      // Toast de feedback
      var toast = document.getElementById("favToast");
      var toastMsg = document.getElementById("favToastMsg");
      toastMsg.textContent = foiAdicionado
        ? "❤ Adicionado aos favoritos!"
        : "💔 Removido dos favoritos.";
      toast.classList.add("show");
      setTimeout(function () { toast.classList.remove("show"); }, 2500);
    });

    loadingState.classList.add("d-none");
    animeContent.classList.remove("d-none");

  } catch (erro) {
    console.error("❌ Erro:", erro);
    if (erro.message.includes("429")) {
      mostrarErro("Muitas requisições. Aguarde alguns segundos e recarregue.");
    } else if (erro.message.includes("Failed to fetch")) {
      mostrarErro("Sem conexão com a API. Use o Live Server.");
    } else {
      mostrarErro("Erro ao carregar: " + erro.message);
    }
  }
});
