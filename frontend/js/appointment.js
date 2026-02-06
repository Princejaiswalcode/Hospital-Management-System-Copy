document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  if (!user || !token) {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
    return;
  }

  loadUserInfo(user);
  bindUI();
  loadPatients(token);
  loadDoctors(token);
  loadAppointments(token);
  setupLogout();
});

/* =========================
   USER INFO
========================= */
function loadUserInfo(user) {
  document.getElementById("userName").innerText = user.full_name;
  document.getElementById("headerUserName").innerText = user.full_name;
  document.getElementById("userRole").innerText = `${user.role} Dashboard`;
  document.getElementById("userAvatar").innerText =
    user.full_name.charAt(0).toUpperCase();
}

/* =========================
   UI BINDINGS
========================= */
function bindUI() {
  const btnShow = document.getElementById("btnShowForm");
  const btnCancel = document.getElementById("btnCancelForm");
  const formCard = document.getElementById("appointmentFormCard");
  const form = document.getElementById("appointmentForm");

  if (!btnShow || !btnCancel || !formCard || !form) return;

  btnShow.onclick = () => {
    formCard.style.display = "block";
  };

  btnCancel.onclick = () => {
    form.reset();
    formCard.style.display = "none";
  };

  form.addEventListener("submit", submitAppointment);
}

/* =========================
   LOAD PATIENTS
========================= */
function loadPatients(token) {
  fetch("http://localhost:5000/api/patients", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(list => {
      const select = document.getElementById("patientSelect");
      if (!select) return;

      select.innerHTML = `<option value="">Select Patient</option>`;
      list.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.patient_id;
        opt.textContent = `${p.first_name} ${p.last_name ?? ""}`;
        select.appendChild(opt);
      });
    })
    .catch(() => showToast("error", "Failed to load patients"));
}

/* =========================
   LOAD DOCTORS
========================= */
function loadDoctors(token) {
  fetch("http://localhost:5000/api/doctors", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(list => {
      const select = document.getElementById("doctorSelect");
      if (!select) return;

      select.innerHTML = `<option value="">Select Doctor</option>`;
      list.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.doctor_id;
        opt.textContent = `Dr. ${d.first_name} ${d.last_name}`;
        select.appendChild(opt);
      });
    })
    .catch(() => showToast("error", "Failed to load doctors"));
}

/* =========================
   AUTO TIME SLOTS (DEMO)
========================= */
const doctorSelect = document.getElementById("doctorSelect");
if (doctorSelect) {
  doctorSelect.onchange = () => {
    const time = document.getElementById("appointmentTime");
    if (!time) return;

    time.innerHTML = `
      <option value="">Select Time</option>
      <option>09:30</option>
      <option>10:30</option>
      <option>11:30</option>
      <option>15:00</option>
      <option>16:00</option>
    `;
  };
}

/* =========================
   LOAD APPOINTMENTS
========================= */
function loadAppointments(token) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  let url = "http://localhost:5000/api/appointments";

  if (user.role === "Doctor") url += "/doctor";
  if (user.role === "Patient") url += "/patient";

  fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(res => renderAppointments(res.data ?? res))
    .catch(() => showToast("error", "Failed to load appointments"));
}

/* =========================
   RENDER APPOINTMENTS (FLAT)
========================= */
function renderAppointments(list) {
  const table = document.getElementById("appointmentsTable");
  table.innerHTML = "";

  if (!Array.isArray(list) || list.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:20px;color:#888">
          No appointments found
        </td>
      </tr>
    `;
    return;
  }

  list.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${a.appointment_id}</td>
      <td>${a.patient_name}</td>
      <td>${a.doctor_name}</td>
      <td>${formatDate(a.appointment_date)}</td>
      <td>${a.appointment_time}</td>
      <td>${a.reason ?? "-"}</td>
      <td>
        <span class="badge ${a.status.toLowerCase()}">
          ${a.status}
        </span>
      </td>
    `;
    table.appendChild(tr);
  });
}

/* =========================
   CREATE APPOINTMENT
========================= */
function submitAppointment(e) {
  e.preventDefault();

  const payload = {
    patient_id: document.getElementById("patientSelect").value,
    doctor_id: document.getElementById("doctorSelect").value,
    appointment_date: document.getElementById("appointmentDate").value,
    appointment_time: document.getElementById("appointmentTime").value,
    reason: document.getElementById("appointmentReason").value,
    notes: document.getElementById("appointmentNotes").value || null
  };

  if (
    !payload.patient_id ||
    !payload.doctor_id ||
    !payload.appointment_date ||
    !payload.appointment_time ||
    !payload.reason
  ) {
    showToast("error", "Please fill all required fields");
    return;
  }

  fetch("http://localhost:5000/api/appointments", {
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
      showToast("success", "Appointment created");
      document.getElementById("appointmentForm").reset();
      document.getElementById("appointmentFormCard").style.display = "none";
      loadAppointments(sessionStorage.getItem("token"));
    })
    .catch(() => showToast("error", "Failed to create appointment"));
}

/* =========================
   DATE FORMATTER
========================= */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

/* =========================
   LOGOUT
========================= */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}
