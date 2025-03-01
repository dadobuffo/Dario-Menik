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
