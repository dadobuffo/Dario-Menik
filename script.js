// HEADER

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

// ARROW ICON

document.querySelector(".hero-arrow-icon").addEventListener("click", (e) => {
  e.preventDefault();
  const target = document.querySelector("#about");
  if (target) {
    const offset = 0;
    const top = target.getBoundingClientRect().top + window.scrollY + offset;

    window.scrollTo({
      top: top,
      behavior: "smooth",
    });
  }
});

// MODALS

const openButtons = document.querySelectorAll(".open-modal");
const modal = document.getElementById("videoModal");
const video = modal.querySelector("video");
const sourceWebm = document.getElementById("videoSourceWebm");
const sourceMp4 = document.getElementById("videoSourceMp4");

openButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    video.poster = btn.dataset.poster;
    sourceWebm.src = btn.dataset.webm;
    sourceMp4.src = btn.dataset.mp4;

    video.load();

    modal.showModal();
    requestAnimationFrame(() => modal.classList.add("show"));
    disableScroll();
  });
});

modal.querySelector(".close-modal").addEventListener("click", () => {
  closeModal(modal);
});

modal.addEventListener("click", (e) => {
  const dialogDimensions = modal.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    closeModal(modal);
  }
});

modal.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeModal(modal);
});

function closeModal(modal) {
  video.pause();
  modal.classList.remove("show");
  enableScroll();
  modal.close();
}

function disableScroll() {
  document.body.style.overflow = "hidden";
}

function enableScroll() {
  document.body.style.overflow = "";
}

// GIF PAUSE

const videos = document.querySelectorAll(".video-stop");

const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
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
