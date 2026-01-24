document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  setupFormToggle();
  applyRolePermissions();
  loadAppointments();
  setupLogout();
});

/* USER INFO */
function loadUserInfo() {
  const user = sessionStorage.getItem("user");
  if (!user) {
    window.location.href = "/frontend/html/login.html";
    return;
  }

  const data = JSON.parse(user);

  userName.innerText = data.name;
  headerUserName.innerText = data.name;
  userRole.innerText = data.role + " Dashboard";
  userAvatar.innerText = data.name.charAt(0).toUpperCase();
}

/* ROLE-BASED UI CONTROL */
function applyRolePermissions() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) return;

  // Roles NOT allowed to create appointments
  const restrictedRoles = ["Doctor", "Nurse", "Patient"];

  if (restrictedRoles.includes(user.role)) {
    toggleForm.style.display = "none";
    appointmentForm.classList.add("hidden");
  }
}

/* FORM TOGGLE */
function setupFormToggle() {
  toggleForm.onclick = () => {
    appointmentForm.classList.toggle("hidden");
  };

  cancelForm.onclick = () => {
    appointmentForm.classList.add("hidden");
  };
}

/* LOAD APPOINTMENTS */
function loadAppointments() {
  fetch("http://localhost:5000/api/appointments")
    .then(res => res.json())
    .then(data => {
      appointmentsTable.innerHTML = "";

      data.forEach(a => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="pid">#${a.id}</td>
          <td class="pname">${a.patient}</td>
          <td>${a.doctor}</td>
          <td>${a.date}</td>
          <td>${a.time}</td>
          <td>${a.type}</td>
          <td>
            <span class="badge ${a.status.toLowerCase()}">
              ${a.status}
            </span>
          </td>
        `;
        appointmentsTable.appendChild(tr);
      });
    })
    .catch(() => {
      showToast("error", "Failed to load appointments");
    });
}

/* CREATE APPOINTMENT */
createAppointment.onclick = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  // Extra safety check
  if (["Doctor", "Nurse", "Patient"].includes(user.role)) {
    showToast("error", "You are not allowed to create appointments");
    return;
  }

  const payload = {
    patient_id: patientSelect.value,
    doctor_id: doctorSelect.value,
    date: appointmentDate.value,
    time: appointmentTime.value,
    type: appointmentType.value
  };

  fetch("http://localhost:5000/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error();
      showToast("success", "Appointment created");
      appointmentForm.classList.add("hidden");
      loadAppointments();
    })
    .catch(() => {
      showToast("error", "Failed to create appointment");
    });
};

/* LOGOUT */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}
