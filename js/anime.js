const grid = document.getElementById("animeGrid");
const addBtn = document.getElementById("addAnime");

const modal = document.getElementById("animeModal");
const titleInput = document.getElementById("animeTitle");
const starContainer = document.getElementById("starRating");
const ratingText = document.getElementById("ratingValue");

const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

let currentRating = 0;

/* ===== OPEN MODAL ===== */
addBtn.addEventListener("click", () => {
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

  const cardHTML = `
    <div class="anime-card">
      <div class="card-menu">⋮</div>

      <img src="images/anime/placeholder.jpg">

      <div class="card-body">
        <h3>${title}</h3>
        <p>⭐ ${currentRating}</p>
      </div>

      <div class="menu-dropdown">
        <button>Edit</button>
        <button class="danger">Hapus</button>
      </div>
    </div>
  `;

  grid.insertAdjacentHTML("beforeend", cardHTML);
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

