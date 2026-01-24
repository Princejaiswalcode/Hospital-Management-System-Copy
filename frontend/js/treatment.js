document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  applyRolePermissions();
  loadTreatments();
  setupFormActions();
  setupLogout();
});

/* USER INFO */
function loadUserInfo() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  document.getElementById("userName").innerText = user.name;
  document.getElementById("headerUserName").innerText = user.name;
  document.getElementById("userRole").innerText = user.role + " Dashboard";
  document.getElementById("userAvatar").innerText =
    user.name.charAt(0).toUpperCase();
}

/* ROLE-BASED UI CONTROL */
function applyRolePermissions() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) return;

  // Roles NOT allowed to add treatment
  const restrictedRoles = ["Nurse", "Reception", "Patient"];

  if (restrictedRoles.includes(user.role)) {
    document.getElementById("addTreatmentBtn").style.display = "none";
    document.getElementById("treatmentFormCard").classList.add("hidden");
  }
}

/* LOAD TREATMENTS */
function loadTreatments() {
  // Backend-ready fetch
  // fetch("http://localhost:5000/api/treatments")

  const mockData = [
    {
      patientId: "#3",
      patientName: "Suresh Patel",
      diagnosis: "Hypertension",
      medicines: "Amlodipine 5mg, Aspirin 75mg",
      date: "2026-01-13",
    },
    {
      patientId: "#4",
      patientName: "Ananya Reddy",
      diagnosis: "Viral Fever",
      medicines: "Paracetamol 500mg, Azithromycin 250mg",
      date: "2026-01-12",
    },
  ];

  const table = document.getElementById("treatmentTable");
  table.innerHTML = "";

  mockData.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.patientId}</td>
      <td><strong>${t.patientName}</strong></td>
      <td>${t.diagnosis}</td>
      <td>${t.medicines}</td>
      <td>${t.date}</td>
    `;
    table.appendChild(tr);
  });
}

/* FORM ACTIONS */
function setupFormActions() {
  const formCard = document.getElementById("treatmentFormCard");

  document.getElementById("addTreatmentBtn").onclick = () => {
    formCard.classList.remove("hidden");
  };

  document.getElementById("cancelTreatmentBtn").onclick = () => {
    formCard.classList.add("hidden");
    clearForm();
  };

  document.getElementById("saveTreatmentBtn").onclick = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    // Extra safety
    if (["Nurse", "Reception", "Patient"].includes(user.role)) {
      showToast("error", "You are not allowed to add treatment");
      return;
    }

    const appointment = document.getElementById("appointmentSelect").value;
    const diagnosis = document.getElementById("diagnosis").value.trim();
    const medicines = document.getElementById("medicines").value.trim();

    if (!appointment || !diagnosis || !medicines) {
      showToast("error", "Please fill all fields");
      return;
    }

    // Backend-ready POST
    // fetch("http://localhost:5000/api/treatments", { method: "POST", body: ... })

    showToast("success", "Treatment added successfully");
    formCard.classList.add("hidden");
    clearForm();
    loadTreatments();
  };
}

function clearForm() {
  document.getElementById("appointmentSelect").value = "";
  document.getElementById("diagnosis").value = "";
  document.getElementById("medicines").value = "";
}

/* LOGOUT */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}
