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
let slideIndex = 1;

function openModal(modalId) {
  const modal = document.getElementById(modalId);

  if (modal) {
    if (currentModal) closeModal();

    modal.style.display = "flex";
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    currentModal = modal;

    slideIndex = 1;
    showSlides(slideIndex);

    const slideContainer =
      modal.querySelector(".modal-slideshow-container") || modal;
    slideContainer.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    slideContainer.addEventListener("touchend", handleTouchEnd, {
      passive: true,
    });
  }
}

function closeModal() {
  if (!currentModal) return;

  const slideContainer =
    currentModal.querySelector(".modal-slideshow-container") || currentModal;
  slideContainer.removeEventListener("touchstart", handleTouchStart);
  slideContainer.removeEventListener("touchend", handleTouchEnd);

  currentModal.style.display = "none";
  currentModal.classList.remove("active");
  document.body.style.overflow = "";

  stopVideo(currentModal);
  currentModal = null;
}

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  const activeModal = document.querySelector(".modal.active");
  if (!activeModal) return;

  const slides = activeModal.querySelectorAll(".mySlides");
  const dots = activeModal.querySelectorAll(".dot");

  if (slides.length === 0) return;

  stopVideo(activeModal);

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  slides.forEach((slide) => {
    slide.style.display = "none";
  });

  dots.forEach((dot) => {
    dot.classList.remove("active");
  });

  slides[slideIndex - 1].style.display = "block";
  if (dots[slideIndex - 1]) {
    dots[slideIndex - 1].classList.add("active");
  }
}
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(event) {
  touchStartX = event.changedTouches[0].screenX;
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].screenX;
  handleGesture();
}

function handleGesture() {
  const swipeThreshold = 50;

  if (touchEndX < touchStartX - swipeThreshold) {
    plusSlides(1);
  } else if (touchEndX > touchStartX + swipeThreshold) {
    plusSlides(-1);
  }
}

window.addEventListener("click", function (event) {
  if (currentModal && event.target === currentModal) {
    closeModal();
  }
});

function stopVideo(modal) {
  const videos = modal.querySelectorAll("video");
  videos.forEach((video) => {
    video.pause();
  });
}

// pause videos when not in view

const videos = document.querySelectorAll(".anim-video");

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
};

const callback = (entries) => {
  entries.forEach((entry) => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play().catch((e) => console.log("Playback prevented:", e));
    } else {
      video.pause();
    }
  });
};

const observer = new IntersectionObserver(callback, options);

videos.forEach((video) => {
  observer.observe(video);
});

// temporary modal

window.onload = function () {
  document.getElementById("temp-modal").style.display = "flex";
};

function closeModal() {
  document.getElementById("temp-modal").style.display = "none";
}

document.getElementById("temp-modal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});
