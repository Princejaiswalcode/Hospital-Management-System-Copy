document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showToast("error", "Username and password required");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast("error", data.message || "Invalid credentials");
      return;
    }

    // Save token & user
    sessionStorage.setItem("token", data.data.token);
    sessionStorage.setItem("user", JSON.stringify(data.data.user));

    showToast("success", "Login successful");

    setTimeout(() => {
      window.location.href = "/frontend/html/dashboard.html";
    }, 800);

  } catch (err) {
    showToast("error", "Server error");
  }
});
