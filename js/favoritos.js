// ============================================================
//  AniSearch — favoritos.js
// ============================================================

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

function removerFavorito(id) {
  var lista = getFavoritos().filter(function (a) { return a.mal_id !== id; });
  salvarFavoritos(lista);
  return lista;
}

function mostrarToast(msg) {
  var toast = document.getElementById("favToast");
  var toastMsg = document.getElementById("favToastMsg");
  toastMsg.textContent = msg;
  toast.classList.add("show");
  setTimeout(function () { toast.classList.remove("show"); }, 2500);
}

document.addEventListener("DOMContentLoaded", function () {

  var emptyFav    = document.getElementById("emptyFav");
  var favSection  = document.getElementById("favSection");
  var favGrid     = document.getElementById("favGrid");
  var favSubtitle = document.getElementById("favSubtitle");
  var btnLimpar   = document.getElementById("btnLimparTudo");
  var modalOverlay = document.getElementById("modalConfirm");
  var modalCancelar  = document.getElementById("modalCancelar");
  var modalConfirmar = document.getElementById("modalConfirmar");

  function renderFavoritos() {
    var lista = getFavoritos();
    favGrid.innerHTML = "";

    if (lista.length === 0) {
      emptyFav.classList.remove("d-none");
      favSection.classList.add("d-none");
      return;
    }

    favSubtitle.textContent = lista.length + " anime(s) salvo(s) neste navegador";
    emptyFav.classList.add("d-none");
    favSection.classList.remove("d-none");

    lista.forEach(function (anime) {
      var col = document.createElement("div");
      col.className = "col card-fade-in";

      var score = anime.score ? anime.score.toFixed(1) : "N/A";
      var image = anime.image || "https://placehold.co/225x318?text=Sem+Imagem";
      var title = anime.title || "Sem título";

      col.innerHTML =
        '<div class="anime-card fav-card">' +
          '<a href="detalhes.html?id=' + anime.mal_id + '" class="anime-card-link">' +
            '<div class="anime-card-img-wrapper">' +
              '<img src="' + image + '" alt="' + title + '" loading="lazy" />' +
              '<span class="anime-score">★ ' + score + '</span>' +
              '<span class="anime-type-badge">' + (anime.type || "?") + '</span>' +
            '</div>' +
            '<div class="anime-card-body">' +
              '<h6 class="anime-title">' + title + '</h6>' +
              '<p class="anime-meta">' + (anime.year || "?") + '</p>' +
            '</div>' +
          '</a>' +
          '<button class="btn-remover-fav" data-id="' + anime.mal_id + '" title="Remover dos favoritos">' +
            '<i class="bi bi-heart-fill"></i>' +
          '</button>' +
        '</div>';

      col.querySelector(".btn-remover-fav").addEventListener("click", function (e) {
        e.preventDefault();
        var id = parseInt(this.getAttribute("data-id"));
        removerFavorito(id);
        mostrarToast("💔 Removido dos favoritos.");
        renderFavoritos();
      });

      favGrid.appendChild(col);
    });
  }

  // Botão limpar tudo → abre modal
  btnLimpar.addEventListener("click", function () {
    modalOverlay.classList.remove("d-none");
  });

  modalCancelar.addEventListener("click", function () {
    modalOverlay.classList.add("d-none");
  });

  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) modalOverlay.classList.add("d-none");
  });

  modalConfirmar.addEventListener("click", function () {
    salvarFavoritos([]);
    modalOverlay.classList.add("d-none");
    mostrarToast("🗑 Todos os favoritos foram removidos.");
    renderFavoritos();
  });

  renderFavoritos();
});
