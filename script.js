// header

function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

function updateHeaderVisibility() {
  let scrollThreshold = window.matchMedia("(max-width: 800px)").matches
    ? 31 * 16
    : 51 * 16;

  if (window.scrollY > scrollThreshold) {
    document.querySelector(".fixed-header").style.top = "0";
  } else {
    document.querySelector(".fixed-header").style.top = "-4rem";
  }
}

window.addEventListener("scroll", updateHeaderVisibility);

updateHeaderVisibility();

// filter

document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filters li");
  const gridElements = document.querySelectorAll(
    ".grid-container .grid-element"
  );

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((el) => el.classList.remove("current"));
      button.classList.add("current");

      const filterValue = button.textContent.trim();

      gridElements.forEach((element) => {
        const filters = element
          .getAttribute("data-filter")
          .split(",")
          .map((f) => f.trim());

        if (filterValue === "all" || filters.some((f) => f === filterValue)) {
          element.classList.remove("hidden");
        } else {
          element.classList.add("hidden");
        }
      });
    });
  });
});

// modal

let currentModal = null;

function openModal(modalId) {
  const modal = document.getElementById(modalId);

  if (modal) {
    if (currentModal) {
      closeModal();
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    currentModal = modal;
  }
}

function closeModal() {
  if (currentModal) {
    currentModal.style.display = "none";
    document.body.style.overflow = "";
    stopVideo(currentModal);

    currentModal = null;
  }
}

function stopVideo(modal) {
  const video = modal.querySelector("video");

  if (video) {
    video.pause();
  }
}

window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    closeModal();
  }
};

// carousel

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
