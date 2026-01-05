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
