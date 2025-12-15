const modal = document.getElementById("gallery-modal");
const modalImg = document.getElementById("gallery-modal-img");

document.addEventListener("click", (e) => {
  const img = e.target.closest(".gallery-img");

  // Open
  if (img) {
    modalImg.src = img.src;
    modalImg.alt = img.alt || "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    return;
  }

  // Close when clicking the large view / overlay
  if (e.target === modal || e.target === modalImg) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
  }
});

// Optional: close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
  }
});
