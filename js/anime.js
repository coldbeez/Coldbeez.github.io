document.querySelectorAll(".rating").forEach(ratingEl => {
  const rating = parseFloat(ratingEl.dataset.rating);
  let stars = "";

  for (let i = 1; i <= 10; i++) {
    if (rating >= i) {
      stars += "★";
    } else if (rating >= i - 0.5) {
      stars += "☆"; // setengah (visual sederhana dulu)
    } else {
      stars += "✩";
    }
  }

  ratingEl.innerText = stars;
});

document.querySelectorAll(".card-menu").forEach(menu => {
  menu.addEventListener("click", e => {
    e.stopPropagation();
    const dropdown = menu.parentElement.querySelector(".menu-dropdown");
    dropdown.style.display =
      dropdown.style.display === "flex" ? "none" : "flex";
  });
});

document.getElementById("addAnime").addEventListener("click", () => {
  const title = prompt("Judul anime?");
  const rating = prompt("Rating (0–10, boleh 8.5):");

  if (!title || !rating) return;

  const card = document.createElement("div");
  card.className = "anime-card";
  card.innerHTML = `
    <div class="card-menu">⋮</div>
    <img src="https://via.placeholder.com/300x420">
    <div class="card-body">
      <h3>${title}</h3>
      <div class="rating" data-rating="${rating}"></div>
    </div>
    <div class="menu-dropdown">
      <button>Edit</button>
      <button class="danger">Hapus</button>
    </div>
  `;

  document.getElementById("animeGrid")
    .insertBefore(card, document.getElementById("addAnime"));

  location.reload();
});
