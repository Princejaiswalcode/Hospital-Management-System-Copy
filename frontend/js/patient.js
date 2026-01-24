document.addEventListener("DOMContentLoaded", () => {
  requireAuth();
  loadUserInfo();
  setupFormToggle();
  loadPatients();
  setupSearch();
});

/* =========================
   USER INFO
========================= */
function loadUserInfo() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  document.getElementById("userName").innerText = user.name;
  document.getElementById("headerUserName").innerText = user.name;
  document.getElementById("userRole").innerText = `${user.role} Dashboard`;
  document.getElementById("userAvatar").innerText =
    user.name.charAt(0).toUpperCase();

  // ROLE-BASED UI (future-proof)
  if (user.role === "Nurse" || user.role === "Doctor") {
    document.getElementById("btnShowForm").style.display = "none";
  }
}

/* =========================
   FORM TOGGLE
========================= */
function setupFormToggle() {
  const btnShow = document.getElementById("btnShowForm");
  const btnCancel = document.getElementById("btnCancelForm");
  const formCard = document.getElementById("patientFormCard");

  btnShow.addEventListener("click", () => {
    formCard.style.display = "block";
    btnShow.style.display = "none";
  });

  btnCancel.addEventListener("click", () => {
    formCard.style.display = "none";
    btnShow.style.display = "inline-block";
    document.getElementById("patientForm").reset();
  });

  document
    .getElementById("patientForm")
    .addEventListener("submit", submitPatient);
}

/* =========================
   LOAD PATIENTS
========================= */
function loadPatients() {
  fetch("http://localhost:5000/api/patients")
    .then(res => res.json())
    .then(data => renderPatients(data))
    .catch(() => showToast("error", "Failed to load patients"));
}

function renderPatients(patients) {
  const table = document.getElementById("patientsTable");
  table.innerHTML = "";

  patients.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>#${p.patient_id}</td>
      <td><strong>${p.name}</strong></td>
      <td>${p.age} / ${p.gender}</td>
      <td>${p.contact}</td>
      <td>${p.address}</td>
      <td>
        <span class="badge ${p.status.toLowerCase()}">
          ${p.status}
        </span>
      </td>
    `;

    table.appendChild(tr);
  });
}

/* =========================
   ADD PATIENT
========================= */
function submitPatient(e) {
  e.preventDefault();

  const payload = {
    name: document.getElementById("name").value.trim(),
    gender: document.getElementById("gender").value,
    age: document.getElementById("age").value,
    contact: document.getElementById("contact").value.trim(),
    address: document.getElementById("address").value.trim(),
    status: document.getElementById("status").value
  };

  fetch("http://localhost:5000/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      showToast("success", "Patient registered successfully");
      document.getElementById("patientForm").reset();
      document.getElementById("patientFormCard").style.display = "none";
      document.getElementById("btnShowForm").style.display = "inline-block";
      loadPatients();
    })
    .catch(() => showToast("error", "Failed to add patient"));
}

/* =========================
   SEARCH
========================= */
function setupSearch() {
  const input = document.getElementById("searchInput");

  input.addEventListener("keyup", () => {
    const value = input.value.toLowerCase();
    const rows = document.querySelectorAll("#patientsTable tr");

    rows.forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(value)
        ? ""
        : "none";
    });
  });
}
