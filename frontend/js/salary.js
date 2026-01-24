document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  applyRoleAccess();
  setupFormToggle();
  loadStaff();
  loadSalaryHistory();
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

/* ROLE BASED ACCESS */
function applyRoleAccess() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  // ONLY ADMIN & ACCOUNTS CAN PROCESS SALARY
  if (!["Admin", "Accounts"].includes(user.role)) {
    document.getElementById("toggleSalaryForm").style.display = "none";
    document.getElementById("salaryForm").style.display = "none";
  }
}

/* FORM TOGGLE */
function setupFormToggle() {
  toggleSalaryForm.onclick = () => {
    salaryForm.classList.toggle("hidden");
  };

  cancelSalaryForm.onclick = () => {
    salaryForm.classList.add("hidden");
  };
}

/* LOAD STAFF CARDS */
function loadStaff() {
  // Backend-ready
  // fetch("http://localhost:5000/api/staff")

  const staff = [
    {
      id: 1,
      name: "Dr. Arun Mehta",
      role: "Doctor",
      salary: 80000,
      specialization: "Cardiology",
      contact: "+91-98765-00201",
    },
    {
      id: 2,
      name: "Nurse Kavita Singh",
      role: "Nurse",
      salary: 35000,
      contact: "+91-98765-00202",
    },
  ];

  staffCards.innerHTML = "";
  staffSelect.innerHTML = `<option value="">Select Staff</option>`;

  staff.forEach(s => {
    staffCards.innerHTML += `
      <div class="staff-card">
        <div class="avatar-circle">${s.name.charAt(0)}</div>
        <h4>${s.name}</h4>
        <p>${s.role}</p>
        ${s.specialization ? `<p>Specialization: ${s.specialization}</p>` : ""}
        <p>Contact: ${s.contact}</p>
        <p class="salary">Salary: ₹${s.salary.toLocaleString()}</p>
      </div>
    `;

    staffSelect.innerHTML += `
      <option value="${s.id}">${s.name}</option>
    `;
  });
}

/* LOAD SALARY HISTORY */
function loadSalaryHistory() {
  // Backend-ready
  // fetch("http://localhost:5000/api/salary/history")

  const history = [
    {
      staff: "Dr. Arun Mehta",
      amount: 80000,
      date: "2026-01-01",
      status: "Paid",
    },
  ];

  salaryTable.innerHTML = "";

  history.forEach(h => {
    salaryTable.innerHTML += `
      <tr>
        <td><strong>${h.staff}</strong></td>
        <td>₹${h.amount.toLocaleString()}</td>
        <td>${h.date}</td>
        <td>
          <span class="badge paid">${h.status}</span>
        </td>
      </tr>
    `;
  });
}

/* PROCESS SALARY */
processSalaryBtn.onclick = () => {
  if (!staffSelect.value || !salaryAmount.value || !paymentDate.value) {
    showToast("error", "Please fill all fields");
    return;
  }

  // Backend-ready POST
  // fetch("http://localhost:5000/api/salary", { method: "POST", body: ... })

  showToast("success", "Salary payment processed");
  salaryForm.classList.add("hidden");
  loadSalaryHistory();
};

/* LOGOUT */
function setupLogout() {
  document.querySelector(".logout").onclick = () => {
    sessionStorage.clear();
    window.location.href = "/frontend/html/login.html";
  };
}
