document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
    return;
  }

  loadUserInfo();
  bindUI();
  loadPatients();
  setupSearch();
});

/* =========================
   USER INFO
========================= */
function loadUserInfo() {
  const data = JSON.parse(sessionStorage.getItem("user"));

  document.getElementById("userName").innerText = data.full_name;
  document.getElementById("headerUserName").innerText = data.full_name;
  document.getElementById("userRole").innerText = `${data.role} Dashboard`;
  document.getElementById("userAvatar").innerText =
    data.full_name.charAt(0).toUpperCase();
}

/* =========================
   UI BINDINGS
========================= */
function bindUI() {
  const btnShow = document.getElementById("btnShowForm");
  const btnCancel = document.getElementById("btnCancelForm");
  const formCard = document.getElementById("patientFormCard");
  const form = document.getElementById("patientForm");

  btnShow.addEventListener("click", () => {
    formCard.style.display = "block";
    btnShow.style.display = "none";
  });

  btnCancel.addEventListener("click", () => {
    formCard.style.display = "none";
    btnShow.style.display = "inline-block";
    form.reset();
  });

  form.addEventListener("submit", submitPatient);
}

/* =========================
   LOAD PATIENTS
========================= */
function loadPatients() {
  const token = sessionStorage.getItem("token");

  fetch("http://localhost:5000/api/patients", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(renderPatients)
    .catch(() =>
      showToast("error", "Failed to load patients")
    );
}

function renderPatients(patients) {
  const table = document.getElementById("patientsTable");
  table.innerHTML = "";

  patients.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>#${p.patient_id}</td>
      <td><strong>${p.first_name} ${p.last_name ?? ""}</strong></td>
      <td>${p.age ?? "-"} / ${p.gender}</td>
      <td>${p.phone ?? "-"}</td>
      <td>${p.address ?? "-"}</td>
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
   ADD PATIENT (FIXED)
========================= */
/* =========================
   ADD PATIENT
========================= */
function submitPatient(e) {
  e.preventDefault();

  const payload = {
    first_name: document.getElementById("first_name").value.trim(),
    last_name: document.getElementById("last_name").value.trim() || null,
    gender: document.getElementById("gender").value,
    date_of_birth: document.getElementById("date_of_birth").value,
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim() || null,
    address: document.getElementById("address").value.trim(),
    blood_group: document.getElementById("blood_group").value || null,
    emergency_contact:
      document.getElementById("emergency_contact").value.trim() || null,
    status: document.getElementById("status").value
  };

  // Required validation
  if (
    !payload.first_name ||
    !payload.gender ||
    !payload.date_of_birth ||
    !payload.phone ||
    !payload.status
  ) {
    showToast("error", "Please fill all required fields");
    return;
  }

  fetch("http://localhost:5000/api/patients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      showToast("success", "Patient added successfully");
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
    document.querySelectorAll("#patientsTable tr").forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(value)
        ? ""
        : "none";
    });
  });
}
