document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  applyRolePermissions();
  setupFormToggle();
  loadWards();
  loadAdmissions();
  setupLogout();
});

/* USER INFO */
function loadUserInfo() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  userName.innerText = user.name;
  headerUserName.innerText = user.name;
  userRole.innerText = user.role + " Dashboard";
  userAvatar.innerText = user.name.charAt(0).toUpperCase();
}

/* ROLE BASED UI */
function applyRolePermissions() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user.role !== "Admin") {
    document.querySelectorAll(".admin-only").forEach(el => el.remove());
  }
}

/* FORM TOGGLE */
function setupFormToggle() {
  const form = document.getElementById("admitFormCard");

  toggleAdmitBtn.onclick = () => {
    form.classList.toggle("hidden");
  };

  cancelAdmitBtn.onclick = () => {
    form.classList.add("hidden");
  };
}

/* LOAD WARDS */
function loadWards() {
  const mockWards = [
    { name: "General Ward A", total: 20, occupied: 15 },
    { name: "General Ward B", total: 20, occupied: 18 },
    { name: "ICU", total: 10, occupied: 7 },
    { name: "Private Rooms", total: 15, occupied: 10 }
  ];

  const grid = document.getElementById("wardGrid");
  grid.innerHTML = "";

  mockWards.forEach(w => {
    const available = w.total - w.occupied;
    const percent = (w.occupied / w.total) * 100;

    const card = document.createElement("div");
    card.className = "ward-card";
    card.innerHTML = `
      <h4>${w.name}</h4>
      <p>Total: ${w.total} beds</p>
      <p>Occupied: <span class="red">${w.occupied}</span></p>
      <p>Available: <span class="green">${available}</span></p>
      <div class="progress">
        <div class="progress-bar" style="width:${percent}%"></div>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* LOAD ADMISSIONS */
function loadAdmissions() {
  const mockAdmissions = [
    {
      id: "#1",
      name: "Rajesh Kumar",
      ward: "General Ward A",
      admit: "2026-01-10",
      discharge: "-",
      status: "Active"
    },
    {
      id: "#3",
      name: "Suresh Patel",
      ward: "ICU",
      admit: "2026-01-12",
      discharge: "-",
      status: "Active"
    }
  ];

  const table = document.getElementById("admissionTable");
  table.innerHTML = "";

  mockAdmissions.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.id}</td>
      <td><strong>${a.name}</strong></td>
      <td>${a.ward}</td>
      <td>${a.admit}</td>
      <td>${a.discharge}</td>
      <td><span class="badge active">${a.status}</span></td>
      <td class="admin-only">
        <button class="link-btn">Discharge</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

/* LOGOUT */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}
