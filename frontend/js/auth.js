document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  // 🔒 Only run on login page
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    if (!usernameInput || !passwordInput) {
      showToast("error", "Login form is broken");
      return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showToast("error", "Username and password required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.message || "Invalid credentials");
        return;
      }

      // ✅ Save auth data
      sessionStorage.setItem("token", data.data.token);
      sessionStorage.setItem("user", JSON.stringify(data.data.user));

      showToast("success", "Login successful");

      setTimeout(() => {
        window.location.href = "/frontend/html/dashboard.html";
      }, 600);

    } catch (err) {
      showToast("error", "Server error");
    }
  });
});
