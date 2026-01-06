const imagePicker = document.getElementById("imagePicker");
const imagePreview = document.getElementById("imagePreview");
const imageFileInput = document.getElementById("animeImageFile");
const imageUrlInput = document.getElementById("animeImageUrl");
const resetImageBtn = document.getElementById("resetImage");

let currentImage = "images/anime/placeholder.jpg";

imagePicker.addEventListener("click", () => {
  imageFileInput.click();
});

imageFileInput.addEventListener("change", () => {
  const file = imageFileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    currentImage = reader.result;
    imagePreview.src = currentImage;
  };
  reader.readAsDataURL(file);
});

imageUrlInput.addEventListener("input", () => {
  const url = imageUrlInput.value.trim();
  if (!url) return;

  currentImage = url;
  imagePreview.src = url;
});

imagePicker.addEventListener("dragover", e => {
  e.preventDefault();
  imagePicker.style.borderColor = "#8ec5fc";
});

imagePicker.addEventListener("dragleave", () => {
  imagePicker.style.borderColor = "#444";
});

imagePicker.addEventListener("drop", e => {
  e.preventDefault();
  imagePicker.style.borderColor = "#444";

  const file = e.dataTransfer.files[0];
  if (!file || !file.type.startsWith("image")) return;

  const reader = new FileReader();
  reader.onload = () => {
    currentImage = reader.result;
    imagePreview.src = currentImage;
  };
  reader.readAsDataURL(file);
});

resetImageBtn.addEventListener("click", () => {
  currentImage = "images/anime/placeholder.jpg";
  imagePreview.src = currentImage;
  imageFileInput.value = "";
  imageUrlInput.value = "";
});

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

  // ⬇️ TAMBAHKAN CARD +
  grid.appendChild(addBtn);
}


/* ===== OPEN MODAL ===== */
addBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  titleInput.value = "";
  currentRating = 0;
  editingCard = null;

  currentImage = "images/anime/placeholder.jpg";
  imagePreview.src = currentImage;
  imageFileInput.value = "";
  imageUrlInput.value = "";
  
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

  if (editingCard !== null) {
    const anime = animeList.find(a => a.id === editingCard);
    anime.title = title;
    anime.rating = currentRating;
    editingCard = null;
  } else {
    animeList.push({
    id: Date.now(),
    title,
    rating: currentRating,
    image: currentImage
  });


  localStorage.setItem("animeList", JSON.stringify(animeList));
  modal.classList.add("hidden");
  renderAnime();
});

document.addEventListener("click", e => {

  /* === MENU ⋮ === */
  const menuBtn = e.target.closest(".card-menu");
  if (menuBtn) {
    e.stopPropagation();

    const card = menuBtn.closest(".anime-card");
    const dropdown = card.querySelector(".menu-dropdown");

    document.querySelectorAll(".menu-dropdown").forEach(m => {
      if (m !== dropdown) m.style.display = "none";
    });

    dropdown.style.display =
      dropdown.style.display === "flex" ? "none" : "flex";

    return;
  }

  /* === EDIT / DELETE === */
  const actionBtn = e.target.closest("[data-action]");
  if (actionBtn) {
    const card = actionBtn.closest(".anime-card");
    const id = Number(card.dataset.id);

    if (actionBtn.dataset.action === "delete") {
      animeList = animeList.filter(a => a.id !== id);
      localStorage.setItem("animeList", JSON.stringify(animeList));
      renderAnime();
    }

    if (actionBtn.dataset.action === "edit") {
    const anime = animeList.find(a => a.id === id);

    modal.classList.remove("hidden");
    titleInput.value = anime.title;
    currentRating = anime.rating;
    editingCard = id;

    currentImage = anime.image;
    imagePreview.src = currentImage;
    imageUrlInput.value = "";

    updateStars();
    }


    return;
  }

  /* === CLICK DI LUAR === */
  document.querySelectorAll(".menu-dropdown").forEach(m => {
    m.style.display = "none";
  });
});

renderAnime();
