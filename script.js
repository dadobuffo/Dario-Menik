function initHeader() {
  const header = document.querySelector(".fixed-header");
  const narrowDesktop = window.matchMedia("(max-width: 800px)");
  const mobile = window.matchMedia("(max-width: 768px)");

  if (header) {
    function updateHeader() {
      const threshold = narrowDesktop.matches ? 496 : 816;
      const visible = !mobile.matches && window.scrollY > threshold;
      header.classList.toggle("visible", visible);
      header.inert = !visible;
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    narrowDesktop.addEventListener("change", updateHeader);
    mobile.addEventListener("change", updateHeader);
    updateHeader();
  }

  const title = document.querySelector(".hero-title");
  if (title) {
    function updateScale() {
      const scale = 0.45 + 0.55 * ((window.innerWidth - 320) / (768 - 320));
      title.style.transform = `scale(${Math.min(Math.max(scale, 0.45), 1)})`;
    }

    window.addEventListener("resize", updateScale);
    updateScale();
  }
}

function initMobileMenu(updatePreviews) {
  const toggle = document.getElementById("menuToggle");
  const overlay = document.getElementById("mobileOverlay");

  if (!toggle || !overlay) return;

  const mobile = window.matchMedia("(max-width: 768px)");
  const links = [...overlay.querySelectorAll(".mobile-link")];
  const focusable = [toggle, ...links];
  const background = [...document.querySelectorAll("body > main, body > footer")];

  function setOpen(open, restoreFocus = true) {
    toggle.classList.toggle("active", open);
    overlay.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
    updatePreviews();
    background.forEach((element) => { element.inert = open; });

    if (open) links[0]?.focus();
    else if (restoreFocus) toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener("click", () => {
    setOpen(!overlay.classList.contains("active"));
  });
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) setOpen(false);
  });
  links.forEach((link) => link.addEventListener("click", () => setOpen(false)));
  mobile.addEventListener("change", () => {
    if (!mobile.matches && overlay.classList.contains("active")) setOpen(false, false);
  });
  document.addEventListener("keydown", (event) => {
    if (!overlay.classList.contains("active")) return;

    if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "Tab") {
      const boundary = event.shiftKey ? focusable[0] : focusable.at(-1);
      if (document.activeElement === boundary) {
        event.preventDefault();
        (event.shiftKey ? focusable.at(-1) : focusable[0]).focus();
      }
    }
  });
}

function setVideoSources(video, { webm, mp4 } = {}) {
  video.querySelectorAll("source").forEach((source) => source.remove());
  const fallback = video.firstChild;

  for (const [format, url] of [["webm", webm], ["mp4", mp4]]) {
    if (!url) continue;
    const source = document.createElement("source");
    source.src = url;
    source.type = `video/${format}`;
    video.insertBefore(source, fallback);
  }

  video.load();
}

function initVideoModal(dialog, updatePreviews) {
  if (!dialog) return;

  const video = dialog.querySelector("video");
  let opener;
  let backdropPressed = false;

  function isBackdrop(event) {
    if (event.target !== dialog) return false;
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    return event.clientX < left || event.clientX > right ||
      event.clientY < top || event.clientY > bottom;
  }

  document.querySelectorAll(".open-modal").forEach((button) => {
    button.addEventListener("click", () => {
      if (dialog.open) return;
      opener = button;
      video.poster = button.dataset.poster;
      setVideoSources(video, button.dataset);
      dialog.showModal();
      updatePreviews();
      requestAnimationFrame(() => {
        if (dialog.open) dialog.classList.add("show");
      });
    });
  });

  dialog.querySelector(".close-modal").addEventListener("click", () => dialog.close());
  dialog.addEventListener("pointerdown", (event) => {
    backdropPressed = isBackdrop(event);
  });
  dialog.addEventListener("click", (event) => {
    if (backdropPressed && isBackdrop(event)) dialog.close();
    backdropPressed = false;
  });
  dialog.addEventListener("close", () => {
    if (dialog.open) return;
    video.pause();
    dialog.classList.remove("show");
    updatePreviews();
    opener?.focus({ preventScroll: true });
  });
}

function initPreviews(dialog) {
  const videos = [...document.querySelectorAll(".video-stop")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const nearby = new Set();
  const visible = new Set();

  function update() {
    videos.forEach((video) => {
      const canAnimate = !reducedMotion.matches;
      const hasSources = !!video.querySelector("source");

      if (!canAnimate && hasSources) {
        setVideoSources(video);
      } else if (canAnimate && !hasSources && (nearby.has(video) || visible.has(video))) {
        video.preload = "metadata";
        setVideoSources(video, video.dataset);
      }

      const shouldPlay = canAnimate && visible.has(video) && !dialog?.open &&
        !document.body.classList.contains("menu-open") && !document.hidden;
      if (shouldPlay) video.play().catch(() => {});
      else video.pause();
    });
  }

  function observe(set, options) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) set.add(target);
        else set.delete(target);
      });
      update();
    }, options);

    videos.forEach((video) => observer.observe(video));
  }

  if (videos.length && "IntersectionObserver" in window) {
    observe(nearby, { rootMargin: "200px" });
    observe(visible);
    reducedMotion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
  }

  return update;
}

function initCarousels() {
  document.querySelectorAll(".carousel-container").forEach((container) => {
    const slides = [...container.querySelectorAll(".slide")];
    const carousel = container.querySelector(".carousel");
    if (slides.length < 2 || !carousel) return;

    let current = 0;

    function updateSlides() {
      slides.forEach((slide, index) => {
        const active = index === current;
        slide.classList.toggle("active", active);
        slide.classList.toggle("left", !active && index === (current - 1 + slides.length) % slides.length);
        slide.classList.toggle("right", !active && !slide.classList.contains("left") &&
          index === (current + 1) % slides.length);
        slide.inert = !active;
      });
    }

    function move(step) {
      current = (current + step + slides.length) % slides.length;
      updateSlides();
    }

    container.querySelector(".carousel-prev")?.addEventListener("click", () => move(-1));
    container.querySelector(".carousel-next")?.addEventListener("click", () => move(1));

    let start;
    carousel.addEventListener("touchstart", ({ touches }) => {
      start = touches.length === 1 ? touches[0] : null;
    }, { passive: true });
    carousel.addEventListener("touchend", ({ changedTouches }) => {
      if (!start) return;
      const dx = changedTouches[0].clientX - start.clientX;
      const dy = changedTouches[0].clientY - start.clientY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
      start = null;
    }, { passive: true });
    carousel.addEventListener("touchcancel", () => { start = null; });

    updateSlides();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("videoModal");
  const updatePreviews = initPreviews(dialog);
  initHeader();
  initMobileMenu(updatePreviews);
  initVideoModal(dialog, updatePreviews);
  initCarousels();
});
