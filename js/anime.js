const grid = document.getElementById("animeGrid");
const addBtn = document.getElementById("addAnime");

// ===== ADD CARD =====
addBtn.addEventListener("click", () => {
  const title = prompt("Judul anime?");
  if (!title) return;

  const cardHTML = `
    <div class="anime-card">
      <div class="card-menu">⋮</div>

      <img src="images/placeholder.jpg">

      <div class="card-body">
        <h3>${title}</h3>
      </div>

      <div class="menu-dropdown">
        <button>Edit</button>
        <button class="danger">Hapus</button>
      </div>
    </div>
  `;

  grid.insertAdjacentHTML("beforeend", cardHTML);
});

document.addEventListener("click", e => {
  const menu = e.target.closest(".card-menu");
  if (!menu) return;

  e.stopPropagation();
  const dropdown = menu.parentElement.querySelector(".menu-dropdown");
  dropdown.style.display =
    dropdown.style.display === "flex" ? "none" : "flex";
});

// Tutup menu kalau klik di luar
document.addEventListener("click", () => {
  document.querySelectorAll(".menu-dropdown").forEach(m => {
    m.style.display = "none";
  });
});
