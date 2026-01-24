document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  setupLogout();
});

function setActiveNav() {
  const navLinks = document.querySelectorAll("#sidebarNav a");
  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(currentPage)) {
      link.classList.add("active");
    }
  });
}

function setupLogout() {
  const btn = document.querySelector(".logout");
  if (btn) {
    btn.addEventListener("click", () => {
      sessionStorage.clear();
      window.location.href = "/frontend/html/login.html";
    });
  }
}
