/* LOGIN HANDLER (used only on login.html) */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", login);
  }
});

function login(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
      sessionStorage.setItem("user", JSON.stringify({
        name: data.name,
        role: data.role
      }));
      window.location.href = "/frontend/html/dashboard.html";
    })
    .catch(() => alert("Invalid credentials"));
}

/* ===== BASE AUTH HELPERS (USED EVERYWHERE) ===== */

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("user"));
}

function requireAuth() {
  if (!sessionStorage.getItem("user")) {
    window.location.href = "/frontend/html/login.html";
  }
}
