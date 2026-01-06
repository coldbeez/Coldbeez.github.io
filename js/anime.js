let animeList = JSON.parse(localStorage.getItem("animeList")) || [];

const grid = document.getElementById("animeGrid");
const addBtn = document.getElementById("addAnime");

const modal = document.getElementById("animeModal");
const titleInput = document.getElementById("animeTitle");
const starContainer = document.getElementById("starRating");
const ratingText = document.getElementById("ratingValue");

const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

let currentRating = 0;
let editingCard = null;

function renderAnime() {
  grid.innerHTML = "";

  animeList.forEach(anime => {
    const card = document.createElement("div");
    card.className = "anime-card";
    card.dataset.id = anime.id;

    card.innerHTML = `
      <div class="card-menu">⋮</div>

      <img src="${anime.image}">

      <div class="card-body">
        <h3>${anime.title}</h3>
        <p>⭐ ${anime.rating}</p>
      </div>

      <div class="menu-dropdown">
        <button data-action="edit">Edit</button>
        <button data-action="delete" class="danger">Hapus</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* ===== OPEN MODAL ===== */
addBtn.addEventListener("click", () => {
  editingCard = null;
  modal.classList.remove("hidden");
  titleInput.value = "";
  currentRating = 0;
  updateStars();
});

/* ===== CLOSE MODAL ===== */
cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

/* ===== CREATE STARS (1–10, HALF) ===== */
for (let i = 1; i <= 10; i++) {
  const star = document.createElement("span");
  star.classList.add("star");
  star.innerHTML = "★";
  star.dataset.value = i;

  star.addEventListener("click", e => {
    const rect = star.getBoundingClientRect();
    const half = e.clientX - rect.left < rect.width / 2;
    currentRating = half ? i - 0.5 : i;
    updateStars();
  });

  starContainer.appendChild(star);
}

/* ===== UPDATE STAR UI ===== */
function updateStars() {
  document.querySelectorAll(".star").forEach(star => {
    const value = Number(star.dataset.value);
    star.classList.toggle("active", value <= currentRating);
  });
  ratingText.textContent = `Rating: ${currentRating}`;
}

/* ===== SAVE CARD ===== */
saveBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  if (!title || currentRating === 0) return;

  if (editingCard) {
    const anime = animeList.find(a => a.id === editingCard);
    anime.title = title;
    anime.rating = currentRating;
    editingCard = null;
  } else {
    animeList.push({
      id: Date.now(),
      title,
      rating: currentRating,
      image: "images/anime/placeholder.jpg"
    });
  }

  localStorage.setItem("animeList", JSON.stringify(animeList));
  modal.classList.add("hidden");
  renderAnime();
});

    // ===== MODE EDIT =====
    editingCard.querySelector("h3").textContent = title;
    editingCard.querySelector("p").textContent = `⭐ ${currentRating}`;
    editingCard = null;
  } else {

    grid.insertAdjacentHTML("beforeend", cardHTML);
  }

  modal.classList.add("hidden");
});

/* ===== MENU ⋮ (EVENT DELEGATION) ===== */
document.addEventListener("click", e => {
  const menuBtn = e.target.closest(".card-menu");

  if (!menuBtn) {
    document.querySelectorAll(".menu-dropdown").forEach(m => {
      m.style.display = "none";
    });
    return;
  }

  e.stopPropagation();

  const card = menuBtn.closest(".anime-card");
  const dropdown = card.querySelector(".menu-dropdown");

  document.querySelectorAll(".menu-dropdown").forEach(m => {
    if (m !== dropdown) m.style.display = "none";
  });

  dropdown.style.display =
    dropdown.style.display === "flex" ? "none" : "flex";
});

document.addEventListener("click", e => {
  const actionBtn = e.target.closest("[data-action]");
  if (!actionBtn) return;

  const card = actionBtn.closest(".anime-card");

  /* ===== HAPUS ===== */
  if (actionBtn.dataset.action === "delete") {
  const id = Number(card.dataset.id);

  animeList = animeList.filter(a => a.id !== id);
  localStorage.setItem("animeList", JSON.stringify(animeList));

  renderAnime();
}

  /* ===== EDIT ===== */
  if (actionBtn.dataset.action === "edit") {
  const id = Number(card.dataset.id);
  const anime = animeList.find(a => a.id === id);

  modal.classList.remove("hidden");
  titleInput.value = anime.title;
  currentRating = anime.rating;
  updateStars();

  editingCard = id;
}

renderAnime();
