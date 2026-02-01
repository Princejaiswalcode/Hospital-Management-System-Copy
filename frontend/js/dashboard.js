document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  if (!user || !token) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  applyUserInfo(user);
  applyRoleAccess(user.role);
  loadDashboardFromAPI(token);
  setupLogout();
});

/* ===============================
   USER INFO
================================ */
function applyUserInfo(user) {
  document.getElementById("welcomeText").innerText = `Welcome, ${user.full_name}`;
  document.getElementById("headerUserName").innerText = user.full_name;
  document.getElementById("userRole").innerText =
    `${capitalize(user.role)} Dashboard`;
  document.getElementById("userAvatar").innerText =
    user.full_name.charAt(0).toUpperCase();
}

/* ===============================
   ROLE ACCESS
================================ */
function applyRoleAccess(role) {
  document.querySelectorAll("[data-role]").forEach(el => {
    const allowed = el.dataset.role.split(",");
    if (!allowed.includes(role)) {
      el.style.display = "none";
    }
  });
}

/* ===============================
   LOAD DASHBOARD (REAL API)
================================ */
async function loadDashboardFromAPI(token) {
  try {
    const res = await fetch("http://localhost:5000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message);

    const data = json.data;
    renderDashboard(data);

  } catch (err) {
    showToast("error", err.message || "Dashboard load failed");
  }
}

/* ===============================
   RENDER DATA
================================ */
function renderDashboard(data) {
  setText("totalPatients", data.totalPatients);
  setText("todayAppointments", data.todayAppointments);
  setText("admittedPatients", data.admittedPatients);
  setText("pendingBills", data.pendingBills);
  setText("treatmentsCompleted", data.treatmentsCompleted);
  setText("totalBeds", data.totalBeds);
  setText("todayAppointments", data.upcomingAppointments);
}


/* ===============================
   HELPERS
================================ */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) {
    el.innerText = value;
  }
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ===============================
   LOGOUT
================================ */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}
