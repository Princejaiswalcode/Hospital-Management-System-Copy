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
  const name = user.full_name || "User";

  document.getElementById("welcomeText").innerText = `Welcome, ${name}`;
  document.getElementById("headerUserName").innerText = name;
  document.getElementById("userRole").innerText =
    `${capitalize(user.role)} Dashboard`;
  document.getElementById("userAvatar").innerText =
    name.charAt(0).toUpperCase();
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
   LOAD DASHBOARD
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

    console.log("Dashboard API Response:", json.data);
    renderDashboard(json.data);

  } catch (err) {
    showToast("error", err.message || "Dashboard load failed");
  }
}

/* ===============================
   RENDER DASHBOARD
================================ */
function renderDashboard(data) {
  /* ===== COUNTS (DIRECT FROM API) ===== */
  setText("totalPatients", data.totalPatients);
  setText("todayAppointments", data.todayAppointments);
  setText("admittedPatients", data.admittedPatients);
  setText("pendingBills", data.pendingBills);
  setText("treatmentsCompleted", data.treatmentsCompleted);
  setText("totalBeds", data.totalBeds);

  /* ===== LISTS ===== */
  if (data.lists) {
    renderRecentPatients(data.lists.recentPatients);
    renderUpcomingAppointments(data.lists.upcomingAppointments);
    renderWardOccupancy(data.lists.wardOccupancy);
    renderRecentBills(data.lists.recentBills);
  }
}

/* ===============================
   LIST RENDERERS
================================ */
function renderRecentPatients(list = []) {
  const ul = document.getElementById("recentPatients");
  if (!ul) return;

  ul.innerHTML = "";
  list.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.first_name} ${p.last_name}`;
    ul.appendChild(li);
  });
}

function renderUpcomingAppointments(list = []) {
  const ul = document.getElementById("upcomingAppointments");
  if (!ul) return;

  ul.innerHTML = "";
  list.forEach(a => {
    const li = document.createElement("li");
    li.textContent =
      `${a.first_name} ${a.last_name} – ${a.appointment_date} ${a.appointment_time}`;
    ul.appendChild(li);
  });
}

function renderWardOccupancy(list = []) {
  const div = document.getElementById("wardOccupancy");
  if (!div) return;

  div.innerHTML = "";
  list.forEach(w => {
    const p = document.createElement("p");
    p.textContent =
      `${w.ward_name}: ${w.available_beds}/${w.total_beds} beds available`;
    div.appendChild(p);
  });
}

function renderRecentBills(list = []) {
  const ul = document.getElementById("recentBills");
  if (!ul) return;

  ul.innerHTML = "";
  list.forEach(b => {
    const li = document.createElement("li");
    li.textContent =
      `${b.first_name} ${b.last_name} – ₹${b.total_amount} (${b.payment_status})`;
    ul.appendChild(li);
  });
}

/* ===============================
   HELPERS
================================ */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined && value !== null) {
    el.innerText = value;
  }
}

function capitalize(text = "") {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ===============================
   LOGOUT
================================ */
function setupLogout() {
  const btn = document.querySelector(".logout");
  if (btn) {
    btn.onclick = () => {
      sessionStorage.clear();
      window.location.href = "/frontend/html/login.html";
    };
  }
}
