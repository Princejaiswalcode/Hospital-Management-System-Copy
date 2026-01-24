document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  applyUserInfo(user);
  applyRoleAccess(user.role);
  loadDashboardData(user);
  setupLogout();
});

/* ===============================
   USER INFO
================================ */
function applyUserInfo(user) {
  document.getElementById("welcomeText").innerText = `Welcome, ${user.name}`;
  document.getElementById("headerUserName").innerText = user.name;
  document.getElementById("userRole").innerText = `${capitalize(user.role)} Dashboard`;
  document.getElementById("userAvatar").innerText =
    user.name.charAt(0).toUpperCase();
}

/* ===============================
   ROLE BASED ACCESS
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
   DASHBOARD DATA (MOCK + API READY)
================================ */
function loadDashboardData(user) {
  switch (user.role) {
    case "admin":
      loadAdminDashboard();
      break;
    case "doctor":
      loadDoctorDashboard();
      break;
    case "nurse":
      loadNurseDashboard();
      break;
    case "reception":
      loadReceptionDashboard();
      break;
    case "accounts":
      loadAccountsDashboard();
      break;
    case "patient":
      loadPatientDashboard(user);
      break;
  }
}

/* ===============================
   ADMIN
================================ */
function loadAdminDashboard() {
  setText("totalPatients", 15);
  setText("todayAppointments", 2);
  setText("admittedPatients", 5);
  setText("pendingBills", 0);

  fillList("recentPatients", [
    "Rajesh Kumar – Admitted",
    "Priya Sharma – Observation",
    "Suresh Patel – Admitted"
  ]);

  fillList("upcomingAppointments", [
    "Rajesh Kumar – 10:00",
    "Priya Sharma – 11:00"
  ]);
}

/* ===============================
   DOCTOR
================================ */
function loadDoctorDashboard() {
  setText("todayAppointments", 2);
  setText("totalPatients", 3);
  setText("treatmentsCompleted", 1);

  fillList("upcomingAppointments", [
    "Rajesh Kumar – 10:00",
    "Priya Sharma – 11:00"
  ]);

  fillList("recentTreatments", [
    "Suresh Patel – Hypertension"
  ]);
}

/* ===============================
   NURSE
================================ */
function loadNurseDashboard() {
  setText("admittedPatients", 5);
  setText("totalBeds", 65);

  fillList("recentPatients", [
    "Rajesh Kumar",
    "Suresh Patel",
    "Vikram Singh"
  ]);

  const ward = document.getElementById("wardOccupancy");
  ward.innerHTML = `
    <div>General Ward A - 15/20</div>
    <div>General Ward B - 18/20</div>
    <div>ICU - 7/10</div>
    <div>Private Rooms - 10/15</div>
  `;
}

/* ===============================
   RECEPTION
================================ */
function loadReceptionDashboard() {
  setText("totalPatients", 15);
  setText("todayAppointments", 2);

  fillList("upcomingAppointments", [
    "Rajesh Kumar – 10:00",
    "Priya Sharma – 11:00"
  ]);

  fillList("recentPatients", [
    "Rajesh Kumar",
    "Priya Sharma",
    "Ananya Reddy"
  ]);
}

/* ===============================
   ACCOUNTS
================================ */
function loadAccountsDashboard() {
  setText("pendingBills", 0);

  fillList("recentBills", [
    "Ananya Reddy – ₹1700 (Paid)"
  ]);

  fillList("recentSalary", [
    "Dr. Arun Mehta – ₹80,000",
    "Nurse Kavita Singh – ₹35,000"
  ]);
}

/* ===============================
   PATIENT
================================ */
function loadPatientDashboard(user) {
  setText("todayAppointments", 1);
  setText("pendingBills", 0);

  fillList("upcomingAppointments", [
    "Dr. Arun Mehta – 10:00"
  ]);

  fillList("recentTreatments", [
    "No treatment records"
  ]);
}

/* ===============================
   HELPERS
================================ */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

function fillList(id, items) {
  const ul = document.getElementById(id);
  if (!ul) return;

  ul.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    ul.appendChild(li);
  });
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
