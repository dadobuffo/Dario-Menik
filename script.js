// HEADER E MENU MOBILE

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const body = document.body;

  // Funzione per aprire il menu mobile (toglie solo overflow)
  function openMenu() {
    body.style.overflow = "hidden";
  }

  // Funzione per chiudere il menu mobile (ripristina overflow)
  function closeMenu() {
    body.style.overflow = "";
  }

  // Aggiungi/rimuovi classe active al toggle (CSS gestisce la visibilità)
  if (menuToggle) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isActive = mobileOverlay.classList.contains("active");

      if (isActive) {
        menuToggle.classList.remove("active");
        mobileOverlay.classList.remove("active");
        closeMenu();
      } else {
        menuToggle.classList.add("active");
        mobileOverlay.classList.add("active");
        openMenu();
      }
    });
  }

  // Chiudi menu cliccando su un link
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      menuToggle.classList.remove("active");
      mobileOverlay.classList.remove("active");
      closeMenu();
    });
  });

  // Chiudi menu cliccando fuori dall'overlay
  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", function (e) {
      if (e.target === mobileOverlay) {
        menuToggle.classList.remove("active");
        mobileOverlay.classList.remove("active");
        closeMenu();
      }
    });
  }

  // Chiudi menu con ESC
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      mobileOverlay &&
      mobileOverlay.classList.contains("active")
    ) {
      menuToggle.classList.remove("active");
      mobileOverlay.classList.remove("active");
      closeMenu();
    }
  });

  // HEADER FISSO (per desktop)
  function updateHeaderVisibility() {
    const fixedHeader = document.querySelector(".fixed-header");
    if (!fixedHeader) return;

    // Calcola soglia in base alla dimensione dello schermo
    let scrollThreshold = window.matchMedia("(max-width: 800px)").matches
      ? 496
      : 816;

    // Aggiorna la posizione dell'header fisso
    if (window.scrollY > scrollThreshold) {
      fixedHeader.style.top = "0";
    } else {
      fixedHeader.style.top = "-64px";
    }
  }

  // Inizializza l'header fisso solo su desktop (>768px)
  if (window.innerWidth > 768) {
    window.addEventListener("scroll", updateHeaderVisibility);
    updateHeaderVisibility(); // Chiamata iniziale
  }

  // ARROW ICON

  const heroArrow = document.querySelector(".hero-arrow-icon");
  if (heroArrow) {
    heroArrow.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector("#about");
      if (target) {
        const offset = window.innerWidth <= 768 ? 70 : 0;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  }

  // MODALS

  const openButtons = document.querySelectorAll(".open-modal");
  const modal = document.getElementById("videoModal");

  if (modal) {
    const video = modal.querySelector("video");
    const sourceWebm = document.getElementById("videoSourceWebm");
    const sourceMp4 = document.getElementById("videoSourceMp4");

    function closeModal() {
      video.pause();
      modal.classList.remove("show");
      document.body.style.overflow = "";
      setTimeout(() => modal.close(), 300);
    }

    openButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (mobileOverlay.classList.contains("active")) {
          menuToggle.classList.remove("active");
          mobileOverlay.classList.remove("active");
          closeMenu();
        }

        video.poster = btn.dataset.poster;
        if (sourceWebm) sourceWebm.src = btn.dataset.webm;
        if (sourceMp4) sourceMp4.src = btn.dataset.mp4;
        video.load();

        modal.showModal();
        requestAnimationFrame(() => modal.classList.add("show"));
        document.body.style.overflow = "hidden";
      });
    });

    const closeModalBtn = modal.querySelector(".close-modal");
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (e) => {
      const rect = modal.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        closeModal();
      }
    });

    modal.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeModal();
    });
  }

  // GIF PAUSE
  const videos = document.querySelectorAll(".video-stop");
  if (videos.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch((e) => console.log("Playback prevented:", e));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.1 }
    );

    videos.forEach((video) => observer.observe(video));
  }

  // CAROUSEL

  document.querySelectorAll(".carousel-container").forEach((container) => {
    const slides = container.querySelectorAll(".slide");
    const prevBtn = container.querySelector(".carousel-prev");
    const nextBtn = container.querySelector(".carousel-next");
    const carousel = container.querySelector(".carousel");
    let current = 0;

    function updateSlides() {
      slides.forEach((slide, i) => {
        const content = slide.querySelector(".box-content");
        slide.classList.remove("active", "left", "right");

        if (i === current) {
          slide.classList.add("active");
          if (content) content.style.opacity = "1";
        } else if (i === (current - 1 + slides.length) % slides.length) {
          slide.classList.add("left");
          if (content) content.style.opacity = "0";
        } else if (i === (current + 1) % slides.length) {
          slide.classList.add("right");
          if (content) content.style.opacity = "0";
        } else if (content) {
          content.style.opacity = "0";
        }
      });
    }

    function nextSlide() {
      current = (current + 1) % slides.length;
      updateSlides();
    }

    function prevSlide() {
      current = (current - 1 + slides.length) % slides.length;
      updateSlides();
    }

    if (prevBtn) prevBtn.addEventListener("click", prevSlide);
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);

    if (carousel) {
      let startX = 0;
      carousel.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
      });
      carousel.addEventListener("touchend", (e) => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 50) {
          diff < 0 ? nextSlide() : prevSlide();
        }
      });
    }

    updateSlides();
  });
});
