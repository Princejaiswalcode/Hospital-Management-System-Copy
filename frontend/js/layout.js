document.addEventListener("DOMContentLoaded", () => {
  enforceRoleBasedNav();
  setupNavRouting();
  highlightActiveNav();
  setupLogout();
});

/* =========================
   ROLE-BASED SIDEBAR LOCK
========================= */
function enforceRoleBasedNav() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user || !user.role) {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
    return;
  }

  const role = user.role.toLowerCase();

  document.querySelectorAll("#sidebarNav a[data-role]").forEach(link => {
    const allowed = link.dataset.role
      .split(",")
      .map(r => r.trim().toLowerCase());

    if (!allowed.includes(role)) {
      link.remove(); // 🔒 permanent removal
    }
  });
}

/* =========================
   NAVIGATION (NO href)
========================= */
function setupNavRouting() {
  const pageMap = {
    dashboard: "dashboard.html",
    patients: "patient.html",
    appointments: "appointment.html",
    treatments: "treatment.html",
    wards: "wards.html",
    billing: "billing.html",
    salary: "salary.html",
    profile: "profile.html",
    myAppointments: "my-appointment.html",
    myBills: "my-bills.html"
  };

  document.querySelectorAll("#sidebarNav a[data-page]").forEach(link => {
    link.addEventListener("click", () => {
      const pageKey = link.dataset.page;
      const target = pageMap[pageKey];

      if (!target) return;

      window.location.href = `/frontend/html/${target}`;
    });
  });
}

/* =========================
   ACTIVE NAV HIGHLIGHT
========================= */
function highlightActiveNav() {
  const current = window.location.pathname.split("/").pop();

  document.querySelectorAll("#sidebarNav a[data-page]").forEach(link => {
    link.classList.remove("active");

    const pageKey = link.dataset.page;
    if (current.includes(pageKey)) {
      link.classList.add("active");
    }
  });
}

/* =========================
   LOGOUT
========================= */
function setupLogout() {
  const btn = document.querySelector(".logout");
  if (!btn) return;

  btn.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  });
}
